import db from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// bcryptjs configuration for password hashing
// Cost factor directly affects security and performance
// Higher values are more secure but slower (10-12 recommended for production)
const BCRYPT_ROUNDS = process.env.NODE_ENV === 'production' ? 12 : 10;

/**
 * Hash a password using bcryptjs
 * 
 * @param password Plain text password to hash
 * @returns Hashed password
 */
async function hashPassword(password: string): Promise<string> {
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a stored hash
 * 
 * @param password Plain text password to verify
 * @param hashedPassword Hashed password to compare against
 * @returns True if password matches, false otherwise
 */
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Compare the input password with the stored hash
  // bcrypt.compare uses a constant-time comparison to prevent timing attacks
  return bcrypt.compare(password, hashedPassword);
}

// JWT configuration - ensure it's always set or throw an error
const JWT_SECRET = process.env.JWT_SECRET as string;
// This check ensures the JWT_SECRET is set at runtime and communicates to TypeScript that it's non-null
if (!JWT_SECRET) {
  // No fallbacks - always throw an error if JWT_SECRET is missing
  throw new Error('JWT_SECRET environment variable must be set. Please add it to your .env file.');
}
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
  
  // Hash the password with our secure crypto implementation
  const password_hash = await hashPassword(password);
  
  // Insert the new user into the database using a universal approach
  // This works with both SQLite and PostgreSQL
  await db<User>('users').insert({
    username,
    email,
    password_hash
  });
  
  // Fetch the newly inserted user
  const newUser = await db<User>('users').where({ email }).first();
  
  // Ensure we have a valid user before converting to SafeUser
  if (!newUser) {
    throw new Error('Failed to create user');
  }
  
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
  
  // Verify password using our secure crypto implementation
  const isPasswordValid = await verifyPassword(password, user.password_hash);
  
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
 * Interface for JWT token payload
 */
interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    // Properly type the decoded token and ensure JWT_SECRET is treated as a non-null string
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Validate that the expected fields exist
    if (typeof decoded !== 'object' || !decoded.userId || !decoded.email) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}
