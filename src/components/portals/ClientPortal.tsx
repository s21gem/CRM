import React from 'react';
import { Laptop } from 'lucide-react';
import SharedPortalLayout from './SharedPortalLayout';
import ClientPortalModule from './ClientPortalModule';

export default function ClientPortal({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <SharedPortalLayout 
      isDarkMode={isDarkMode}
      roleName="CORPORATE_CLIENT"
      portalTitle="Sovereign Ecosystem"
      sidebarItems={
        <button className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-between transition-colors cursor-pointer bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4" /> Customer Panel
          </div>
        </button>
      }
    >
      <ClientPortalModule isDarkMode={isDarkMode} currentUserRole="CORPORATE_CLIENT" />
    </SharedPortalLayout>
  );
}
