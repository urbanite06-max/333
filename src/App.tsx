/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, Priority, TaskFilter, TaskSort } from './types';
import { loadTasksFromStorage, saveTasksToStorage, generateTaskId, STORAGE_NOTICE } from './utils/storage';
import { getTaskStatusInfo, getLocalTodayString } from './utils/dateUtils';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskList } from './components/TaskList';
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Start with empty list initially if storage is empty - no sample data injection
    const { tasks: initialTasks } = loadTasksFromStorage();
    return initialTasks;
  });

  const [storageError, setStorageError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentSort, setCurrentSort] = useState<TaskSort>('created-desc');

  // Undo Toast state when a task is deleted
  const [deletedTaskBackup, setDeletedTaskBackup] = useState<{ task: Task; index: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to persist tasks immediately and handle storage failures
  const persistTasks = useCallback((updatedTasks: Task[]): boolean => {
    setTasks(updatedTasks);
    const result = saveTasksToStorage(updatedTasks);
    if (!result.success) {
      setStorageError(result.error || '저장되지 않았습니다. 브라우저 저장소 설정을 확인해 주세요.');
      return false;
    } else {
      setStorageError(null);
      return true;
    }
  }, []);

  // 1. 업무 등록
  const handleAddTask = (title: string, priority: Priority, dueDate: string | null): boolean => {
    const newTask: Task = {
      id: generateTaskId(),
      title,
      priority,
      dueDate,
      completed: false,
      createdAt: Date.now(),
    };

    const nextTasks = [newTask, ...tasks];
    const success = persistTasks(nextTasks);
    
    if (success) {
      showToast('업무가 등록되었습니다.');
    }
    return success;
  };

  // 2. 완료 여부 토글 (체크 / 해제)
  const handleToggleComplete = (id: string) => {
    const nextTasks = tasks.map((task) => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        return {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? Date.now() : null,
        };
      }
      return task;
    });

    persistTasks(nextTasks);
  };

  // 3. 업무 삭제 (선택한 항목만 삭제 + 실행 취소 제공)
  const handleDeleteTask = (id: string) => {
    const taskToDeleteIndex = tasks.findIndex((t) => t.id === id);
    if (taskToDeleteIndex === -1) return;

    const taskToDelete = tasks[taskToDeleteIndex];
    const nextTasks = tasks.filter((t) => t.id !== id);
    
    persistTasks(nextTasks);
    setDeletedTaskBackup({ task: taskToDelete, index: taskToDeleteIndex });
    showToast(`'${taskToDelete.title}' 업무가 삭제되었습니다.`, true);
  };

  // 실행 취소 (Undo Delete)
  const handleUndoDelete = () => {
    if (!deletedTaskBackup) return;
    const restoredTasks = [...tasks];
    restoredTasks.splice(deletedTaskBackup.index, 0, deletedTaskBackup.task);
    persistTasks(restoredTasks);
    setDeletedTaskBackup(null);
    setToastMessage(null);
  };

  // 4. 업무 수정
  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    const nextTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, ...updates };
      }
      return task;
    });

    persistTasks(nextTasks);
    showToast('업무가 수정되었습니다.');
  };

  // Toast notification helper
  const showToast = (message: string, isDelete = false) => {
    setToastMessage(message);
    const duration = isDelete ? 5000 : 2500;
    const timer = setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
      if (isDelete) {
        setDeletedTaskBackup(null);
      }
    }, duration);
    return () => clearTimeout(timer);
  };

  // Filter & Search & Sort logic
  const filteredAndSortedTasks = useMemo(() => {
    const todayStr = getLocalTodayString();

    // 1. Filter
    let result = tasks.filter((task) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (!task.title.toLowerCase().includes(q)) {
          return false;
        }
      }

      // Tab filter
      const status = getTaskStatusInfo(task, todayStr);
      if (currentFilter === 'active') {
        return !task.completed;
      }
      if (currentFilter === 'completed') {
        return task.completed;
      }
      if (currentFilter === 'today') {
        return !task.completed && status.isToday;
      }
      if (currentFilter === 'overdue') {
        return !task.completed && status.isOverdue;
      }
      return true; // 'all'
    });

    // 2. Sort
    result.sort((a, b) => {
      if (currentSort === 'created-desc') {
        return b.createdAt - a.createdAt;
      }
      if (currentSort === 'due-asc') {
        // Items with due dates come first, sorted ascending; items without due date come last
        if (a.dueDate && b.dueDate) {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        return b.createdAt - a.createdAt;
      }
      if (currentSort === 'priority-desc') {
        const weight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        const diff = weight[b.priority] - weight[a.priority];
        if (diff !== 0) return diff;
        return b.createdAt - a.createdAt;
      }
      if (currentSort === 'title-asc') {
        return a.title.localeCompare(b.title, 'ko');
      }
      return 0;
    });

    return result;
  }, [tasks, currentFilter, searchQuery, currentSort]);

  const isFiltered = currentFilter !== 'all' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setCurrentFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Header with logo, date, storage guide, and failure banner */}
      <Header
        storageError={storageError}
        onClearStorageError={() => setStorageError(null)}
      />

      {/* Main Single-Screen Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Task Registration Form (Distinct Input Section) */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Clear Visual Divider between Input Area & Management Area */}
        <div className="relative my-8 sm:my-10">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t-2 border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-50 px-4 text-xs sm:text-sm font-bold text-slate-500 tracking-tight">
              업무 현황 및 관리 목록
            </span>
          </div>
        </div>

        {/* Task Overview Stats (Counters) */}
        <TaskStats
          tasks={tasks}
          activeFilter={currentFilter}
          onSelectFilter={(f) => setCurrentFilter(f)}
        />

        {/* Filter, Search & Sort Controls (only displayed if tasks exist or filters applied) */}
        {tasks.length > 0 && (
          <TaskFilterBar
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentSort={currentSort}
            onSortChange={setCurrentSort}
          />
        )}

        {/* Task List (With starting empty guidance & responsive cards) */}
        <TaskList
          tasks={filteredAndSortedTasks}
          totalTasksCount={tasks.length}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />
      </main>

      {/* Toast Notification with Undo */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          {deletedTaskBackup && (
            <button
              onClick={handleUndoDelete}
              className="ml-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-blue-200 text-xs font-semibold rounded border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>실행 취소</span>
            </button>
          )}
        </div>
      )}

      {/* Subtle Footer with storage notice */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>내 업무 플래너 — 모든 데이터는 {STORAGE_NOTICE}</span>
          </div>
          <p className="text-slate-400">
            로컬 브라우저 전용 플래너
          </p>
        </div>
      </footer>
    </div>
  );
}
