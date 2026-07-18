'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 shadow-soft">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-muted-foreground hover:text-foreground">
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="hidden font-sans text-xl font-bold text-secondary dark:text-white sm:inline-block">
            FoneBox CRM
          </span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
        <div className="relative hidden w-full max-w-sm sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search enterprise resources..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <button className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
            3
          </span>
        </button>

        {user && (
          <div className="flex items-center space-x-4 border-l pl-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full inline-block mt-0.5">{user.role}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
