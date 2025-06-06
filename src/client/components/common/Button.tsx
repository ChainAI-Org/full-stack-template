"use client";

import React, { forwardRef, type MouseEvent, type ReactElement } from 'react';
import type { LucideProps } from 'lucide-react'; // Assuming lucide-react is used for icons

// Helper for loading spinner or other icons
const IconSpinner = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={`animate-spin ${props.className || ''}`}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: ReactElement<LucideProps>;
  rightIcon?: ReactElement<LucideProps>;
  href?: string; // For link variant
  asChild?: boolean; // For composing with other components like Radix Slot
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      href,
      asChild = false, // Not fully implemented here, but good for future Radix UI integration
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const commonStyles =
      'inline-flex items-center justify-center font-medium tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-brand-dark-bg focus-visible:ring-brand-accent-blue transition-all duration-fast ease-subtle select-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-sm leading-5',
      md: 'px-4 py-2 text-sm rounded leading-5',
      lg: 'px-6 py-3 text-base rounded-md leading-6',
      icon: 'p-2 rounded leading-5', // Added leading-5 for consistency if text were present
    };

    const variantStyles = {
      primary:
        'bg-brand-accent-blue text-brand-accent-blue-textOnBlue hover:bg-brand-accent-blue/90 dark:bg-brand-accent-blue-darkBg dark:text-brand-light-surface dark:hover:bg-brand-accent-blue-darkBg/90 shadow-subtle hover:shadow-subtle-md disabled:shadow-none',
      secondary:
        'bg-brand-dark-surface text-brand-dark-text-primary hover:bg-brand-dark-border dark:bg-brand-light-surface dark:text-brand-light-text-primary dark:hover:bg-brand-light-border shadow-subtle hover:shadow-subtle-md disabled:shadow-none',
      outline:
        'border border-brand-accent-blue text-brand-accent-blue hover:bg-brand-accent-blue hover:text-brand-light-surface dark:border-brand-accent-blue dark:text-brand-accent-blue dark:hover:bg-brand-accent-blue-darkBg dark:hover:text-white disabled:border-brand-dark-border disabled:text-brand-dark-text-tertiary',
      ghost:
        'text-brand-accent-blue hover:bg-brand-accent-blue/10 dark:text-brand-accent-blue dark:hover:bg-brand-accent-blue/10',
      link: 
        'text-brand-accent-blue hover:text-brand-accent-blue/90 dark:text-brand-accent-blue dark:hover:text-brand-accent-blue/90 underline-offset-4 hover:underline disabled:text-brand-dark-text-tertiary',
      glass:
        'transition-all duration-300 ease-in-out backdrop-blur-md shadow-lg border text-white \
         bg-gradient-to-r from-[#3B82F6]/80 to-[#1D4ED8]/70 \
         hover:from-[#3B82F6]/90 hover:to-[#1D4ED8]/80 \
         border-[#60A5FA]/20 \
         dark:bg-gradient-to-r dark:from-[#2563EB]/40 dark:to-[#1E40AF]/20 \
         dark:hover:from-[#2563EB]/60 dark:hover:to-[#1E40AF]/40 \
         dark:border-white/10 dark:text-white',
    };

    const iconSize = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      icon: 'h-5 w-5', // For 20px icons
    };

    const iconSpacing = size === 'sm' ? 'mr-1.5' : 'mr-2';
    const rightIconSpacing = size === 'sm' ? 'ml-1.5' : 'ml-2';

    const actualDisabled = isLoading || disabled;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (isLoading || disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const buttonContent = (
      <>
        {isLoading && <IconSpinner className={`${iconSize[size]} ${children ? iconSpacing : ''}`} />}
        {!isLoading && leftIcon && React.cloneElement(leftIcon, { className: `${iconSize[size]} ${children ? iconSpacing : ''}` })}
        {children}
        {!isLoading && rightIcon && React.cloneElement(rightIcon, { className: `${iconSize[size]} ${children ? rightIconSpacing : ''}` })}
      </>
    );

    if (href) { // Render as <a> if href is provided, regardless of variant
      return (
        <a
          href={href}
          className={`${commonStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} // Apply the correct variant style
          aria-disabled={actualDisabled}
          onClick={(e) => {
            if (actualDisabled) {
              e.preventDefault();
              return;
            }
            // If a custom onClick is also provided for the anchor, call it.
            // This is less common for simple href links but supported.
            if (onClick) {
              onClick(e as unknown as MouseEvent<HTMLButtonElement>); 
            }
          }}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {buttonContent}
        </a>
      );
    }

    // Basic asChild implementation (can be enhanced with Radix Slot)
    if (asChild && React.isValidElement(children)) {
        const childProps = {
            ...props,
            ...(children.props as any),
            ref,
            disabled: actualDisabled,
            onClick: handleClick,
            className: `${commonStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${(children.props as any).className || ''}`,
        };
        return React.cloneElement(children, childProps);
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={actualDisabled}
        className={`${commonStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

// Example of how to use ReactElement for icons if you don't want to import LucideProps directly
// This is a more generic way if you don't want a hard dependency on Lucide in ButtonProps type
interface GenericIconProps {
  className?: string;
  // other common icon props
}
export type IconType = ReactElement<GenericIconProps>;
