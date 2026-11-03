/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Plus, Calendar, X, AlertCircle, PlusCircle, Check } from 'lucide-react';
import { Priority } from '../types';
import { getLocalTodayString, addDaysToToday, formatKoreanDate } from '../utils/dateUtils';

interface TaskFormProps {
  onAddTask: (title: string, priority: Priority, dueDate: string | null) => boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const todayStr = getLocalTodayString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty or whitespace-only title and guide reason
    if (!title || !title.trim()) {
      setErrorMessage('업무 제목을 입력해 주세요. 공백만으로는 등록할 수 없습니다.');
      titleInputRef.current?.focus();
      return;
    }

    setErrorMessage(null);
    const trimmedTitle = title.trim();
    const finalDueDate = dueDate.trim() ? dueDate : null;

    const success = onAddTask(trimmedTitle, priority, finalDueDate);
    if (success) {
      // Reset form on success, preserve default priority 'medium'
      setTitle('');
      setPriority('medium');
      setDueDate('');
      titleInputRef.current?.focus();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const setQuickDate = (dateString: string | null) => {
    setDueDate(dateString || '');
  };

  return (
    <section 
      aria-label="새 업무 등록"
      className="bg-white border-2 border-blue-100 rounded-2xl p-5 sm:p-7 shadow-sm ring-4 ring-blue-50/50 mb-8 transition-all"
    >
      {/* Header of Input Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-5 border-b border-slate-100 gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <PlusCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              새 업무 등록
            </h2>
            <p className="text-xs text-slate-500">
              할 일의 제목과 우선순위, 마감일을 설정하여 등록하세요
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium self-start sm:self-auto">
          * 마감일은 선택사항입니다
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* 1. 업무명 등록 */}
        <div className="mb-5">
          <label htmlFor="task-title" className="block text-sm font-bold text-slate-800 mb-2">
            업무명 <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="task-title"
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="진행할 업무 내용을 구체적으로 입력하세요 (예: 2분기 예산안 검토)"
              className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border text-sm sm:text-base text-slate-900 bg-white placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errorMessage
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-blue-100 focus:border-blue-600'
              }`}
            />
            {title && (
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  titleInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 cursor-pointer"
                aria-label="입력 내용 지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {errorMessage && (
            <p className="mt-2 text-xs sm:text-sm text-rose-600 flex items-center gap-1.5 font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </p>
          )}
        </div>

        {/* 2. 우선순위 & 3. 마감일 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* 우선순위 선택: 높음 / 보통 / 낮음, 기본값 보통 (색상 + 글자 명시) */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              우선순위 선택 <span className="text-xs font-normal text-slate-500">(기본값: 보통)</span>
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="우선순위 선택">
              {/* 높음 */}
              <button
                type="button"
                role="radio"
                aria-checked={priority === 'high'}
                onClick={() => setPriority('high')}
                className={`py-2.5 px-2 sm:px-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all min-h-[46px] cursor-pointer ${
                  priority === 'high'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shrink-0" />
                <span>높음</span>
              </button>

              {/* 보통 (기본값) */}
              <button
                type="button"
                role="radio"
                aria-checked={priority === 'medium'}
                onClick={() => setPriority('medium')}
                className={`py-2.5 px-2 sm:px-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all min-h-[46px] cursor-pointer ${
                  priority === 'medium'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-200 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shrink-0" />
                <span>보통</span>
              </button>

              {/* 낮음 */}
              <button
                type="button"
                role="radio"
                aria-checked={priority === 'low'}
                onClick={() => setPriority('low')}
                className={`py-2.5 px-2 sm:px-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all min-h-[46px] cursor-pointer ${
                  priority === 'low'
                    ? 'border-slate-600 bg-slate-100 text-slate-800 ring-2 ring-slate-300 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block shrink-0" />
                <span>낮음</span>
              </button>
            </div>
          </div>

          {/* 마감일 (선택사항, 없으면 ‘마감일 없음’) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="task-due-date" className="text-sm font-bold text-slate-800">
                마감일 설정 <span className="text-xs font-normal text-slate-500">(선택사항)</span>
              </label>
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setQuickDate(null)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>마감일 해제</span>
                </button>
              )}
            </div>
            
            <div className="relative">
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 min-h-[46px]"
              />
            </div>

            {/* Quick date shortcuts (Responsive wrapping, never truncated) */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => setQuickDate(todayStr)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer min-h-[32px] flex items-center ${
                  dueDate === todayStr
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                오늘 마감
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(addDaysToToday(1))}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer min-h-[32px] flex items-center ${
                  dueDate === addDaysToToday(1)
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                내일 마감
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(addDaysToToday(7))}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer min-h-[32px] flex items-center ${
                  dueDate === addDaysToToday(7)
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                일주일 후
              </button>
              <span className="text-xs text-slate-500 font-medium ml-auto hidden sm:inline-block">
                {dueDate ? formatKoreanDate(dueDate) : '마감일 없음'}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button - Clear, full width on mobile, comfortable touch area */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-7 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>업무 등록하기</span>
          </button>
        </div>
      </form>
    </section>
  );
};
