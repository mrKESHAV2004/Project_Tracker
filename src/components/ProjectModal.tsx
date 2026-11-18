'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Link as LinkIconLucide, User, Building2 } from 'lucide-react';
import {
  IProject,
  IProjectLink,
  LinkType,
  ProjectStatus,
  ProjectCategory,
} from '@/models/Project';
import { LinkIcon, getLinkLabel } from './LinkIcon';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<IProject>) => Promise<void>;
  initialProject?: IProject | null;
}

const AVAILABLE_LINK_TYPES: { type: LinkType; label: string; placeholder: string }[] = [
  { type: 'github', label: 'GitHub', placeholder: 'https://github.com/org/repo' },
  { type: 'mongodb', label: 'MongoDB', placeholder: 'mongodb+srv://... or Atlas URI' },
  { type: 'supabase', label: 'Supabase', placeholder: 'https://supabase.com/dashboard/project/...' },
  { type: 'firebase', label: 'Firebase', placeholder: 'https://console.firebase.google.com/...' },
  { type: 'vercel', label: 'Vercel', placeholder: 'https://vercel.com/...' },
  { type: 'live', label: 'Live Site', placeholder: 'https://myproject.com' },
  { type: 'docs', label: 'Docs', placeholder: 'https://docs.myproject.com' },
  { type: 'other', label: 'Other', placeholder: 'https://...' },
];

function ProjectFormInner({
  initialProject,
  onClose,
  onSave,
}: {
  initialProject?: IProject | null;
  onClose: () => void;
  onSave: (projectData: Partial<IProject>) => Promise<void>;
}) {
  const [name, setName] = useState(initialProject?.name || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [category, setCategory] = useState<ProjectCategory>(
    initialProject?.category || 'personal'
  );
  const [clientName, setClientName] = useState(initialProject?.clientName || '');
  const [status, setStatus] = useState<ProjectStatus>(initialProject?.status || 'active');
  const [tagsInput, setTagsInput] = useState(
    initialProject?.tags ? initialProject.tags.join(', ') : ''
  );
  const [links, setLinks] = useState<IProjectLink[]>(
    initialProject?.links
      ? [...initialProject.links]
      : [
          { type: 'github', url: '', label: 'GitHub' },
        ]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLink = (type: LinkType = 'github') => {
    setLinks((prev) => [...prev, { type, url: '', label: getLinkLabel(type) }]);
  };

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof IProjectLink, value: string) => {
    setLinks((prev) => {
      const updated = [...prev];
      let val = value;
      if (
        field === 'url' &&
        value.trim() &&
        !value.startsWith('http://') &&
        !value.startsWith('https://') &&
        !value.startsWith('mongodb://') &&
        !value.startsWith('mongodb+srv://')
      ) {
        if (value.includes('.')) {
          val = `https://${value.trim()}`;
        }
      }
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    if (category === 'client' && !clientName.trim()) {
      setError('Please provide a client name');
      return;
    }

    const validLinks = links.filter((l) => l.url && l.url.trim().length > 0);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: Partial<IProject> = {
      name: name.trim(),
      description: description.trim(),
      category,
      clientName: category === 'client' ? clientName.trim() : '',
      status,
      tags,
      links: validLinks,
    };

    try {
      setLoading(true);
      setError(null);
      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl my-6 overflow-hidden flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/90 shrink-0">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            {initialProject ? 'Edit Project' : 'New Project'}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure project details, links, category and status.
          </p>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
        {error && (
          <div className="p-3 text-xs text-red-400 bg-red-950/30 border border-red-800/50 rounded-lg">
            {error}
          </div>
        )}

        {/* Project Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Project Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Portfolio Website, Admin Dashboard..."
            className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        {/* Category: Personal vs Client */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Category</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCategory('personal')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                category === 'personal'
                  ? 'bg-zinc-800 text-white border-zinc-600'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal Project</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('client')}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                category === 'client'
                  ? 'bg-sky-950/40 text-sky-300 border-sky-600'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Client Project</span>
            </button>
          </div>

          {/* Client Name Input (shown only if category === 'client') */}
          {category === 'client' && (
            <div className="mt-2.5 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
              <label className="block text-xs font-medium text-sky-400 mb-1.5">
                Client Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required={category === 'client'}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp, John Doe, Stripe..."
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Status</label>
          <div className="grid grid-cols-4 gap-2">
            {(['active', 'inactive', 'on-hold', 'completed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                  status === st
                    ? 'bg-zinc-800 text-white border-zinc-600'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {st.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the project stack, goals, or scope..."
            className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none transition-colors"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. nextjs, fullstack, ai, freelance"
            className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        {/* Links Section */}
        <div className="pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <LinkIconLucide className="w-3.5 h-3.5 text-zinc-400" />
              <span>Links & Services</span>
            </label>
            <button
              type="button"
              onClick={() => addLink('github')}
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Link</span>
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[11px] text-zinc-500">Quick add:</span>
            {AVAILABLE_LINK_TYPES.slice(0, 6).map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => addLink(opt.type)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
              >
                <LinkIcon type={opt.type} size={12} />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {links.length === 0 ? (
              <p className="text-xs text-zinc-600 italic py-2 text-center">No links attached yet.</p>
            ) : (
              links.map((link, idx) => {
                const opt =
                  AVAILABLE_LINK_TYPES.find((o) => o.type === link.type) ||
                  AVAILABLE_LINK_TYPES[0];
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800"
                  >
                    <select
                      value={link.type}
                      onChange={(e) => updateLink(idx, 'type', e.target.value as LinkType)}
                      className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-200 focus:outline-none"
                    >
                      {AVAILABLE_LINK_TYPES.map((o) => (
                        <option key={o.type} value={o.type}>
                          {o.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={link.label || ''}
                      onChange={(e) => updateLink(idx, 'label', e.target.value)}
                      placeholder={getLinkLabel(link.type)}
                      className="w-24 px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-600 focus:outline-none"
                    />

                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(idx, 'url', e.target.value)}
                      placeholder={opt.placeholder}
                      className="flex-1 px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded text-zinc-200 placeholder-zinc-600 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="p-1 text-zinc-500 hover:text-red-400 rounded transition-colors"
                      title="Remove link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : initialProject ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ProjectModal({
  isOpen,
  onClose,
  onSave,
  initialProject,
}: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <ProjectFormInner
        key={initialProject?._id ? String(initialProject._id) : 'new-project'}
        initialProject={initialProject}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}

export default ProjectModal;
