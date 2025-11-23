type Role = 'USER' | 'ADMIN';

declare module 'next-auth' {
  interface User {
    id: string;
    role: Role;
  }

  interface Session {
    userId: string;
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
  }
}
