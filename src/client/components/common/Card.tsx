"use client";

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

// --- Card Root --- 
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-brand-light-border bg-brand-light-surface text-brand-light-text-primary shadow-subtle',
      'dark:border-brand-dark-border dark:bg-brand-dark-surface dark:text-brand-dark-text-primary',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

// --- Card Header --- 
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)} // Default padding, can be overridden
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// --- Card Title --- 
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-brand-light-text-primary dark:text-brand-dark-text-primary', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// --- Card Description --- 
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-brand-light-text-secondary dark:text-brand-dark-text-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// --- Card Content --- 
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn('p-6 pt-0', className)} // Default padding, pt-0 if header is used
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

// --- Card Footer --- 
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)} // Default padding, pt-0 if content above has padding
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
