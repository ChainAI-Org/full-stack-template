"use client";

import React, { forwardRef, useId, type ReactElement } from 'react';
import type { LucideProps } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming you have a cn utility, if not, we can add it or simplify.

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactElement<LucideProps>;
  rightIcon?: ReactElement<LucideProps>;
  errorMessage?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  { 
    className,
    type = 'text',
    label,
    leftIcon,
    rightIcon,
    errorMessage,
    id,
    containerClassName,
    labelClassName,
    inputWrapperClassName,
    ...props 
  },
  ref
) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={cn('block text-sm font-medium dark:text-brand-dark-text-secondary text-brand-light-text-secondary mb-1.5', labelClassName)}
        >
          {label}
        </label>
      )}
      <div 
        className={cn(
          'relative flex items-center w-full',
          'dark:bg-brand-dark-surface dark:border bg-brand-light-surface dark:border-brand-dark-border border-brand-light-border rounded-md shadow-subtle',
          'transition-all duration-subtle ease-apple',
          'focus-within:ring-2 focus-within:ring-brand-accent-blue focus-within:border-brand-accent-blue',
          errorMessage ? 'border-brand-accent-red focus-within:ring-brand-accent-red focus-within:border-brand-accent-red' : 'dark:hover:border-brand-dark-text-tertiary hover:border-brand-light-text-tertiary',
          props.disabled && 'opacity-60 cursor-not-allowed dark:bg-brand-dark-border bg-brand-light-border',
          inputWrapperClassName
        )}
      >
        {leftIcon && (
          <span className="absolute left-3 flex items-center justify-center dark:text-brand-dark-text-tertiary text-brand-light-text-tertiary pointer-events-none">
            {React.cloneElement(leftIcon, { size: 20 })}
          </span>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            'w-full h-10 px-3 py-2 bg-transparent',
            'dark:text-brand-dark-text-primary text-brand-light-text-primary dark:placeholder:text-brand-dark-text-tertiary placeholder:text-brand-light-text-tertiary text-sm',
            'rounded-md focus:outline-none',
            leftIcon ? 'pl-10' : 'pl-3',
            rightIcon ? 'pr-10' : 'pr-3',
            props.disabled && 'cursor-not-allowed',
            className
          )}
          disabled={props.disabled}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${inputId}-error` : undefined}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 flex items-center justify-center dark:text-brand-dark-text-tertiary text-brand-light-text-tertiary">
            {React.cloneElement(rightIcon, { size: 20 })}
          </span>
        )}
      </div>
      {errorMessage && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-brand-accent-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };