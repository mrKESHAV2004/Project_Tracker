'use client';

import React from 'react';
import {
  FolderGit2,
  Plus,
  Database,
  Check,
  XCircle,
  User as UserIcon,
  LogOut,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  onNewProject: () => void;
  dbStatus: { connected: boolean; host?: string; error?: string } | null;
  totalProjects: number;
  activeProjects: number;
  user?: { username: string; name?: string; role?: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export function Navbar({
  onNewProject,
  dbStatus,
  totalProjects,
  activeProjects,
  user,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand & Counters */}
        <div className="flex items-center gap-2.5">
          <FolderGit2 className="w-5 h-5 text-zinc-300" />
          <h1 className="font-semibold text-zinc-100 text-sm sm:text-base tracking-tight">
            Project Tracker
          </h1>
          <span className="hidden sm:inline text-xs text-zinc-500">
            {totalProjects} projects &middot; {activeProjects} active
          </span>
        </div>

        {/* Right: DB status + Auth + New button */}
        <div className="flex items-center gap-2">
          {/* DB Indicator */}
          {dbStatus && (
            <span
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2 py-1 rounded border ${
                dbStatus.connected
                  ? 'text-emerald-400 border-zinc-800 bg-zinc-900'
                  : 'text-red-400 border-zinc-800 bg-zinc-900'
              }`}
              title={dbStatus.connected ? `Host: ${dbStatus.host}` : dbStatus.error}
            >
              <Database className="w-3 h-3" />
              {dbStatus.connected ? (
                <>
                  <span>Atlas DB</span>
                  <Check className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>Offline</span>
                  <XCircle className="w-3 h-3" />
                </>
              )}
            </span>
          )}

          {/* User / Auth State */}
          {user ? (
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-200 font-medium">
                <UserIcon className="w-3 h-3 text-zinc-400" />
                <span className="truncate max-w-[100px]">{user.name || user.username}</span>
              </span>
              <button
                onClick={onLogout}
                className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors font-medium"
            >
              <Lock className="w-3 h-3 text-zinc-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* New Project Button */}
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
