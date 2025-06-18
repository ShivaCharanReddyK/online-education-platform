
'use server';

import type { User } from '@/types';

// Mock user storage (in-memory for server actions, or use localStorage on client if needed)
// For server actions, localStorage is not available. We'll use a simple in-memory store for demo.
// This will reset on server restart. A real app needs a persistent DB.
const MOCK_USERS_DB: User[] = [
    { id: 'student-1', email: 'student@example.com', role: 'student', password: 'password123', firstName: 'Student' },
    { id: 'counselor-1', email: 'counselor@example.com', role: 'counselor', password: 'password123', firstName: 'Counselor' },
];

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = MOCK_USERS_DB.find(u => u.email === email);
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

export async function createUser(email: string, role: 'student' | 'counselor', passwordInput: string): Promise<User | null> {
  if (MOCK_USERS_DB.some(u => u.email === email)) {
    throw new Error('User with this email already exists.');
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    role,
    password: passwordInput, // Storing plain text password for mock
  };
  MOCK_USERS_DB.push(newUser);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function verifyUserPassword(email: string, passwordInput: string): Promise<User | null> {
    const user = MOCK_USERS_DB.find(u => u.email === email);
    if (user && user.password === passwordInput) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = MOCK_USERS_DB.find(u => u.id === userId);
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}
