import {ReadonlyDeep} from "type-fest";

export interface BasicAuthCredentials {
  username: string
  password: string
  authHeader: string
  htpasswdContent: string
  exampleUrl: string
}

export interface CredentialOptions {
  includeNumbers: boolean
  includeUppercase: boolean
  includeSpecialChars: boolean
  passwordLength: number
  usernameLength: number
}

// Generate random password with specified options using crypto API
export function generatePassword(options: CredentialOptions): string {
  let charset = 'abcdefghijklmnopqrstuvwxyz'

  if (options.includeNumbers) {
    charset += '0123456789'
  }

  if (options.includeUppercase) {
    charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }

  if (options.includeSpecialChars) {
    charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }

  let password = ''
  const randomBytes = new Uint8Array(options.passwordLength)
  crypto.getRandomValues(randomBytes)

  for (let i = 0; i < options.passwordLength; i++) {
    password += charset.charAt(randomBytes[i] % charset.length)
  }

  return password
}

// Generate random username using crypto API
export function generateUsername(length: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let username = ''
  const randomBytes = new Uint8Array(length)
  crypto.getRandomValues(randomBytes)

  for (let i = 0; i < length; i++) {
    username += charset.charAt(randomBytes[i] % length)
  }
  return username
}

// Generate basic auth header
export function generateAuthHeader(username: string, password: string): string {
  const credentials = `${username}:${password}`
  const encoded = btoa(credentials)
  return `Authorization: Basic ${encoded}`
}

// Simple bcrypt-like hash generation (for demo purposes)
// In production, use a proper bcrypt library
export function generatePasswordHash(password: string): string {
  // This is a simplified hash for demonstration
  // In real applications, use proper bcrypt hashing
  const randomBytes = new Uint8Array(22)
  crypto.getRandomValues(randomBytes)
  const salt = '$2b$10$' + Array.from(randomBytes, byte =>
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[byte % 62]
  ).join('')
  // Simplified hash - in production use actual bcrypt
  const hash = btoa(salt + password).substring(0, 31)
  return `${salt}${hash}`
}

// Generate htpasswd content
export function generateHtpasswdContent(username: string, password: string): string {
  const passwordHash = generatePasswordHash(password)
  return `${username}:${passwordHash}`
}

// Generate example URL with embedded auth
export function generateExampleUrl(username: string, password: string): string {
  return `https://${encodeURIComponent(username)}:${encodeURIComponent(password)}@example.com/protected/resource`
}

export function generateCredentials(
  username: string, password: string
): BasicAuthCredentials {
  return {
    username,
    password,
    authHeader: generateAuthHeader(username, password),
    htpasswdContent: generateHtpasswdContent(username, password),
    exampleUrl: generateExampleUrl(username, password)
  }
}

export const defaultPasswordOptions: ReadonlyDeep<CredentialOptions> = {
  includeNumbers: true,
  includeUppercase: true,
  includeSpecialChars: true,
  passwordLength: 16,
  usernameLength: 8
}
export const defaultUsername = generateUsername(defaultPasswordOptions.usernameLength)
export const defaultPassword = generatePassword(defaultPasswordOptions)
export const defaultCredential = generateCredentials(
  defaultUsername,
  defaultPassword,
)

