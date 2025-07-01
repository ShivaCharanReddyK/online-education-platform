
'use server';

import bcrypt from 'bcryptjs'
import { createUser as dbCreateUser, getUserByEmail, getUserById as dbGetUserById } from '@/lib/database'
import type { User } from '@/types';
import { sendWelcomeEmail } from '@/actions/emailActions'

// Convert Database User to App User format
function dbUserToAppUser(dbUser: any): User {
  return {
    id: dbUser._id.toString(),
    email: dbUser.email,
    role: dbUser.role,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName
  }
}

export async function createUser(
  email: string,
  role: 'student' | 'counselor',
  password: string,
  firstName?: string,
  lastName?: string
): Promise<User | null> {
  try {
    const result = await dbCreateUser({
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      role
    })

    if (!result.success) {
      throw new Error(result.error || 'Failed to create user')
    }

    // Get the created user
    const dbUser = await getUserByEmail(email)
    if (!dbUser) {
      throw new Error('User created but could not retrieve')
    }
    
    // Send welcome email
    try {
      await sendWelcomeEmail(email, firstName || '', lastName || '', role)
      console.log(`Welcome email sent to ${email}`)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Continue even if email fails - we don't want to prevent registration
    }

    return dbUserToAppUser(dbUser)
  } catch (error) {
    console.error('Create user action error:', error)
    throw error
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const dbUser = await getUserByEmail(email)
    return dbUser ? dbUserToAppUser(dbUser) : null
  } catch (error) {
    console.error('Find user by email error:', error)
    return null
  }
}

export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
  try {
    const dbUser = await getUserByEmail(email)
    if (!dbUser) return null

    const passwordsMatch = await bcrypt.compare(password, dbUser.password)
    if (!passwordsMatch) return null

    return dbUserToAppUser(dbUser)
  } catch (error) {
    console.error('Verify password error:', error)
    return null
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const dbUser = await dbGetUserById(userId)
    return dbUser ? dbUserToAppUser(dbUser) : null
  } catch (error) {
    console.error('Get user by ID action error:', error)
    return null
  }
}

// Helper to log the current state (for debugging, can be removed)
export async function logMockUsers() {
  console.log("Using MongoDB database instead of mock users");
}
