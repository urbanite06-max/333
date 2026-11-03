/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task } from '../types';

export const STORAGE_KEY = 'my_work_planner_tasks_v1';
export const STORAGE_NOTICE = '이 브라우저에 저장되며 다른 기기와 자동 동기화되지 않습니다';

export interface StorageResult {
  success: boolean;
  error?: string;
}

/**
 * Generate unique ID for each task so items don't collide or get lost.
 */
export function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Load tasks from localStorage.
 * Guaranteed to start with an empty list if nothing has been saved yet (no dummy/sample injection).
 */
export function loadTasksFromStorage(): { tasks: Task[]; error: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { tasks: [], error: null };
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { tasks: [], error: null };
    }
    // Clean and validate structure
    const validTasks: Task[] = parsed.filter(item => (
      item &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      ['high', 'medium', 'low'].includes(item.priority) &&
      (item.dueDate === null || typeof item.dueDate === 'string') &&
      typeof item.completed === 'boolean'
    ));
    return { tasks: validTasks, error: null };
  } catch (err) {
    console.error('Failed to load tasks from localStorage:', err);
    return { tasks: [], error: '저장된 업무를 불러오는 중 오류가 발생했습니다.' };
  }
}

/**
 * Save tasks to localStorage immediately with error catching.
 */
export function saveTasksToStorage(tasks: Task[]): StorageResult {
  try {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, serialized);
    return { success: true };
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
    return {
      success: false,
      error: '저장되지 않았습니다. 브라우저 저장 공간이 부족하거나 보안 설정으로 인해 저장이 차단되었을 수 있습니다.',
    };
  }
}
