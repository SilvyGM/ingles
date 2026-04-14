'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionRole, hasSessionCookie, setSessionCookie } from '@/lib/auth';
import { showError, showSuccess, showWarning } from '@/lib/alerts';
import { DEFAULT_BASE_URL, saveSettings } from '@/lib/settings';

type LoginResponse = {
  accessToken: string;
  role: 'admin';
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@playlearn.app');
  const [password, setPassword] = useState('');
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasSessionCookie()) {
      const role = getSessionRole();
      router.replace(role === 'admin' ? '/dashboard' : '/learn');
    }
  }, [router]);

  function handleLearnerAccess() {
    const normalizedBaseUrl = baseUrl.trim() || DEFAULT_BASE_URL;
    saveSettings({
      baseUrl: normalizedBaseUrl,
      token: '',
      email: '',
    });
    setSessionCookie('learner');
    router.push('/learn');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      await showWarning('Campos incompletos', 'Completa email y password.');
      return;
    }

    const normalizedBaseUrl = baseUrl.trim() || DEFAULT_BASE_URL;

    setLoading(true);
    try {
      const response = await fetch(`${normalizedBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const rawMessage = await response.text();
        throw new Error(rawMessage || 'No se pudo iniciar sesion.');
      }

      const login = (await response.json()) as LoginResponse;

      saveSettings({
        email: email.trim(),
        baseUrl: normalizedBaseUrl,
        token: login.accessToken,
      });
      setSessionCookie('admin');

      await showSuccess('Sesion iniciada', 'Bienvenido al panel Play-Learn.');
      router.push('/dashboard');
    } catch (error) {
      await showError('Login fallido', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="sidebar-kicker">Play-Learn</p>
        <h1>Iniciar sesion admin</h1>
        <p className="hint">El login solo es requerido para el panel administrativo.</p>

        <form className="grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <label className="full">
            Base URL API
            <input
              onChange={(event) => setBaseUrl(event.target.value)}
              placeholder="http://localhost:3000/api"
              required
              value={baseUrl}
            />
          </label>

          <button className="btn full" disabled={loading} type="submit">
            Entrar como admin
          </button>
        </form>

        <div className="actions">
          <button className="btn ghost full" type="button" onClick={handleLearnerAccess}>
            Continuar como alumno (sin login)
          </button>
        </div>
      </section>
    </main>
  );
}
