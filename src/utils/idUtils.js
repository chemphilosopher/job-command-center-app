// ID generation utilities
import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a unique ID for records
 * @returns {string} UUID v4 string
 */
export function generateId() {
  return uuidv4()
}
