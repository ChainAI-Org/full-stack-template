import logo from '/assets/logo.svg'
import { Link } from 'react-router'
import { useRouteContext } from '@fastify/react/client'
import * as React from 'react'
import { useAuth } from '../context/AuthContext'

export function getMeta () {
  return {
    title: 'Welcome to @fastify/react!'
  }
}

export default function Index() {
  const { snapshot, state } = useRouteContext()
  const { user } = useAuth()
  
  // Initialize state on server and client
  if (!snapshot.initialized) {
    state.message = 'Task Management App'
    state.initialized = true
  }
  
  // No task handling on home page - all moved to tasks page
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <img src={logo} className="mx-auto h-24 mb-4" />
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600" style={{background: "linear-gradient(to right, #0ea5e9, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
        {snapshot.message}
      </h1>
      
      {user ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Welcome, {user.username}!</h2>
          <p className="mb-4">You're logged in and can now manage your personal tasks.</p>
          <Link 
            to="/tasks" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to My Tasks
          </Link>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Welcome to the Task Manager</h2>
          <p className="mb-4">Sign up or log in to create and manage your personal tasks.</p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
      
      {/* Information about the app */}
      <div style={{background: "linear-gradient(135deg, #ffffff, #f3f4f6)", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", marginBottom: "2rem"}}>
        <h2 style={{background: "linear-gradient(to right, #0ea5e9, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem"}}>Task Management Made Simple</h2>
        <p className="text-gray-600 mb-4">
          This application allows you to create, manage, and track your personal tasks securely. 
          All your tasks are private and only visible to you after logging in.
        </p>
        <div className="flex flex-wrap gap-4 mt-6">
          <div style={{flex: 1, minWidth: "200px", padding: "1rem", background: "linear-gradient(135deg, #ffffff, #f9fafb)", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", transform: "translateY(0)", transition: "transform 0.3s ease, box-shadow 0.3s ease"}}>
            <h3 style={{background: "linear-gradient(to right, #0ea5e9, #0c4a6e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 500}}>Secure Authentication</h3>
            <p className="text-gray-600 text-sm mt-1">Your tasks are protected with secure JWT authentication</p>
          </div>
          <div style={{flex: 1, minWidth: "200px", padding: "1rem", background: "linear-gradient(135deg, #ffffff, #f9fafb)", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", transform: "translateY(0)", transition: "transform 0.3s ease, box-shadow 0.3s ease"}}>
            <h3 style={{background: "linear-gradient(to right, #8b5cf6, #4c1d95)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 500}}>Personal Task Lists</h3>
            <p className="text-gray-600 text-sm mt-1">Each user gets their own isolated task collection</p>
          </div>
          <div style={{flex: 1, minWidth: "200px", padding: "1rem", background: "linear-gradient(135deg, #ffffff, #f9fafb)", borderRadius: "0.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", transform: "translateY(0)", transition: "transform 0.3s ease, box-shadow 0.3s ease"}}>
            <h3 style={{background: "linear-gradient(to right, #14b8a6, #0f766e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 500}}>Modern Tech Stack</h3>
            <p className="text-gray-600 text-sm mt-1">Built with React, TypeScript, and Fastify</p>
          </div>
        </div>
      </div>
      

    </div>
  )
}
