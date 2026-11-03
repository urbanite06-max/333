/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, TaskStatusInfo } from '../types';

/**
 * Returns the current date in YYYY-MM-DD format based on the user's local timezone.
 */
export function getLocalTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes status information for a task strictly adhering to the requirements:
 * 1. If completed, never marked as '기한 지남'.
 * 2. If no due date, shows '마감일 없음'.
 * 3. If today, shows '오늘 마감' (today is NEVER overdue).
 * 4. If due date is strictly before today and not completed, shows '기한 지남'.
 */
export function getTaskStatusInfo(task: Task, todayStr = getLocalTodayString()): TaskStatusInfo {
  if (!task.dueDate) {
    return {
      isOverdue: false,
      isToday: false,
      isFuture: false,
      hasDueDate: false,
      statusLabel: '마감일 없음',
      badgeClass: 'text-slate-500 bg-slate-100 border-slate-200',
    };
  }

  // If already completed, exclude from overdue
  if (task.completed) {
    return {
      isOverdue: false,
      isToday: task.dueDate === todayStr,
      isFuture: task.dueDate > todayStr,
      hasDueDate: true,
      statusLabel: '완료됨',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }

  // Overdue: strictly before today and NOT completed
  if (task.dueDate < todayStr) {
    return {
      isOverdue: true,
      isToday: false,
      isFuture: false,
      hasDueDate: true,
      statusLabel: '기한 지남',
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-300 font-semibold',
    };
  }

  // Today's deadline: today is NEVER overdue
  if (task.dueDate === todayStr) {
    return {
      isOverdue: false,
      isToday: true,
      isFuture: false,
      hasDueDate: true,
      statusLabel: '오늘 마감',
      badgeClass: 'text-amber-800 bg-amber-50 border-amber-300 font-semibold',
    };
  }

  // Future due date
  const diffDays = calculateDaysDifference(todayStr, task.dueDate);
  return {
    isOverdue: false,
    isToday: false,
    isFuture: true,
    hasDueDate: true,
    statusLabel: diffDays === 1 ? '내일 마감 (D-1)' : `D-${diffDays}`,
    badgeClass: 'text-blue-700 bg-blue-50 border-blue-200',
  };
}

/**
 * Calculates day difference between two 'YYYY-MM-DD' strings.
 */
export function calculateDaysDifference(startDateStr: string, endDateStr: string): number {
  const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
  const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number);
  
  const start = new Date(sYear, sMonth - 1, sDay);
  const end = new Date(eYear, eMonth - 1, eDay);
  
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats YYYY-MM-DD into Korean date format e.g. "2026.11.03 (화)"
 */
export function formatKoreanDate(dateStr: string | null): string {
  if (!dateStr) return '마감일 없음';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const [year, month, day] = parts.map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[dateObj.getDay()];
  
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')} (${dayName})`;
}

/**
 * Adds days to today's date string.
 */
export function addDaysToToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
