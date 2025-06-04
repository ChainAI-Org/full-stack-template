import db from '../database.js';

/**
 * Interface for a Task record in the database.
 */
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  user_id: number | null; // User who owns this task
  created_at: string;
  updated_at: string; // To track the last modification time
}

/**
 * Retrieves all tasks from the database for a specific user, ordered by ID.
 * @param userId The ID of the user to retrieve tasks for. If not provided, returns public tasks (null user_id).
 * @returns A promise that resolves to an array of tasks.
 */
export async function getAllTasks(userId?: number): Promise<Task[]> {
  const query = db<Task>('tasks');
  
  if (userId) {
    // If userId is provided, return tasks for that user
    query.where({ user_id: userId });
  } else {
    // If no userId, return only public tasks (those with null user_id)
    query.whereNull('user_id');
  }
  
  const tasks = await query.select('*').orderBy('id', 'asc');
  return tasks;
}

/**
 * Adds a new task to the database.
 * @param title The title of the task.
 * @param userId The ID of the user creating the task. If not provided, creates a public task.
 * @returns A promise that resolves to the newly created task.
 */
export async function addTask(title: string, userId?: number): Promise<Task> {
  const [newTask] = await db<Task>('tasks')
    .insert({ 
      title, 
      completed: false,
      user_id: userId || null
    }) // created_at and updated_at will use defaultTo(knex.fn.now())
    .returning('*');
  return newTask;
}

/**
 * Deletes a task from the database by its ID.
 * @param id The ID of the task to delete.
 * @param userId The ID of the user deleting the task. If provided, ensures the task belongs to this user.
 * @returns A promise that resolves when the task is deleted, or rejects if the task doesn't exist or doesn't belong to the user.
 */
export async function deleteTask(id: number, userId?: number): Promise<void> {
  const query = db('tasks').where({ id });
  
  // If userId is provided, ensure the task belongs to this user
  if (userId) {
    query.where({ user_id: userId });
  }
  
  const deleted = await query.del();
  
  if (deleted === 0) {
    throw new Error('Task not found or you do not have permission to delete it');
  }
}

/**
 * Toggles the completion status of a task and updates its 'updated_at' timestamp.
 * @param id The ID of the task to update.
 * @param userId The ID of the user updating the task. If provided, ensures the task belongs to this user.
 * @returns A promise that resolves to the updated task, or undefined if the task is not found or doesn't belong to the user.
 */
export async function toggleTaskCompletion(id: number, userId?: number): Promise<Task | undefined> {
  const query = db<Task>('tasks').where({ id });
  
  // If userId is provided, ensure the task belongs to this user
  if (userId) {
    query.where({ user_id: userId });
  }
  
  const task = await query.first();

  if (!task) {
    return undefined;
  }

  const [updatedTask] = await db<Task>('tasks')
    .where({ id })
    // Only update if it belongs to the requesting user (or no user check if userId not provided)
    .modify(queryBuilder => {
      if (userId) {
        queryBuilder.where({ user_id: userId });
      }
    })
    .update({
      completed: !task.completed,
      updated_at: db.fn.now(), // Explicitly update the updated_at timestamp
    })
    .returning('*');
  
  return updatedTask;
}
