import React from 'react';
import { Activity } from 'lucide-react';
import SharedPortalLayout from './SharedPortalLayout';
import OperationsModule from './OperationsModule';

export default function OpsPortal({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <SharedPortalLayout 
      isDarkMode={isDarkMode}
      roleName="OPERATIONS_OFFICER"
      portalTitle="Sovereign Ecosystem"
      sidebarItems={
        <button className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-between transition-colors cursor-pointer bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" /> Internal Panel
          </div>
        </button>
      }
    >
      <OperationsModule isDarkMode={isDarkMode} currentUserRole="OPERATIONS_OFFICER" />
    </SharedPortalLayout>
  );
}
