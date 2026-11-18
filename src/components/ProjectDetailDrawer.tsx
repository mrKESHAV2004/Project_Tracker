'use client';

import React, { useState } from 'react';
import {
  X,
  Edit2,
  Trash2,
  Plus,
  Send,
  CheckSquare,
  MessageSquare,
  Clock,
  Layers,
  ArrowUpRight,
  Circle,
  Clock3,
  CheckCircle2,
  Pin,
} from 'lucide-react';
import {
  IProject,
  IProjectLink,
  IProjectNote,
  IProjectTask,
  ProjectStatus,
  TaskStatus,
} from '@/models/Project';
import { CategoryBadge } from './Badge';
import { LinkIcon, getLinkLabel } from './LinkIcon';
import { formatRelativeTime } from '@/lib/utils';

interface ProjectDetailDrawerProps {
  project: IProject | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: IProject) => void;
  onStatusChange: (projectId: string, newStatus: ProjectStatus) => Promise<void>;
  onAddNote: (projectId: string, content: string) => Promise<void>;
  onDeleteNote: (projectId: string, noteId: string) => Promise<void>;
  onAddTask: (projectId: string, title: string, status: TaskStatus) => Promise<void>;
  onUpdateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => Promise<void>;
  onDeleteTask: (projectId: string, taskId: string) => Promise<void>;
  onTogglePin?: (projectId: string, pinned: boolean) => Promise<void>;
}

export function ProjectDetailDrawer({
  project,
  isOpen,
  onClose,
  onEdit,
  onStatusChange,
  onAddNote,
  onDeleteNote,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onTogglePin,
}: ProjectDetailDrawerProps) {
  // Tasks state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('planned');
  const [addingTask, setAddingTask] = useState(false);

  // Notes state
  const [noteContent, setNoteContent] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  if (!isOpen || !project) return null;

  const projectId = String(project._id);
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || addingTask) return;

    try {
      setAddingTask(true);
      await onAddTask(projectId, taskTitle.trim(), taskStatus);
      setTaskTitle('');
      setTaskStatus('planned');
    } finally {
      setAddingTask(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || submittingNote) return;

    try {
      setSubmittingNote(true);
      await onAddNote(projectId, noteContent.trim());
      setNoteContent('');
    } finally {
      setSubmittingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg h-full bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 shrink-0">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-zinc-100 truncate">
                {project.name}
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <CategoryBadge
                  category={project.category}
                  clientName={project.clientName}
                />
                <select
                  value={project.status}
                  onChange={(e) =>
                    onStatusChange(projectId, e.target.value as ProjectStatus)
                  }
                  className="text-xs bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-200 rounded px-2 py-0.5 focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onTogglePin && (
                <button
                  onClick={() => onTogglePin(projectId, !project.pinned)}
                  className={`p-1.5 rounded transition-colors ${
                    project.pinned
                      ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                  title={project.pinned ? 'Unpin Project' : 'Pin Project'}
                >
                  <Pin className={`w-4 h-4 rotate-45 ${project.pinned ? 'fill-amber-400' : ''}`} />
                </button>
              )}
              <button
                onClick={() => onEdit(project)}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-xs text-zinc-300 leading-relaxed mt-2 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {project.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[11px] font-mono rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TASKS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                <CheckSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>Tasks</span>
                {tasks.length > 0 && (
                  <span className="text-zinc-500 font-mono text-[11px]">
                    ({completedTasks}/{tasks.length})
                  </span>
                )}
              </div>
            </div>

            {/* Quick Add Task Form */}
            <form onSubmit={handleCreateTask} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Add a new task headline..."
                disabled={addingTask}
                className="flex-1 px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
              <select
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                className="px-2 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-none"
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button
                type="submit"
                disabled={addingTask || !taskTitle.trim()}
                className="px-3 py-1.5 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-white rounded-lg transition-colors disabled:opacity-40 shrink-0 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Tasks List */}
            {tasks.length > 0 ? (
              <div className="space-y-1.5">
                {tasks.map((task: IProjectTask, idx: number) => {
                  const taskId = String(task._id || idx);
                  return (
                    <div
                      key={taskId}
                      className="group flex items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Status Icon / Cycle */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus: TaskStatus =
                              task.status === 'planned'
                                ? 'in-progress'
                                : task.status === 'in-progress'
                                ? 'completed'
                                : 'planned';
                            onUpdateTaskStatus(projectId, taskId, nextStatus);
                          }}
                          className="shrink-0 p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                          title="Click to advance status"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : task.status === 'in-progress' ? (
                            <Clock3 className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-600" />
                          )}
                        </button>

                        <span
                          className={`text-xs text-zinc-200 truncate ${
                            task.status === 'completed'
                              ? 'line-through text-zinc-500'
                              : ''
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status selector */}
                        <select
                          value={task.status}
                          onChange={(e) =>
                            onUpdateTaskStatus(
                              projectId,
                              taskId,
                              e.target.value as TaskStatus
                            )
                          }
                          className="text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-400 rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          <option value="planned">Planned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => onDeleteTask(projectId, taskId)}
                          className="p-1 text-zinc-600 hover:text-red-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-center rounded-lg bg-zinc-950/40 border border-dashed border-zinc-800/80">
                <p className="text-xs text-zinc-500 italic">No tasks added yet.</p>
              </div>
            )}
          </div>

          {/* LINKS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Links & Services</span>
              </div>
              <span className="text-[11px] text-zinc-500">
                {project.links?.length || 0} attached
              </span>
            </div>

            {project.links && project.links.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.links.map((link: IProjectLink, i: number) => {
                  const label = link.label || getLinkLabel(link.type);
                  return (
                    <a
                      key={link._id ? String(link._id) : i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 transition-colors group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <LinkIcon type={link.type} size={14} />
                        <span className="truncate font-medium">{label}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-center rounded-lg bg-zinc-950/40 border border-dashed border-zinc-800/80">
                <p className="text-xs text-zinc-500 italic">No links connected.</p>
              </div>
            )}
          </div>

          {/* NOTES & UPDATES SECTION */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>Updates & Notes</span>
              </div>
              <span className="text-[11px] text-zinc-500">
                {project.notes?.length || 0} logged
              </span>
            </div>

            {project.notes && project.notes.length > 0 ? (
              <div className="space-y-2">
                {project.notes.map((note: IProjectNote, idx: number) => {
                  const noteId = String(note._id || idx);
                  return (
                    <div
                      key={noteId}
                      className="group p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          <span>{formatRelativeTime(String(note.createdAt))}</span>
                        </span>
                        {note._id && (
                          <button
                            type="button"
                            onClick={() => onDeleteNote(projectId, noteId)}
                            className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            title="Delete note"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-center rounded-lg bg-zinc-950/40 border border-dashed border-zinc-800/80">
                <p className="text-xs text-zinc-500 italic">No updates logged yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Add Note Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 shrink-0">
          <form onSubmit={handleCreateNote} className="flex gap-2">
            <input
              type="text"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Log an update or note..."
              disabled={submittingNote}
              className="flex-1 px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
            <button
              type="submit"
              disabled={submittingNote || !noteContent.trim()}
              className="px-3.5 py-2 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-white rounded-lg transition-colors disabled:opacity-40 shrink-0 flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Log</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailDrawer;
