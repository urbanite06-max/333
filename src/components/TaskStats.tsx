/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Task, TaskFilter } from '../types';
import { getTaskStatusInfo } from '../utils/dateUtils';
import { Clock, AlertTriangle, ListTodo, CheckCircle2 } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
  activeFilter: TaskFilter;
  onSelectFilter: (filter: TaskFilter) => void;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks, activeFilter, onSelectFilter }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const inProgress = total - completed;

  // Compute overdue and today counts based on local time rules
  let overdueCount = 0;
  let todayCount = 0;

  tasks.forEach(task => {
    const status = getTaskStatusInfo(task);
    if (status.isOverdue) overdueCount++;
    if (status.isToday && !task.completed) todayCount++;
  });

  const stats = [
    {
      id: 'all' as TaskFilter,
      label: '전체 업무',
      count: total,
      icon: ListTodo,
      color: 'text-slate-900',
      activeBorder: 'border-slate-900 bg-slate-50',
    },
    {
      id: 'active' as TaskFilter,
      label: '진행 중',
      count: inProgress,
      icon: Clock,
      color: 'text-blue-600',
      activeBorder: 'border-blue-600 bg-blue-50/50',
    },
    {
      id: 'today' as TaskFilter,
      label: '오늘 마감',
      count: todayCount,
      icon: Clock,
      color: todayCount > 0 ? 'text-amber-600 font-extrabold' : 'text-slate-600',
      activeBorder: 'border-amber-600 bg-amber-50/50',
    },
    {
      id: 'overdue' as TaskFilter,
      label: '기한 지남',
      count: overdueCount,
      icon: AlertTriangle,
      color: overdueCount > 0 ? 'text-rose-600 font-extrabold' : 'text-slate-600',
      activeBorder: 'border-rose-600 bg-rose-50/50',
    },
    {
      id: 'completed' as TaskFilter,
      label: '완료됨',
      count: completed,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      activeBorder: 'border-emerald-600 bg-emerald-50/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 mb-7">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeFilter === item.id;
        // On 2-col layout, make the 5th item full width across 2 columns
        const isLastOnMobile = idx === 4 ? 'col-span-2 sm:col-span-1 lg:col-span-1' : '';

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectFilter(item.id)}
            className={`p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] sm:min-h-[80px] ${isLastOnMobile} ${
              isActive
                ? `${item.activeBorder} shadow-xs ring-2 ring-blue-500/10`
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs sm:text-xs text-slate-500 font-semibold mb-1.5">
              <span>{item.label}</span>
              <Icon className="w-4 h-4 opacity-75 shrink-0" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${item.color}`}>
                {item.count}
              </span>
              <span className="text-xs text-slate-400 font-medium">건</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
