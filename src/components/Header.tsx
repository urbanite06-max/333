/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckSquare, HardDrive, AlertCircle } from 'lucide-react';
import { STORAGE_NOTICE } from '../utils/storage';
import { formatKoreanDate, getLocalTodayString } from '../utils/dateUtils';

interface HeaderProps {
  storageError: string | null;
  onClearStorageError: () => void;
}

export const Header: React.FC<HeaderProps> = ({ storageError, onClearStorageError }) => {
  const todayStr = getLocalTodayString();
  const formattedToday = formatKoreanDate(todayStr);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 ring-4 ring-blue-50">
              <CheckSquare className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  내 업무 플래너
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  개인용
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                오늘 기준일: <span className="text-slate-800 font-bold">{formattedToday}</span>
              </p>
            </div>
          </div>

          {/* Storage notice guide - clean text without clipping */}
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 sm:self-center">
            <HardDrive className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="leading-tight break-keep font-medium">
              {STORAGE_NOTICE}
            </span>
          </div>
        </div>

        {/* Storage Failure Banner */}
        {storageError && (
          <div 
            role="alert" 
            className="mt-4 p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start justify-between gap-3 text-rose-800 text-sm animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-rose-900">저장되지 않았습니다.</strong>
                <p className="text-xs sm:text-sm text-rose-700 mt-0.5">{storageError}</p>
              </div>
            </div>
            <button
              onClick={onClearStorageError}
              className="text-xs text-rose-700 hover:text-rose-900 underline font-bold shrink-0 px-2 py-1 cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
