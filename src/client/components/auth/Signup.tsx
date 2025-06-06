"use client";

import * as React from 'react';
const { useState, FormEvent } = React;
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { AlertCircle, User, Mail, Lock } from 'lucide-react';

// Logo component (identical to Login.tsx)
const Logo = () => (
  <Link to="/" className="flex items-center space-x-2 group mb-8 justify-center">
    <svg 
      width="36" 
      height="36" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="text-brand-accent-blue group-hover:text-brand-accent-blue/80 dark:text-brand-accent-blue dark:group-hover:text-brand-accent-blue/80 transition-colors duration-subtle"
    >
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="text-3xl font-semibold text-brand-light-text-primary dark:text-brand-dark-text-primary group-hover:text-brand-accent-blue dark:group-hover:text-brand-accent-blue transition-colors duration-subtle">
      TaskForge
    </span>
  </Link>
);

export function Signup() {
  const { signup, error, loading, clearError } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setFormError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    clearError();
    setFormError('');
    try {
      await signup(username, email, password);
      window.location.assign('/'); 
    } catch (err) {
      // Error is handled by the auth context's 'error' state
      console.error('Signup submission error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-brand-dark-bg bg-brand-light-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="dark:bg-brand-dark-surface bg-brand-light-surface p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md space-y-8">
        <Logo />
        
        <h2 className="text-2xl sm:text-3xl font-bold text-center dark:text-brand-dark-text-primary text-brand-light-text-primary">
          Create your account
        </h2>
        
        {(error || formError) && (
          <div className="p-3 bg-brand-accent-red/10 border border-brand-accent-red/30 text-brand-accent-red rounded-md text-sm">
            <div className="flex items-center">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <p>{error || formError}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="username"
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourusername"
            leftIcon={<User size={18} />}
            required
            disabled={loading}
          />
          <Input
            id="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            leftIcon={<Mail size={18} />}
            required
            disabled={loading}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            required
            disabled={loading}
            helpText="Must be at least 8 characters."
          />
          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock size={18} />}
            required
            disabled={loading}
          />
          
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <Button 
            href="/login" 
            variant="link" 
            className="text-sm"
          >
            Already have an account? Log in
          </Button>
        </div>
      </div>
    </div>
  );
}
