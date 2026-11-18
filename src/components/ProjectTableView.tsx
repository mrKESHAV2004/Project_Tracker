'use client';

import React from 'react';
import { IProject, IProjectLink } from '@/models/Project';
import { StatusBadge, CategoryBadge } from './Badge';
import { LinkIcon, getLinkLabel } from './LinkIcon';
import { formatRelativeTime } from '@/lib/utils';
import { Edit2, Trash2, ArrowUpRight, CheckSquare, Pin } from 'lucide-react';

interface ProjectTableViewProps {
  projects: IProject[];
  onEdit: (project: IProject) => void;
  onDelete: (project: IProject) => void;
  onClick: (project: IProject) => void;
  onTogglePin?: (project: IProject) => void;
}

export function ProjectTableView({
  projects,
  onEdit,
  onDelete,
  onClick,
  onTogglePin,
}: ProjectTableViewProps) {
  if (projects.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/60">
      <table className="w-full text-left text-xs text-zinc-300">
        <thead className="bg-zinc-900/90 text-[11px] uppercase text-zinc-400 border-b border-zinc-800 tracking-wider">
          <tr>
            <th className="py-3 px-3 w-8"></th>
            <th className="py-3 px-4 font-semibold">Project</th>
            <th className="py-3 px-4 font-semibold">Category</th>
            <th className="py-3 px-4 font-semibold">Status</th>
            <th className="py-3 px-4 font-semibold">Tasks</th>
            <th className="py-3 px-4 font-semibold">Links</th>
            <th className="py-3 px-4 font-semibold">Updated</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {projects.map((project) => {
            const projectId = String(project._id);
            const tasks = project.tasks || [];
            const completedTasks = tasks.filter((t) => t.status === 'completed').length;
            const isPinned = Boolean(project.pinned);

            return (
              <tr
                key={projectId}
                onClick={() => onClick(project)}
                className={`hover:bg-zinc-800/40 transition-colors cursor-pointer group ${
                  isPinned ? 'bg-zinc-900/40' : ''
                }`}
              >
                {/* Pin button */}
                <td className="py-3.5 pl-3 pr-1" onClick={(e) => e.stopPropagation()}>
                  {onTogglePin && (
                    <button
                      onClick={() => onTogglePin(project)}
                      className={`p-1 rounded transition-colors ${
                        isPinned
                          ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                          : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 opacity-0 group-hover:opacity-100'
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
                </td>

                {/* Project Name & Description */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-semibold text-zinc-100 group-hover:text-white truncate flex items-center gap-1.5">
                    <span>{project.name}</span>
                    {isPinned && (
                      <span className="text-[10px] font-mono text-amber-400 px-1 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                        PINNED
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {project.description}
                    </div>
                  )}
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <CategoryBadge
                    category={project.category}
                    clientName={project.clientName}
                  />
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={project.status} />
                </td>

                {/* Tasks */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {tasks.length > 0 ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-300">
                      <CheckSquare className="w-3 h-3 text-zinc-500" />
                      <span>{completedTasks}/{tasks.length}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-600 italic text-[11px]">No tasks</span>
                  )}
                </td>

                {/* Links */}
                <td className="py-3.5 px-4">
                  {project.links && project.links.length > 0 ? (
                    <div
                      className="flex items-center gap-1.5 flex-wrap max-w-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {project.links.slice(0, 3).map((link: IProjectLink, idx: number) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] transition-colors"
                          title={`${link.label || getLinkLabel(link.type)}: ${link.url}`}
                        >
                          <LinkIcon type={link.type} size={12} />
                          <span className="truncate max-w-[80px]">
                            {link.label || getLinkLabel(link.type)}
                          </span>
                          <ArrowUpRight className="w-2.5 h-2.5 text-zinc-500" />
                        </a>
                      ))}
                      {project.links.length > 3 && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          +{project.links.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-zinc-600 italic text-[11px]">—</span>
                  )}
                </td>

                {/* Updated */}
                <td className="py-3.5 px-4 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                  {project.updatedAt ? formatRelativeTime(String(project.updatedAt)) : '—'}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div
                    className="flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onEdit(project)}
                      className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(project)}
                      className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectTableView;
