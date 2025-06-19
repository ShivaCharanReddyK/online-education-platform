
'use server';

import type { User } from '@/types';

// Mock user storage using globalThis for better persistence in dev mode
declare global {
  // eslint-disable-next-line no-var
  var __MOCK_USERS_DB__: User[] | undefined;
}

if (!globalThis.__MOCK_USERS_DB__) {
  console.log("Initializing MOCK_USERS_DB on globalThis");
  globalThis.__MOCK_USERS_DB__ = [
    { id: 'student-1', email: 'student@example.com', role: 'student', password: 'password123', firstName: 'Student' },
    { id: 'counselor-1', email: 'counselor@example.com', role: 'counselor', password: 'password123', firstName: 'Counselor' },
  ];
}
const MOCK_USERS_DB = globalThis.__MOCK_USERS_DB__;


export async function findUserByEmail(email: string): Promise<User | null> {
  const user = MOCK_USERS_DB.find(u => u.email === email);
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return JSON.parse(JSON.stringify(userWithoutPassword)); // Deep copy
  }
  return null;
}

export async function createUser(email: string, role: 'student' | 'counselor', passwordInput: string): Promise<User | null> {
  if (MOCK_USERS_DB.some(u => u.email === email)) {
    throw new Error('User with this email already exists.');
  }
  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    email,
    role,
    password: passwordInput, // Storing plain text password for mock
    // For newly created users, firstName might not be immediately available unless passed to createUser
    // It's typically collected later or during application.
  };
  MOCK_USERS_DB.push(JSON.parse(JSON.stringify(newUser))); // Store a copy
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = newUser;
  return JSON.parse(JSON.stringify(userWithoutPassword)); // Deep copy
}

export async function verifyUserPassword(email: string, passwordInput: string): Promise<User | null> {
    const user = MOCK_USERS_DB.find(u => u.email === email);
    if (user && user.password === passwordInput) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return JSON.parse(JSON.stringify(userWithoutPassword)); // Deep copy
    }
    return null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = MOCK_USERS_DB.find(u => u.id === userId);
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return JSON.parse(JSON.stringify(userWithoutPassword)); // Deep copy
  }
  return null;
}

// Helper to log the current state of MOCK_USERS_DB (for debugging, can be removed)
export async function logMockUsers() {
  console.log("Current MOCK_USERS_DB:", MOCK_USERS_DB);
}
