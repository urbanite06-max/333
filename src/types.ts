/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string | null; // 'YYYY-MM-DD' or null
  completed: boolean;
  createdAt: number; // timestamp
  completedAt?: number | null;
}

export type TaskFilter = 'all' | 'active' | 'today' | 'overdue' | 'completed';

export type TaskSort = 'created-desc' | 'due-asc' | 'priority-desc' | 'title-asc';

export interface TaskStatusInfo {
  isOverdue: boolean;
  isToday: boolean;
  isFuture: boolean;
  hasDueDate: boolean;
  statusLabel: string;
  badgeClass: string;
}
