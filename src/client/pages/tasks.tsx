"use client";

import * as React from 'react';
const { useState, useEffect } = React;
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AlertCircle, ListChecks, PlusCircle, Trash2, PackageOpen } from 'lucide-react';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export default function TasksPage() {
  const { token } = useAuth(); // user object can be used if needed for display
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/tasks', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      setError(null);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: newTaskTitle })
      });
      if (!response.ok) throw new Error('Failed to add task');
      const updatedTasks = await response.json();
      setTasks(updatedTasks);
      setNewTaskTitle('');
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error(err);
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/tasks/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTasks = await response.json();
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete task');
      const updatedTasks = await response.json();
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen dark:bg-brand-dark-bg bg-brand-light-bg py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto dark:bg-brand-dark-surface bg-brand-light-surface rounded-xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-center mb-6 sm:mb-8">
          <ListChecks size={32} className="mr-3 text-brand-accent-blue" />
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-brand-dark-text-primary text-brand-light-text-primary">
            My Tasks
          </h1>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-3 mb-6 sm:mb-8 items-center">
          <Input
            id="new-task"
            type="text"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1"
            leftIcon={<PlusCircle size={18} className="dark:text-brand-dark-text-tertiary text-brand-light-text-tertiary"/>}
            aria-label="New task title"
          />
          <Button type="submit" variant="primary" disabled={!newTaskTitle.trim()}>
            Add Task
          </Button>
        </form>

        {error && (
          <div className="p-3 mb-6 bg-brand-accent-red/10 border border-brand-accent-red/30 text-brand-accent-red rounded-md text-sm">
            <div className="flex items-center">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 dark:border-brand-accent-blue border-brand-accent-blue"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 px-4 dark:bg-brand-dark-bg bg-brand-light-bg rounded-lg border dark:border-brand-dark-border border-brand-light-border shadow-sm">
            <PackageOpen size={48} className="mx-auto dark:text-brand-dark-text-tertiary text-brand-light-text-tertiary mb-4" />
            <p className="dark:text-brand-dark-text-secondary text-brand-light-text-secondary font-medium text-lg">
              No tasks here!
            </p>
            <p className="dark:text-brand-dark-text-tertiary text-brand-light-text-tertiary text-sm mt-1">
              Add a task above to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {tasks.map(task => (
              <li
                key={task.id}
                className="flex items-center p-3 sm:p-4 dark:bg-brand-dark-bg bg-brand-light-bg rounded-lg border dark:border-brand-dark-border border-brand-light-border shadow-sm hover:shadow-md dark:hover:border-brand-dark-text-tertiary hover:border-brand-light-text-tertiary transition-all duration-subtle group transform hover:-translate-y-px"
              >
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="h-5 w-5 accent-brand-accent-blue focus:ring-brand-accent-blue dark:focus:ring-offset-brand-dark-bg focus:ring-offset-brand-light-bg rounded cursor-pointer border-brand-dark-border dark:bg-brand-dark-surface"
                />
                <label 
                  htmlFor={`task-${task.id}`} 
                  className={`ml-3 flex-1 text-sm sm:text-base cursor-pointer ${task.completed ? 'line-through dark:text-brand-dark-text-tertiary text-brand-light-text-tertiary' : 'dark:text-brand-dark-text-primary text-brand-light-text-primary'}`}
                >
                  {task.title}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-2 opacity-50 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-subtle dark:text-brand-dark-text-tertiary hover:dark:text-brand-accent-red hover:text-brand-accent-red"
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
