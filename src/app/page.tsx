'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  FolderOpen,
  X,
  User,
  Building2,
  FolderGit2,
} from 'lucide-react';
import {
  IProject,
  ProjectStatus,
  TaskStatus,
} from '@/models/Project';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectTableView } from '@/components/ProjectTableView';
import { ProjectModal } from '@/components/ProjectModal';
import { ProjectDetailDrawer } from '@/components/ProjectDetailDrawer';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { AuthScreen } from '@/components/AuthScreen';
import { TokenPayload } from '@/lib/auth';

type CategoryFilter = 'all' | 'personal' | 'client';
type StatusFilter = 'all' | ProjectStatus;
type ViewMode = 'grid' | 'table';

export default function HomePage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    host?: string;
    error?: string;
  } | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<TokenPayload | null>(null);

  // Modal / Drawer state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<IProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<IProject | null>(null);
  const [drawerProjectId, setDrawerProjectId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Drawer project derived from projects state so it automatically updates
  const drawerProject = useMemo(() => {
    if (!drawerProjectId) return null;
    return projects.find((p) => String(p._id) === drawerProjectId) || null;
  }, [drawerProjectId, projects]);

  // Refresh data after mutations
  const refreshProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects');
      if (res.status === 401) {
        setCurrentUser(null);
        setProjects([]);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        const projectList = Array.isArray(data) ? data : data.projects || [];
        setProjects(projectList);
      }
    } catch (err) {
      console.error('Failed to refresh projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const authRes = await fetch('/api/auth/me').then((r) => r.json());

        if (!active) return;

        if (authRes.authenticated && authRes.user) {
          setCurrentUser(authRes.user);

          // Fetch projects and health in parallel only if authenticated
          const [healthRes, projectsRes] = await Promise.allSettled([
            fetch('/api/health').then((r) => r.json()),
            fetch('/api/projects').then((r) => r.json()),
          ]);

          if (!active) return;

          if (healthRes.status === 'fulfilled') {
            setDbStatus(healthRes.value);
          } else {
            setDbStatus({ connected: false, error: 'Health check failed' });
          }

          if (projectsRes.status === 'fulfilled') {
            const val = projectsRes.value;
            const projectList = Array.isArray(val) ? val : val.projects || [];
            setProjects(projectList);
          }
        } else {
          setCurrentUser(null);
          setProjects([]);
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        if (active) {
          setAuthChecking(false);
        }
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  // Create or Update Project
  const handleSaveProject = async (data: Partial<IProject>) => {
    if (editingProject && editingProject._id) {
      const res = await fetch(`/api/projects/${editingProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        setCurrentUser(null);
        return;
      }
      if (res.ok) {
        await refreshProjects();
        setIsModalOpen(false);
        setEditingProject(null);
      }
    } else {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.status === 401) {
        setCurrentUser(null);
        return;
      }
      if (res.ok) {
        await refreshProjects();
        setIsModalOpen(false);
      }
    }
  };

  // Delete Project
  const handleDeleteProject = async () => {
    if (!deletingProject || !deletingProject._id) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/projects/${deletingProject._id}`, {
        method: 'DELETE',
      });
      if (res.status === 401) {
        setCurrentUser(null);
        return;
      }
      if (res.ok) {
        await refreshProjects();
        setDeletingProject(null);
        if (drawerProjectId === String(deletingProject._id)) {
          setDrawerProjectId(null);
        }
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // Status Change (from Drawer)
  const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) =>
        String(p._id) === projectId ? { ...p, status: newStatus } : p
      )
    );

    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.status === 401) {
      setCurrentUser(null);
    }
  };

  // Tasks: Add Task
  const handleAddTask = async (
    projectId: string,
    title: string,
    status: TaskStatus
  ) => {
    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status }),
    });
    if (res.status === 401) {
      setCurrentUser(null);
      return;
    }
    if (res.ok) {
      const data = await res.json();
      if (data.tasks) {
        setProjects((prev) =>
          prev.map((p) =>
            String(p._id) === projectId ? { ...p, tasks: data.tasks } : p
          )
        );
      } else {
        await refreshProjects();
      }
    }
  };

  // Tasks: Update Task Status
  const handleUpdateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (String(p._id) !== projectId) return p;
        const updatedTasks = (p.tasks || []).map((t) =>
          String(t._id) === taskId ? { ...t, status } : t
        );
        return { ...p, tasks: updatedTasks };
      })
    );

    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status }),
    });
    if (res.status === 401) {
      setCurrentUser(null);
      return;
    }
    if (res.ok) {
      const data = await res.json();
      if (data.tasks) {
        setProjects((prev) =>
          prev.map((p) =>
            String(p._id) === projectId ? { ...p, tasks: data.tasks } : p
          )
        );
      }
    }
  };

  // Tasks: Delete Task
  const handleDeleteTask = async (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (String(p._id) !== projectId) return p;
        return {
          ...p,
          tasks: (p.tasks || []).filter((t) => String(t._id) !== taskId),
        };
      })
    );

    const res = await fetch(`/api/projects/${projectId}/tasks?taskId=${taskId}`, {
      method: 'DELETE',
    });
    if (res.status === 401) {
      setCurrentUser(null);
    }
  };

  // Notes: Add Note
  const handleAddNote = async (projectId: string, content: string) => {
    const res = await fetch(`/api/projects/${projectId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (res.status === 401) {
      setCurrentUser(null);
      return;
    }
    if (res.ok) {
      const data = await res.json();
      if (data.notes) {
        setProjects((prev) =>
          prev.map((p) =>
            String(p._id) === projectId ? { ...p, notes: data.notes } : p
          )
        );
      } else {
        await refreshProjects();
      }
    }
  };

  // Notes: Delete Note
  const handleDeleteNote = async (projectId: string, noteId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (String(p._id) !== projectId) return p;
        return {
          ...p,
          notes: (p.notes || []).filter((n) => String(n._id) !== noteId),
        };
      })
    );

    const res = await fetch(`/api/projects/${projectId}/notes?noteId=${noteId}`, {
      method: 'DELETE',
    });
    if (res.status === 401) {
      setCurrentUser(null);
    }
  };

  // Toggle Pin
  const handleTogglePin = async (
    projectOrId: IProject | string,
    forcedValue?: boolean
  ) => {
    const projectId =
      typeof projectOrId === 'string' ? projectOrId : String(projectOrId._id);
    const target = projects.find((p) => String(p._id) === projectId);
    const nextPinned = forcedValue !== undefined ? forcedValue : !target?.pinned;

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) =>
        String(p._id) === projectId ? { ...p, pinned: nextPinned } : p
      )
    );

    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinned: nextPinned }),
    });
    if (res.status === 401) {
      setCurrentUser(null);
    }
  };

  // Filtered and Sorted projects: Pinned first, then Active, then Most Recent
  const filteredProjects = useMemo(() => {
    const list = projects.filter((p) => {
      // Category filter
      if (categoryFilter === 'personal' && p.category === 'client') return false;
      if (categoryFilter === 'client' && p.category !== 'client') return false;

      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = (p.description || '').toLowerCase().includes(query);
        const matchClient = (p.clientName || '').toLowerCase().includes(query);
        const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(query));
        const matchTasks = (p.tasks || []).some((t) => t.title.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchClient && !matchTags && !matchTasks) {
          return false;
        }
      }

      return true;
    });

    // Sort order:
    // 1) Pinned projects first
    // 2) Active projects next
    // 3) Most recently updated
    return list.sort((a, b) => {
      const pinA = a.pinned ? 1 : 0;
      const pinB = b.pinned ? 1 : 0;
      if (pinB !== pinA) return pinB - pinA;

      const activeA = a.status === 'active' ? 1 : 0;
      const activeB = b.status === 'active' ? 1 : 0;
      if (activeB !== activeA) return activeB - activeA;

      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [projects, categoryFilter, statusFilter, searchQuery]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: projects.length,
      personal: projects.filter((p) => p.category !== 'client').length,
      client: projects.filter((p) => p.category === 'client').length,
      active: projects.filter((p) => p.status === 'active').length,
      inactive: projects.filter((p) => p.status === 'inactive').length,
      'on-hold': projects.filter((p) => p.status === 'on-hold').length,
      completed: projects.filter((p) => p.status === 'completed').length,
    };
  }, [projects]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setProjects([]);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // 1. Initial loading screen while checking session
  if (authChecking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-mono text-xs">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 animate-pulse">
          <FolderGit2 className="w-5 h-5 text-zinc-300" />
        </div>
        <span>Verifying access...</span>
      </div>
    );
  }

  // 2. Unauthenticated screen: strictly protected, only sign-in form
  if (!currentUser) {
    return (
      <AuthScreen
        onSuccess={(user) => {
          setCurrentUser(user);
          refreshProjects();
        }}
      />
    );
  }

  // 3. Authenticated dashboard
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onNewProject={() => {
          setEditingProject(null);
          setIsModalOpen(true);
        }}
        dbStatus={dbStatus}
        totalProjects={projects.length}
        activeProjects={counts.active}
        user={currentUser}
        onOpenAuth={() => {}}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col">
        {/* Controls & Filter Toolbar */}
        <div className="flex flex-col gap-3 mb-6">
          {/* Row 1: Search + Category Switcher + View Mode */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, clients, tags, tasks..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter: All / Personal / Clients */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800 text-xs font-medium">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    categoryFilter === 'all'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All ({counts.all})
                </button>
                <button
                  onClick={() => setCategoryFilter('personal')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                    categoryFilter === 'personal'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Personal ({counts.personal})</span>
                </button>
                <button
                  onClick={() => setCategoryFilter('client')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                    categoryFilter === 'client'
                      ? 'bg-sky-950/40 text-sky-300 border border-sky-800/60 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>Clients ({counts.client})</span>
                </button>
              </div>

              {/* View Mode: Grid / Table */}
              <div className="inline-flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800 text-xs font-medium">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'table'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(['all', 'active', 'in-progress', 'on-hold', 'completed', 'inactive'] as const)
              .filter((st) => st !== 'in-progress')
              .map((st) => {
                const count = st === 'all' ? counts.all : counts[st as keyof typeof counts] || 0;
                const isSelected = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st as StatusFilter)}
                    className={`px-2.5 py-1 rounded-md border text-[11px] font-medium transition-colors capitalize whitespace-nowrap ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-700 text-white'
                        : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {st === 'all' ? 'All Statuses' : st.replace('-', ' ')}
                    <span className="ml-1.5 text-zinc-500 font-mono text-[10px]">
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Projects Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20 text-xs text-zinc-500 font-mono">
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-center p-6">
            <div className="p-3 rounded-full bg-zinc-900 text-zinc-500 mb-3">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-300">No projects found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters.'
                : 'Get started by creating your first project.'}
            </p>
            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
                className="mt-3 text-xs text-zinc-400 hover:text-white underline"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsModalOpen(true);
                }}
                className="mt-4 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg text-xs font-medium transition-colors"
              >
                Create Project
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={String(project._id)}
                project={project}
                onEdit={(p) => {
                  setEditingProject(p);
                  setIsModalOpen(true);
                }}
                onDelete={(p) => setDeletingProject(p)}
                onClick={(p) => setDrawerProjectId(String(p._id))}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        ) : (
          <ProjectTableView
            projects={filteredProjects}
            onEdit={(p) => {
              setEditingProject(p);
              setIsModalOpen(true);
            }}
            onDelete={(p) => setDeletingProject(p)}
            onClick={(p) => setDrawerProjectId(String(p._id))}
            onTogglePin={handleTogglePin}
          />
        )}
      </main>

      {/* Project Modal: Create & Edit */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        initialProject={editingProject}
      />

      {/* Project Details & Tasks Drawer */}
      <ProjectDetailDrawer
        project={drawerProject}
        isOpen={!!drawerProjectId}
        onClose={() => setDrawerProjectId(null)}
        onEdit={(p) => {
          setEditingProject(p);
          setIsModalOpen(true);
        }}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onAddTask={handleAddTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        onDeleteTask={handleDeleteTask}
        onTogglePin={(id, pinned) => handleTogglePin(id, pinned)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProject}
        project={deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteProject}
        loading={deleteLoading}
      />
    </div>
  );
}
