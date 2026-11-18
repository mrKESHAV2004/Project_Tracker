'use client';

import React from 'react';
import { IProject, IProjectLink } from '@/models/Project';
import { StatusBadge, CategoryBadge } from './Badge';
import { LinkIcon, getLinkLabel } from './LinkIcon';
import { formatRelativeTime } from '@/lib/utils';
import {
  Edit2,
  Trash2,
  CheckSquare,
  MessageSquare,
  Clock,
  ArrowUpRight,
  Pin,
} from 'lucide-react';

interface ProjectCardProps {
  project: IProject;
  onEdit: (project: IProject) => void;
  onDelete: (project: IProject) => void;
  onClick: (project: IProject) => void;
  onTogglePin?: (project: IProject) => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onClick,
  onTogglePin,
}: ProjectCardProps) {
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const notesCount = project.notes?.length || 0;
  const latestNote = project.notes && project.notes.length > 0 ? project.notes[0] : null;
  const isPinned = Boolean(project.pinned);

  return (
    <div
      onClick={() => onClick(project)}
      className={`group relative flex flex-col justify-between bg-zinc-900/70 hover:bg-zinc-900 border rounded-xl p-4 cursor-pointer transition-colors ${
        isPinned
          ? 'border-zinc-700/80 bg-zinc-900/90 shadow-sm shadow-black/20'
          : 'border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      <div>
        {/* Top: Category + Status + Pin + Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isPinned && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25"
                title="Pinned project"
              >
                <Pin className="w-2.5 h-2.5 fill-amber-400 rotate-45" />
                <span>Pinned</span>
              </span>
            )}
            <CategoryBadge
              category={project.category}
              clientName={project.clientName}
            />
            <StatusBadge status={project.status} />
          </div>

          <div
            className="flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pin Toggle Button */}
            {onTogglePin && (
              <button
                onClick={() => onTogglePin(project)}
                className={`p-1 rounded transition-colors ${
                  isPinned
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 opacity-0 group-hover:opacity-100'
                }`}
                title={isPinned ? 'Unpin project' : 'Pin to top'}
              >
                <Pin
                  className={`w-3.5 h-3.5 rotate-45 ${
                    isPinned ? 'fill-amber-400' : ''
                  }`}
                />
              </button>
            )}

            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(project)}
                className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                title="Edit project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(project)}
                className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors truncate mb-1">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3 min-h-[2rem]">
          {project.description || 'No description provided.'}
        </p>

        {/* Tasks Summary */}
        <div className="mb-3 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-zinc-400 font-medium">
              <CheckSquare className="w-3.5 h-3.5 text-zinc-500" />
              <span>Tasks</span>
            </span>
            {tasks.length > 0 ? (
              <span className="text-zinc-400 font-mono text-[11px]">
                <strong className="text-zinc-200">{completedTasks}</strong>/{tasks.length} done
              </span>
            ) : (
              <span className="text-zinc-600 italic">No tasks yet</span>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%`,
                  }}
                />
              </div>
              {inProgressTasks > 0 && (
                <span className="text-[10px] text-amber-400 font-medium whitespace-nowrap">
                  {inProgressTasks} active
                </span>
              )}
            </div>
          )}
        </div>

        {/* Links */}
        {project.links && project.links.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3" onClick={(e) => e.stopPropagation()}>
            {project.links.slice(0, 4).map((link: IProjectLink, idx: number) => {
              const label = link.label || getLinkLabel(link.type);
              return (
                <a
                  key={link._id ? String(link._id) : idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-medium transition-colors"
                  title={`${label}: ${link.url}`}
                >
                  <LinkIcon type={link.type} size={13} />
                  <span className="truncate max-w-[90px]">{label}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-zinc-500" />
                </a>
              );
            })}
            {project.links.length > 4 && (
              <span className="inline-flex items-center px-1.5 py-1 text-[11px] text-zinc-500 font-mono">
                +{project.links.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800/60 text-zinc-400 border border-zinc-700/40"
              >
                #{tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] text-zinc-600 font-mono self-center">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Latest update & Relative time */}
      <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <MessageSquare className="w-3 h-3 text-zinc-500 shrink-0" />
          {latestNote ? (
            <span className="truncate text-zinc-400">&quot;{latestNote.content}&quot;</span>
          ) : (
            <span className="text-zinc-600">{notesCount} updates</span>
          )}
        </div>

        {project.updatedAt && (
          <span className="flex items-center gap-1 shrink-0 text-zinc-500 font-mono text-[10px]">
            <Clock className="w-3 h-3 text-zinc-600" />
            {formatRelativeTime(String(project.updatedAt))}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
