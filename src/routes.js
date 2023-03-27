import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'
import fs from 'fs'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select('tasks', search ? {
        name: search,
        email: search
      } : null)  
      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      }
    
      database.insert('tasks', task)
    
      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      let currentTask = database.select('tasks', { id })

      if (currentTask[0] === undefined) {
        return res.writeHead(400).end()
      }

      let updateTask = currentTask[0]
      updateTask.title = title ?? updateTask.title
      updateTask.description = description ?? updateTask.description
      updateTask.updated_at = Date.now()

      database.update('tasks', id, updateTask)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      let currentTask = database.select('tasks', { id })

      if (currentTask[0] === undefined) {
        return res.writeHead(400).end()
      }

      let updateTask = currentTask[0]
      updateTask.completed_at = Date.now()

      database.update('tasks', id, updateTask)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]