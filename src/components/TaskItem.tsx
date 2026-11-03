/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '../types';
import { getTaskStatusInfo, formatKoreanDate } from '../utils/dateUtils';
import { Check, Trash2, Edit3, Calendar, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
  onUpdateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editDueDate, setEditDueDate] = useState<string>(task.dueDate || '');
  const [editError, setEditError] = useState<string | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const statusInfo = getTaskStatusInfo(task);

  // Priority color and text definition
  const priorityConfig = {
    high: {
      text: '높음',
      fullLabel: '우선순위: 높음',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      dotColor: 'bg-rose-500',
    },
    medium: {
      text: '보통',
      fullLabel: '우선순위: 보통',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      dotColor: 'bg-blue-600',
    },
    low: {
      text: '낮음',
      fullLabel: '우선순위: 낮음',
      textColor: 'text-slate-700',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-300',
      dotColor: 'bg-slate-500',
    },
  }[task.priority];

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!editTitle || !editTitle.trim()) {
      setEditError('업무 제목을 입력해 주세요. 공백만으로는 저장할 수 없습니다.');
      editInputRef.current?.focus();
      return;
    }

    onUpdateTask(task.id, {
      title: editTitle.trim(),
      priority: editPriority,
      dueDate: editDueDate.trim() ? editDueDate : null,
    });

    setIsEditing(false);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setEditError(null);
    setIsEditing(false);
  };

  return (
    <article
      className={`relative bg-white border-2 rounded-2xl transition-all shadow-xs ${
        task.completed
          ? 'border-slate-200 bg-slate-50/70 opacity-85'
          : statusInfo.isOverdue
          ? 'border-rose-200 hover:border-rose-300'
          : statusInfo.isToday
          ? 'border-amber-200 hover:border-amber-300'
          : 'border-slate-200 hover:border-blue-200'
      }`}
    >
      {/* Edit Mode View */}
      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="p-4 sm:p-6">
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              업무명 수정
            </label>
            <input
              ref={editInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError) setEditError(null);
              }}
              className="w-full px-3.5 py-2.5 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            {editError && (
              <p className="mt-1.5 text-xs text-rose-600 font-semibold">{editError}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Priority selection in edit */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
                우선순위 변경
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => {
                  const label = p === 'high' ? '높음' : p === 'medium' ? '보통' : '낮음';
                  const dot = p === 'high' ? 'bg-rose-500' : p === 'medium' ? 'bg-blue-600' : 'bg-slate-400';
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPriority(p)}
                      className={`py-2 px-2 text-xs sm:text-sm font-medium rounded-lg border flex items-center justify-center gap-1.5 min-h-[40px] transition-colors cursor-pointer ${
                        editPriority === p
                          ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-200 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due date selection in edit */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800">마감일 변경</label>
                {editDueDate && (
                  <button
                    type="button"
                    onClick={() => setEditDueDate('')}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                  >
                    마감일 해제
                  </button>
                )}
              </div>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[40px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg min-h-[40px] cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs min-h-[40px] cursor-pointer"
            >
              저장
            </button>
          </div>
        </form>
      ) : (
        /* Regular Task Card */
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          {/* Top section: Checkbox, Title, and Action Buttons */}
          <div className="flex items-start gap-3 sm:gap-4">
            {/* 1. Large, Easy-to-tap Checkbox with Check state */}
            <button
              type="button"
              role="checkbox"
              aria-checked={task.completed}
              aria-label={task.completed ? `${task.title} 미완료로 변경` : `${task.title} 완료로 변경`}
              onClick={() => onToggleComplete(task.id)}
              className={`mt-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                task.completed
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-transparent'
              }`}
            >
              <Check className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[2.8] ${task.completed ? 'block' : 'opacity-0'}`} />
            </button>

            {/* 2. Task Title - Prominent, readable typography with strikethrough when completed */}
            <div className="flex-1 min-w-0 pr-1">
              <h3
                className={`text-base sm:text-lg font-bold tracking-tight leading-snug sm:leading-relaxed break-words break-keep transition-colors ${
                  task.completed
                    ? 'line-through decoration-slate-400 decoration-2 text-slate-400 font-normal'
                    : 'text-slate-900'
                }`}
              >
                {task.title}
              </h3>
            </div>

            {/* 3. Action Buttons - Edit & Delete (shrink-0 so never truncated or pushed out) */}
            <div className="flex items-center gap-1 shrink-0 self-start">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center"
                title="업무 수정"
                aria-label={`${task.title} 수정`}
              >
                <Edit3 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="p-2 sm:p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center"
                title="업무 삭제"
                aria-label={`${task.title} 삭제`}
              >
                <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>
          </div>

          {/* Bottom metadata row: Priority (Color + '높음/보통/낮음' Text) & Due Date / Status */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs sm:text-sm">
            {/* Priority Indicator: Color + Text together */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-bold text-xs sm:text-xs shrink-0 ${priorityConfig.bgColor} ${priorityConfig.borderColor} ${priorityConfig.textColor}`}
              >
                <span className={`w-2 h-2 rounded-full ${priorityConfig.dotColor} shrink-0`} />
                <span>{priorityConfig.fullLabel}</span>
              </span>

              {/* Status Badges: 기한 지남 / 오늘 마감 / 완료됨 */}
              {statusInfo.isOverdue && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-bold bg-rose-50 border-rose-300 text-rose-700 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>기한 지남</span>
                </span>
              )}

              {statusInfo.isToday && !task.completed && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-bold bg-amber-50 border-amber-300 text-amber-800 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>오늘 마감</span>
                </span>
              )}

              {task.completed && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-semibold bg-emerald-50 border-emerald-200 text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>완료됨</span>
                </span>
              )}
            </div>

            {/* Due Date Display (Formatted in Korean with Calendar Icon) */}
            <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs sm:text-xs shrink-0 ml-auto sm:ml-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {task.dueDate ? (
                <span className="break-keep">
                  <span>마감: {formatKoreanDate(task.dueDate)}</span>
                  {!task.completed && !statusInfo.isOverdue && !statusInfo.isToday && statusInfo.statusLabel && (
                    <span className="ml-1 text-blue-600 font-bold">
                      ({statusInfo.statusLabel})
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-slate-400 font-normal">마감일 없음</span>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
