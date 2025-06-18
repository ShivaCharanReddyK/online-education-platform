
'use server';

import { getUsersCollection } from '@/lib/mongodb';
import type { User } from '@/types';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function findUserByEmail(email: string): Promise<User | null> {
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ email });
  if (user) {
    // Convert ObjectId to string for frontend usage and remove password
    return { ...user, id: user._id?.toString(), _id: undefined, password: undefined } as User;
  }
  return null;
}

export async function createUser(email: string, role: 'student' | 'counselor', passwordInput: string): Promise<User | null> {
  const usersCollection = await getUsersCollection();
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(passwordInput, 10);

  const newUser: Omit<User, 'id' | '_id'> = { // MongoDB will generate _id
    email,
    role,
    password: hashedPassword,
  };

  const result = await usersCollection.insertOne(newUser as User);
  if (result.insertedId) {
    return {
      id: result.insertedId.toString(),
      email,
      role,
      // Do not return password
    };
  }
  return null;
}

export async function verifyUserPassword(email: string, passwordInput: string): Promise<User | null> {
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email });

    if (user && user.password) {
        const isMatch = await bcrypt.compare(passwordInput, user.password);
        if (isMatch) {
            return { ...user, id: user._id?.toString(), _id: undefined, password: undefined } as User;
        }
    }
    return null;
}

export async function getUserById(userId: string): Promise<User | null> {
  if (!ObjectId.isValid(userId)) return null;
  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (user) {
    return { ...user, id: user._id?.toString(), _id: undefined, password: undefined } as User;
  }
  return null;
}
