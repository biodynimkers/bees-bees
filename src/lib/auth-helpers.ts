type Role = 'ADMIN' | 'USER';

export function isAdmin(session: { role?: Role }) {
  return session.role === 'ADMIN';
}
export function isUser(session: { role?: Role }) {
  return session.role === 'USER';
}
export function isOwner(session: { userId?: string }, resourceOwnerId: string) {
  return session.userId === resourceOwnerId;
}
