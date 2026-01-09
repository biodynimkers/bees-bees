'use server';
import prisma from '@/lib/client';

export default async function toggleUserRole(
  userId: string,
  currentRole: 'USER' | 'ADMIN' | 'SUPERADMIN'
) {
  try {
    // Prevent toggling SUPERADMIN role
    if (currentRole === 'SUPERADMIN') {
      return { success: false, error: 'Cannot toggle SUPERADMIN role' };
    }
    
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    return { success: true, newRole };
  } catch (error) {
    return { success: false, error: 'Could not toggle user role' };
  }
}
