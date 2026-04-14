import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ROLE_COOKIE, SESSION_COOKIE } from '@/lib/auth';

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  const role = cookieStore.get(ROLE_COOKIE)?.value;

  if (session === '1') {
    if (role === 'admin') {
      redirect('/dashboard');
    }

    redirect('/learn');
  }

  redirect('/login');
}
