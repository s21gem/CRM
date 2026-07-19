'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserPlus, Inbox, Settings, KanbanSquare, ListTodo, LogOut, Wrench, Package, Server, Briefcase, Shield, PieChart, Receipt, CreditCard } from 'lucide-react';
import { classNames } from '@fonebox/utils';

import { Role } from '@fonebox/types';
import { useAuth } from '../../contexts/AuthContext';

const navigationGroups = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'CRM Dashboard', href: '/crm', icon: PieChart, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES] },
    ]
  },
  {
    name: 'CRM & Sales',
    items: [
      { name: 'Sales Pipeline', href: '/crm/sales', icon: KanbanSquare, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES] },
      { name: 'Customers', href: '/crm/customers', icon: Users, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SALES, Role.SUPPORT] },
    ]
  },
  {
    name: 'Operations',
    items: [
      { name: 'Service Queue', href: '/crm/service', icon: ListTodo, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT] },
      { name: 'Projects', href: '/crm/repairs', icon: Briefcase, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.SUPPORT, Role.ENGINEER] },
      { name: 'Inventory', href: '/crm/inventory', icon: Package, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER, Role.ENGINEER] },
    ]
  },
  {
    name: 'Finance',
    items: [
      { name: 'Invoices', href: '/crm/invoices', icon: Receipt, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER] },
      { name: 'Payments', href: '/crm/payments', icon: CreditCard, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.CRM_MANAGER] },
    ]
  },
  {
    name: 'Administration',
    items: [
      { name: 'Internal', href: '/internal', icon: Server, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.ENGINEER, Role.SUPPORT] },
      { name: 'Admin', href: '/admin', icon: Shield, requiredRoles: [Role.SUPER_ADMIN, Role.ADMIN] },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { hasRole } = useAuth();

  return (
    <aside className="hidden w-64 flex-col border-r bg-sidebar lg:flex">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <nav className="mt-5 flex-1 space-y-4 px-2">
          {navigationGroups.map((group) => {
            const hasVisibleItems = group.items.some(item => !item.requiredRoles || hasRole(item.requiredRoles));
            if (!hasVisibleItems) return null;
            
            return (
              <div key={group.name} className="space-y-1">
                <h3 className="px-3 text-[11px] font-bold text-sidebar-foreground/50 uppercase tracking-wider mb-3 mt-4">
                  {group.name}
                </h3>
                {group.items.map((item) => {
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
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                        'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground',
                          'mr-3 h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
