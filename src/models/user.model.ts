import db from '../database.js';
import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

// Crypto configuration for password hashing with scrypt
// These parameters directly affect security and performance
const SCRYPT_KEYLEN = 64; // Length of the derived key
const SCRYPT_SALT_SIZE = 16; // 16 bytes 
// = 128 bits for the salt
const SCRYPT_OPTIONS = {
  N: process.env.NODE_ENV === 'production' ? 32768 : 16384, // CPU/memory cost factor (higher is more secure but slower)
  r: 8, // Block size factor
  p: 1, // Parallelization factor
  maxmem: 128 * 1024 * 1024 // 128MB memory limit
};

// Promisify crypto.randomBytes but handle scrypt differently
const randomBytes = promisify(crypto.randomBytes);

// Use a callback-based wrapper for scrypt to prevent memory issues
async function scryptAsync(password: Buffer, salt: Buffer, keylen: number, options: crypto.ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey);
    });
  });
}

/**
 * Hash a password using the scrypt key derivation function
 * Format: salt.hash where both are stored as hex strings
 */
async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const salt = await randomBytes(SCRYPT_SALT_SIZE);
  
  // Hash the password with the salt using scrypt - convert password to Buffer
  const passwordBuffer = Buffer.from(password, 'utf-8');
  const derivedKey = await scryptAsync(passwordBuffer, salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS);
  
  // Return the salt and hashed password as hex strings
  return `${salt.toString('hex')}.${derivedKey.toString('hex')}`;
}

/**
 * Verify a password against a hash
 */
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // Split the stored hash into salt and hash components
  const [saltHex, hashHex] = hashedPassword.split('.');
  if (!saltHex || !hashHex) {
    throw new Error('Invalid password hash format');
  }
  
  const salt = Buffer.from(saltHex, 'hex');
  const hash = Buffer.from(hashHex, 'hex');
  
  // Hash the input password with the stored salt - convert password to Buffer
  const passwordBuffer = Buffer.from(password, 'utf-8');
  const derivedKey = await scryptAsync(passwordBuffer, salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS);
  
  // Compare the derived key with the stored hash using a constant-time comparison
  return crypto.timingSafeEqual(derivedKey, hash);
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
