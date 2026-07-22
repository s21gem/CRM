import React from 'react';
import { Shield } from 'lucide-react';
import SharedPortalLayout from './SharedPortalLayout';
import SuperAdminModule from './SuperAdminModule';

export default function AdminPortal({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <SharedPortalLayout 
      isDarkMode={isDarkMode}
      roleName="SUPER_ADMIN"
      portalTitle="Sovereign Ecosystem"
      sidebarItems={
        <button className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-between transition-colors cursor-pointer bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Super Admin
          </div>
        </button>
      }
    >
      <SuperAdminModule isDarkMode={isDarkMode} currentUserRole="SUPER_ADMIN" />
    </SharedPortalLayout>
  );
}
