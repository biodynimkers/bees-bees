import { Role } from '@prisma/client';

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
