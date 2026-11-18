'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { IProject } from '@/models/Project';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  project: IProject | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  project,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-5">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-300 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Delete Project</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="text-zinc-200 font-medium">&quot;{project.name}&quot;</span>?
              All links, updates, and tasks will be permanently removed.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-zinc-800">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
