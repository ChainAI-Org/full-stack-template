import logo from '/assets/logo.svg'
import { Link } from 'react-router'
import { useRouteContext } from '@fastify/react/client'
import { useState, useEffect } from 'react'

export function getMeta () {
  return {
    title: 'Welcome to @fastify/react!'
  }
}

export default function Index() {
  const { snapshot, state } = useRouteContext()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  
  // Initialize state on server and client
  if (!snapshot.initialized) {
    state.message = 'Task Management App'
    state.tasks = []
    state.loading = true
    state.error = null
    state.initialized = true
  }
  
  // Data fetching (for both client and server)
  useEffect(() => {
    // Skip if we already have tasks or are in the middle of loading
    if (snapshot.tasks?.length > 0 || snapshot.loading === false) {
      return
    }
    
    // Fetch tasks
    fetch('/api/tasks')
      .then(response => {
        if (!response.ok) {
          throw new Error('API request failed')
        }
        return response.json()
      })
      .then(data => {
        state.tasks = data
        state.loading = false
      })
      .catch(error => {
        console.error('Failed to fetch tasks:', error)
        state.error = 'Failed to load tasks'
        state.loading = false
      })
  }, [snapshot.initialized])
  
  
  // Handle task addition
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      })
      
      if (response.ok) {
        state.tasks = await response.json()
        setNewTaskTitle('')
      }
    } catch (error) {
      console.error('Failed to add task:', error)
    }
  }
  
  // Handle task deletion
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (response.ok) {
        state.tasks = await response.json()
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <img src={logo} className="mx-auto h-24 mb-4" />
      <h1 className="text-2xl font-bold text-center mb-6">{snapshot.message}</h1>
      
      {/* Task Form */}
      <form onSubmit={addTask} className="mb-8 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-2 border rounded"
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>
      
      {/* Task List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        
        {snapshot.loading ? (
          <p>Loading tasks...</p>
        ) : snapshot.error ? (
          <p className="text-red-500">{snapshot.error}</p>
        ) : snapshot.tasks?.length === 0 ? (
          <p>No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {snapshot.tasks?.map((task: any) => (
              <li key={task.id} className="flex items-center justify-between p-3 border rounded">
                <span className={task.completed ? 'line-through text-gray-500' : ''}>
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Example Links */}
      <div className="mt-8 pt-6 border-t">
        <h2 className="text-lg font-semibold mb-2">Other Examples</h2>
        <ul className="columns-2 list-disc list-inside">
          <li><Link to="/using-data">/using-data</Link> — isomorphic data fetching</li>
          <li><Link to="/using-store">/using-store</Link> — integrated <a href="https://github.com/pmndrs/valtio">Valtio</a> store</li>
          <li><Link to="/using-auth">/using-auth</Link> — <b>custom layout</b></li>
          <li><Link to="/form/123">/form/123</Link> — <code>POST</code> to dynamic route</li>
          <li><Link to="/actions/data">/actions/data</Link> — inline <code>GET</code> handler</li>
          <li><Link to="/streaming">/streaming</Link> — <b>streaming</b> SSR</li>
        </ul>
      </div>
    </div>
  )
}
