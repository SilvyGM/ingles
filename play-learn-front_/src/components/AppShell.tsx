'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { confirmDanger } from '@/lib/alerts';
import { clearSessionCookie } from '@/lib/auth';
import { RESOURCE_CONFIGS } from '@/lib/resources';
import { clearSettings } from '@/lib/settings';

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const confirmed = await confirmDanger(
      'Cerrar sesion',
      'Se cerrara la sesion actual del panel administrativo.',
    );

    if (!confirmed) {
      return;
    }

    clearSessionCookie();
    clearSettings();
    router.push('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="sidebar-kicker">Play-Learn</p>
          <h2>Admin Panel</h2>
          <p className="sidebar-text">Gestion del MVP en una sola vista operativa.</p>
        </div>

        <nav className="menu">
          <Link className={pathname === '/dashboard' ? 'menu-item active' : 'menu-item'} href="/dashboard">
            Dashboard
          </Link>
          <Link
            className={pathname === '/session-completion' ? 'menu-item active' : 'menu-item'}
            href="/session-completion"
          >
            Session Flow
          </Link>
          {RESOURCE_CONFIGS.map((resource) => {
            const href = `/crud/${resource.key}`;
            const isActive = pathname === href;
            return (
              <Link className={isActive ? 'menu-item active' : 'menu-item'} href={href} key={resource.key}>
                {resource.label}
              </Link>
            );
          })}
        </nav>

        <button className="btn danger" onClick={() => void logout()} type="button">
          Cerrar sesion
        </button>
      </aside>

      <section className="content-area">
        <header className="topbar">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          
        </header>
        {children}
      </section>
    </div>
  );
}
