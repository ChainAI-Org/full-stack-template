import db from '../database.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 12;
// JWT secret - in a real app, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

/**
 * Interface for a User record in the database
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

/**
 * User data without sensitive information, safe for returning to clients
 */
export interface SafeUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/**
 * Data required for user registration
 */
export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}

/**
 * Data required for user login
 */
export interface UserLogin {
  email: string;
  password: string;
}

/**
 * Converts a User to a SafeUser by removing sensitive data
 */
export function toSafeUser(user: User): SafeUser {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

/**
 * Registers a new user in the database
 * @param userData User registration data
 * @returns A promise that resolves to the created user (without password)
 * @throws Error if registration fails
 */
export async function registerUser(userData: UserRegistration): Promise<SafeUser> {
  const { username, email, password } = userData;
  
  // Check if user already exists
  const existingUser = await db<User>('users')
    .where({ email })
    .orWhere({ username })
    .first();
  
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email already in use');
    }
    throw new Error('Username already taken');
  }
  
  // Hash the password
  const password_hash = await hash(password, SALT_ROUNDS);
  
  // Insert the new user
  const [newUser] = await db<User>('users')
    .insert({
      username,
      email,
      password_hash
    })
    .returning('*');
  
  return toSafeUser(newUser);
}

/**
 * Authenticates a user by checking email and password
 * @param credentials User login credentials
 * @returns A promise that resolves to the authenticated user (without password) and JWT token
 * @throws Error if authentication fails
 */
export async function loginUser(credentials: UserLogin): Promise<{ user: SafeUser; token: string }> {
  const { email, password } = credentials;
  
  // Find user by email
  const user = await db<User>('users').where({ email }).first();
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Compare password with hash
  const isPasswordValid = await compare(password, user.password_hash);
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  return { user: toSafeUser(user), token };
}

/**
 * Fetches a user by ID
 * @param id User ID
 * @returns A promise that resolves to the user (without password) or undefined if not found
 */
export async function getUserById(id: number): Promise<SafeUser | undefined> {
  const user = await db<User>('users').where({ id }).first();
  
  if (!user) {
    return undefined;
  }
  
  return toSafeUser(user);
}

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}
