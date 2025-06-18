
"use client";

import type { User } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { findUserByEmail, createUser, verifyUserPassword } from '@/actions/userActions'; // We'll create these

interface AuthContextType {
  user: User | null;
  login: (email: string, passwordInput: string, roleHint?: 'student' | 'counselor') => Promise<{ success: boolean; message?: string; user?: User | null }>;
  signup: (email: string, passwordInput: string, role: 'student' | 'counselor') => Promise<{ success: boolean; message?: string; user?: User | null }>;
  logout: () => void;
  loading: boolean;
  fetchCurrentUser: () => Promise<void>; // Added to re-fetch user, e.g. on page load
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'learnflow-user-session-id'; // Store user ID instead of full object

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserFromSession = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem(USER_SESSION_KEY);
      if (userId) {
        // In a real app, you'd validate this session server-side
        // For this prototype, we'll fetch user details by ID
        const usersCollection = await import('@/lib/mongodb').then(mod => mod.getUsersCollection());
        const mongoUser = await usersCollection.findOne({ _id: new (await import('mongodb')).ObjectId(userId) });
        if (mongoUser) {
          setUser({ ...mongoUser, id: mongoUser._id.toString(), _id: undefined, password: undefined } as User);
        } else {
          localStorage.removeItem(USER_SESSION_KEY); // Clear invalid session
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user from session", error);
      localStorage.removeItem(USER_SESSION_KEY);
      setUser(null);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchUserFromSession();
  }, []);

  const login = async (email: string, passwordInput: string, roleHint?: 'student' | 'counselor') => {
    setLoading(true);
    try {
      const loggedInUser = await verifyUserPassword(email, passwordInput);
      if (loggedInUser) {
        // Optionally check roleHint if provided, though DB role is authoritative
        if (roleHint && loggedInUser.role !== roleHint) {
           setLoading(false);
           return { success: false, message: `You are trying to log in as a ${roleHint}, but this account is registered as a ${loggedInUser.role}.` };
        }
        setUser(loggedInUser);
        if(loggedInUser.id) localStorage.setItem(USER_SESSION_KEY, loggedInUser.id);
        setLoading(false);
        return { success: true, user: loggedInUser };
      } else {
        setLoading(false);
        return { success: false, message: 'Invalid email or password.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, message: (error as Error).message || 'An unexpected error occurred during login.' };
    }
  };

  const signup = async (email: string, passwordInput: string, role: 'student' | 'counselor') => {
    setLoading(true);
    try {
      const newUser = await createUser(email, role, passwordInput);
      if (newUser) {
        setUser(newUser);
        if(newUser.id) localStorage.setItem(USER_SESSION_KEY, newUser.id);
        setLoading(false);
        return { success: true, user: newUser };
      } else {
        setLoading(false);
        return { success: false, message: 'Failed to create user.' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      return { success: false, message: (error as Error).message || 'An unexpected error occurred during signup.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_SESSION_KEY);
    // Optionally: await callToServerToInvalidateSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, fetchCurrentUser: fetchUserFromSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
