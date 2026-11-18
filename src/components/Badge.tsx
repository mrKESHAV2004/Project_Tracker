'use client';

import React from 'react';
import { ProjectStatus, ProjectCategory, TaskStatus } from '@/models/Project';

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  active: {
    label: 'Active',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/20',
  },
  inactive: {
    label: 'Inactive',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    dot: 'bg-zinc-400',
    border: 'border-zinc-500/20',
  },
  'on-hold': {
    label: 'On Hold',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    border: 'border-amber-500/20',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
    border: 'border-blue-500/20',
  },
};

export function StatusBadge({ status }: { status?: ProjectStatus }) {
  const current = status && STATUS_CONFIG[status] ? STATUS_CONFIG[status] : STATUS_CONFIG.active;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${current.bg} ${current.text} ${current.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
}

const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  planned: {
    label: 'Planned',
    bg: 'bg-zinc-800',
    text: 'text-zinc-400',
    border: 'border-zinc-700/60',
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
  },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const cfg = TASK_STATUS_CONFIG[status] || TASK_STATUS_CONFIG.planned;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {cfg.label}
    </span>
  );
}

export function CategoryBadge({
  category,
  clientName,
}: {
  category?: ProjectCategory;
  clientName?: string;
}) {
  if (category === 'client') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
        <span className="text-sky-500 font-semibold">Client</span>
        {clientName && (
          <>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-200 truncate max-w-[120px]">{clientName}</span>
          </>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
      Personal
    </span>
  );
}
