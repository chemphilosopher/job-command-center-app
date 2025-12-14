import { describe, it, expect } from 'vitest'
import {
  getStatusColor,
  getRegionColor,
  getPriorityColor,
  getCompanyStatusColor
} from '../statusUtils'

describe('statusUtils', () => {
  describe('getStatusColor', () => {
    it('returns blue classes for Applied', () => {
      expect(getStatusColor('Applied')).toContain('blue')
    })

    it('returns green classes for Offer', () => {
      expect(getStatusColor('Offer')).toContain('green')
    })

    it('returns red classes for Rejected', () => {
      expect(getStatusColor('Rejected')).toContain('red')
    })

    it('returns gray classes for Ghost', () => {
      expect(getStatusColor('Ghost')).toContain('gray')
    })

    it('returns gray classes for unknown status', () => {
      expect(getStatusColor('Unknown Status')).toContain('gray')
    })
  })

  describe('getRegionColor', () => {
    it('returns blue classes for Boston/Cambridge', () => {
      expect(getRegionColor('Boston/Cambridge')).toContain('blue')
    })

    it('returns green classes for RTP/Durham', () => {
      expect(getRegionColor('RTP/Durham')).toContain('green')
    })

    it('returns gray classes for Remote', () => {
      expect(getRegionColor('Remote')).toContain('gray')
    })

    it('returns gray classes for unknown region', () => {
      expect(getRegionColor('Unknown Region')).toContain('gray')
    })
  })

  describe('getPriorityColor', () => {
    it('returns red classes for priority 1', () => {
      expect(getPriorityColor(1)).toContain('red')
    })

    it('returns yellow classes for priority 3', () => {
      expect(getPriorityColor(3)).toContain('yellow')
    })

    it('returns gray classes for priority 5', () => {
      expect(getPriorityColor(5)).toContain('gray')
    })
  })

  describe('getCompanyStatusColor', () => {
    it('returns blue classes for Researching', () => {
      expect(getCompanyStatusColor('Researching')).toContain('blue')
    })

    it('returns green classes for Interviewing', () => {
      expect(getCompanyStatusColor('Interviewing')).toContain('green')
    })
  })
})
