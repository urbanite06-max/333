/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { ClipboardList, SearchX, PlusCircle, CheckSquare } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTasksCount,
  onToggleComplete,
  onDeleteTask,
  onUpdateTask,
  onResetFilters,
  isFiltered,
}) => {
  return (
    <section aria-label="업무 목록" className="mt-8">
      {/* Section Header: Clear separation between input and list */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
            <CheckSquare className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            등록된 업무 목록
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {tasks.length}개
          </span>
        </div>
      </div>

      {/* 1. Global Empty State (No tasks at all) */}
      {totalTasksCount === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 sm:p-14 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 ring-8 ring-blue-50/50">
            <ClipboardList className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            아직 등록된 업무가 없습니다
          </h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-6 break-keep leading-relaxed">
            상단 입력창에서 첫 번째 업무를 등록해 보세요. 우선순위(높음/보통/낮음)와 마감일을 지정하여 깔끔하게 관리할 수 있습니다.
          </p>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
            <PlusCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>상단 입력창에 업무명을 입력한 후 [업무 등록하기]를 눌러주세요</span>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        /* 2. Filtered Empty State */
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1.5">
            조건에 일치하는 업무가 없습니다
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-5">
            선택한 필터 또는 검색어와 일치하는 업무가 없습니다.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer min-h-[40px]"
          >
            필터 및 검색 초기화
          </button>
        </div>
      ) : (
        /* 3. Task List Render with generous spacing */
        <div className="space-y-3.5 sm:space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
            />
          ))}
        </div>
      )}
    </section>
  );
};
