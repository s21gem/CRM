'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserPlus, Inbox, Settings, KanbanSquare, ListTodo, LogOut, Wrench, Package, Server, Briefcase, Shield, PieChart, Receipt } from 'lucide-react';
import { classNames } from '@fonebox/utils';

import { Role } from '@fonebox/types';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CRM Dashboard', href: '/crm', icon: PieChart, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES] },
  { name: 'Sales Pipeline', href: '/crm/sales', icon: KanbanSquare, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES] },
  { name: 'Service Queue', href: '/crm/service', icon: ListTodo, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT] },
  { name: 'Customers', href: '/crm/customers', icon: Users, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES, Role.SUPPORT] },
  { name: 'Repairs', href: '/crm/repairs', icon: Wrench, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT, Role.ENGINEER] },
  { name: 'Inventory', href: '/crm/inventory', icon: Package, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.ENGINEER] },
  { name: 'Invoices', href: '/crm/invoices', icon: Receipt, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER] },
  { name: 'Projects', href: '/projects', icon: Briefcase, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.ENGINEER] },
  { name: 'Internal', href: '/internal', icon: Server, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.ENGINEER, Role.SUPPORT] },
  { name: 'Admin', href: '/admin', icon: Shield, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN] },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { hasRole } = useAuth();

  return (
    <aside className="hidden w-64 flex-col border-r bg-sidebar lg:flex">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            // Check roles dynamically
            if (item.requiredRoles && !hasRole(item.requiredRoles)) {
              return null;
            }

            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors'
                )}
              >
                <item.icon
                  className={classNames(
                    isActive ? 'text-sidebar-accent-foreground' : 'text-muted-foreground group-hover:text-accent-foreground',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
