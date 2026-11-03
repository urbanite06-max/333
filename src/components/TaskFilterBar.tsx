/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TaskFilter, TaskSort } from '../types';
import { Search, ArrowUpDown, X } from 'lucide-react';

interface TaskFilterBarProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentSort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  currentSort,
  onSortChange,
}) => {
  const filterOptions: { id: TaskFilter; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'active', label: '진행 중' },
    { id: 'today', label: '오늘 마감' },
    { id: 'overdue', label: '기한 지남' },
    { id: 'completed', label: '완료됨' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 mb-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Filter Tabs - Horizontal scroll on mobile without clipping */}
      <div 
        className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none -mx-1 px-1 touch-pan-x" 
        role="tablist"
      >
        {filterOptions.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={currentFilter === tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0 min-h-[38px] flex items-center cursor-pointer whitespace-nowrap ${
              currentFilter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Sort - Stack cleanly on small screens */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 lg:max-w-md justify-end">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="업무명으로 검색..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:bg-white min-h-[40px]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="검색어 지우기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="relative shrink-0 sm:w-auto w-full">
          <label htmlFor="task-sort-select" className="sr-only">정렬 기준</label>
          <select
            id="task-sort-select"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as TaskSort)}
            className="w-full sm:w-auto appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold py-2 pl-8 pr-8 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 cursor-pointer min-h-[40px]"
          >
            <option value="created-desc">최신 등록순</option>
            <option value="due-asc">마감일 빠른순</option>
            <option value="priority-desc">우선순위 높은순</option>
            <option value="title-asc">제목 가나다순</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
