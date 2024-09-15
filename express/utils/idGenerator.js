import { customAlphabet } from 'nanoid'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 8)

export function generateBookingNumber(source) {
  const prefix = source === 'party' ? 'PB' : 'DB'
  const timestamp = new Date().getTime().toString().slice(-6)
  const randomPart = nanoid()
  return `${prefix}${timestamp}${randomPart}`
}