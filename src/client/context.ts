// Thin layer on top of fetch()
// to automatically perform JSON requests
import { sendJSON } from '/fetch.ts'

// The default export function runs exactly once on
// the server and once on the client during the
// first render, that is, it's not executed again
// in subsquent client-side navigation via React Router.
export default async (ctx) => {
  if (ctx.server) {
    // Use the new todoList decorator which returns a Promise
    ctx.state.todoList = await ctx.server.todoList()
  }
}

// State initializer, must be a function called state
// as this is a special context.js export and has
// special processing, e.g., serialization and hydration
export function state () {
  return {
    user: {
      authenticated: false,
    },
    todoList: null,
  }
}

// Grouped actions that operate on the state. This export
// could be named anything, no special processing involved.
export const actions = {
  authenticate (state) {
    state.user.authenticated = true
  },
  todoList: {
    async add (state, item) {
      await sendJSON('/api/todo/items', { method: 'put', json: item })
      state.todoList.push(item)
    },
    async remove (state, index) {
      await sendJSON('/api/todo/items', { method: 'delete', json: index })
      state.todoList.splice(index, 1)
    },
  }
}
