import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadFromStorage,
  saveToStorage,
  clearStorage,
  clearAPIKeys,
  STORAGE_KEYS
} from '../storageService'

describe('storageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
  })

  describe('loadFromStorage', () => {
    it('returns parsed JSON when data exists', () => {
      const testData = { test: 'value', nested: { key: 123 } }
      localStorage.getItem.mockReturnValue(JSON.stringify(testData))

      const result = loadFromStorage('test_key')
      expect(result).toEqual(testData)
    })

    it('returns default value when key not found', () => {
      localStorage.getItem.mockReturnValue(null)

      const result = loadFromStorage('nonexistent', [])
      expect(result).toEqual([])
    })

    it('returns null as default when no default provided', () => {
      localStorage.getItem.mockReturnValue(null)

      const result = loadFromStorage('nonexistent')
      expect(result).toBeNull()
    })

    it('handles JSON parse errors gracefully', () => {
      localStorage.getItem.mockReturnValue('invalid json')

      const result = loadFromStorage('bad_key', 'fallback')
      expect(result).toBe('fallback')
    })
  })

  describe('saveToStorage', () => {
    it('saves data as JSON string', () => {
      const testData = { test: 'value' }
      saveToStorage('test_key', testData)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test_key',
        JSON.stringify(testData)
      )
    })

    it('returns true on success', () => {
      const result = saveToStorage('test_key', { data: 'test' })
      expect(result).toBe(true)
    })
  })

  describe('clearStorage', () => {
    it('removes the specified key', () => {
      clearStorage('test_key')
      expect(localStorage.removeItem).toHaveBeenCalledWith('test_key')
    })
  })

  describe('clearAPIKeys', () => {
    it('clears LLM settings API keys', () => {
      const existingSettings = {
        provider: 'openai',
        model: 'gpt-4',
        apiKeys: { OPENAI_API_KEY: 'sk-test123' }
      }
      localStorage.getItem.mockReturnValue(JSON.stringify(existingSettings))

      clearAPIKeys()

      expect(localStorage.setItem).toHaveBeenCalled()
      const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1])
      expect(savedData.apiKeys).toEqual({})
      expect(savedData.provider).toBe('openai')
    })
  })

  describe('STORAGE_KEYS', () => {
    it('has all required keys defined', () => {
      expect(STORAGE_KEYS.APPLICATIONS).toBeDefined()
      expect(STORAGE_KEYS.RESUME_VERSIONS).toBeDefined()
      expect(STORAGE_KEYS.TARGET_COMPANIES).toBeDefined()
      expect(STORAGE_KEYS.NETWORKING_TOUCHES).toBeDefined()
      expect(STORAGE_KEYS.LLM_SETTINGS).toBeDefined()
      expect(STORAGE_KEYS.LAST_BACKUP).toBeDefined()
    })
  })
})
