import { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './auth-options';

export function isAdmin(session: { user?: { role?: Role } }) {
  return session.user?.role === 'ADMIN';
}

export function isUser(session: { user?: { role?: Role } }) {
  return session.user?.role === 'USER';
}

export function isOwner(
  session: { user?: { id?: string } },
  resourceOwnerId: string
) {
  return session.user?.id === resourceOwnerId;
}

export function hasAccess(
  session: { user?: { id?: string; role?: Role } },
  resourceOwnerId: string
) {
  return isAdmin(session) || isOwner(session, resourceOwnerId);
}

// Extra helper to require admin access in server components/pages
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return session;
}
