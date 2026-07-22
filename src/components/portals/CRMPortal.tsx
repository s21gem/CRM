import React from 'react';
import { Users } from 'lucide-react';
import SharedPortalLayout from './SharedPortalLayout';
import CRMModule from './CRMModule';

export default function CRMPortal({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <SharedPortalLayout 
      isDarkMode={isDarkMode}
      roleName="SALES_EXEC"
      portalTitle="Sovereign Ecosystem"
      sidebarItems={
        <button className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-between transition-colors cursor-pointer bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" /> CRM Panel
          </div>
        </button>
      }
    >
      <CRMModule isDarkMode={isDarkMode} currentUserRole="SALES_EXEC" />
    </SharedPortalLayout>
  );
}
