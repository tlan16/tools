'use client'

import {useState, useEffect} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import SyntaxHighlighter from 'react-syntax-highlighter';
import {github} from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface BasicAuthCredentials {
  username: string
  password: string
  authHeader: string
  htpasswdContent: string
  exampleUrl: string
}

interface GenerationOptions {
  includeNumbers: boolean
  includeUppercase: boolean
  includeSpecialChars: boolean
  passwordLength: number
  usernameLength: number
}

// Generate random password with specified options
function generatePassword(options: GenerationOptions): string {
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
  for (let i = 0; i < options.passwordLength; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }

  return password
}

// Generate random username
function generateUsername(length: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let username = ''
  for (let i = 0; i < length; i++) {
    username += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return username
}

// Generate basic auth header
function generateAuthHeader(username: string, password: string): string {
  const credentials = `${username}:${password}`
  const encoded = btoa(credentials)
  return `Authorization: Basic ${encoded}`
}

// Simple bcrypt-like hash generation (for demo purposes)
// In production, use a proper bcrypt library
function generatePasswordHash(password: string): string {
  // This is a simplified hash for demonstration
  // In real applications, use proper bcrypt hashing
  const salt = '$2b$10$' + Math.random().toString(36).substring(2, 24).padEnd(22, 'a')
  // Simplified hash - in production use actual bcrypt
  const hash = btoa(salt + password).substring(0, 31)
  return `${salt}${hash}`
}

// Generate htpasswd content
function generateHtpasswdContent(username: string, password: string): string {
  const passwordHash = generatePasswordHash(password)
  return `${username}:${passwordHash}`
}

// Generate example URL with embedded auth
function generateExampleUrl(username: string, password: string): string {
  return `https://${encodeURIComponent(username)}:${encodeURIComponent(password)}@example.com/protected/resource`
}

export function BasicAuth() {
  const [credentials, setCredentials] = useState<BasicAuthCredentials | null>(null)
  const [options, setOptions] = useState<GenerationOptions>({
    includeNumbers: true,
    includeUppercase: true,
    includeSpecialChars: true,
    passwordLength: 16,
    usernameLength: 8
  })
  const [customUsername, setCustomUsername] = useState('')
  const [customPassword, setCustomPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Update credentials whenever username or password changes
  useEffect(() => {
    if (customUsername && customPassword) {
      updateCredentials(customUsername, customPassword)
    }
  }, [customUsername, customPassword])

  // Auto-generate credentials when component mounts or options change
  useEffect(() => {
    generateCredentials()
  }, [options])

  const updateCredentials = (username: string, password: string) => {
    setCredentials({
      username,
      password,
      authHeader: generateAuthHeader(username, password),
      htpasswdContent: generateHtpasswdContent(username, password),
      exampleUrl: generateExampleUrl(username, password)
    })
  }

  const generateCredentials = () => {
    setError(null)

    try {
      const username = generateUsername(options.usernameLength)
      const password = generatePassword(options)

      setCustomUsername(username)
      setCustomPassword(password)
      updateCredentials(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate credentials')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available. Please use a modern browser or ensure the page is served over HTTPS.')
      }
      await navigator.clipboard.writeText(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy to clipboard')
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 xl:p-12 pt-4 sm:pt-6 w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Basic Auth</h2>
      </div>

      <div className="space-y-6 w-full">
        <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">Generate Basic Auth Credentials</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Generate username and password for HTTP Basic Authentication with htpasswd file output.
          </p>

          {/* Generation Options */}
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-medium">Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username Length</label>
                <Input
                  type="number"
                  min="4"
                  max="32"
                  value={options.usernameLength}
                  onChange={(e) => setOptions({...options, usernameLength: parseInt(e.target.value) || 8})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password Length</label>
                <Input
                  type="number"
                  min="8"
                  max="64"
                  value={options.passwordLength}
                  onChange={(e) => setOptions({...options, passwordLength: parseInt(e.target.value) || 16})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Include in Password</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.includeNumbers}
                    onChange={(e) => setOptions({...options, includeNumbers: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Numbers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.includeUppercase}
                    onChange={(e) => setOptions({...options, includeUppercase: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Uppercase Letters</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options.includeSpecialChars}
                    onChange={(e) => setOptions({...options, includeSpecialChars: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Special Characters</span>
                </label>
              </div>
            </div>
          </div>

          <Button
            onClick={generateCredentials}
            variant="default"
            size="lg"
            className="mb-4"
          >
            Generate Basic Auth Credentials
          </Button>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl max-w-full overflow-hidden elevation-1">
              <div className="break-words">{error}</div>
            </div>
          )}
        </div>

        {/* Editable Credentials */}
        <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Credentials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
          </div>
        </div>

        {credentials && (
          <div className="space-y-6 w-full">
            {/* Username and Password */}
            <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">Username & Password</h3>
              <div className="bg-muted p-4 rounded-lg text-sm font-mono break-all max-w-full overflow-x-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <strong>Username:</strong> {credentials.username}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 h-8 px-2 text-xs"
                      onClick={() => copyToClipboard(credentials.username)}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <strong>Password:</strong> {credentials.password}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 h-8 px-2 text-xs"
                      onClick={() => copyToClipboard(credentials.password)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Header */}
            <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-card-foreground">HTTP Authorization Header</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-8 px-2 text-xs hidden sm:flex"
                  onClick={() => copyToClipboard(credentials.authHeader)}
                >
                  Copy
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg text-sm font-mono max-w-full overflow-x-auto">
                <SyntaxHighlighter language="http" style={github}>
                  {credentials.authHeader}
                </SyntaxHighlighter>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 sm:hidden"
                onClick={() => copyToClipboard(credentials.authHeader)}
              >
                Copy header
              </Button>
            </div>

            {/* .htpasswd Content */}
            <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-card-foreground">.htpasswd File Content</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-8 px-2 text-xs hidden sm:flex"
                  onClick={() => copyToClipboard(credentials.htpasswdContent)}
                >
                  Copy
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg text-sm font-mono max-w-full overflow-x-auto">
                <SyntaxHighlighter language="apache" style={github}>
                  {credentials.htpasswdContent}
                </SyntaxHighlighter>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 sm:hidden"
                onClick={() => copyToClipboard(credentials.htpasswdContent)}
              >
                Copy .htpasswd content
              </Button>
            </div>

            {/* Example URL */}
            <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-card-foreground">Example URL with Embedded Auth</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-8 px-2 text-xs hidden sm:flex"
                  onClick={() => copyToClipboard(credentials.exampleUrl)}
                >
                  Copy
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg text-sm font-mono break-all max-w-full overflow-x-auto">
                <div className="min-w-0 break-words whitespace-pre-wrap">
                  {credentials.exampleUrl}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 sm:hidden"
                onClick={() => copyToClipboard(credentials.exampleUrl)}
              >
                Copy URL
              </Button>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Usage Instructions</h3>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <strong className="text-primary">1. HTTP Authorization Header:</strong>
              <p className="ml-4 mt-2 text-muted-foreground">
                Use the generated header in your HTTP requests to authenticate with Basic Auth protected resources.
              </p>
            </div>
            <div>
              <strong className="text-primary">2. .htpasswd File Setup:</strong>
              <p className="ml-4 mt-2 text-muted-foreground">
                Create a .htpasswd file in a secure location (outside your web root) and paste the generated content.
                Then reference this file in your .htaccess or web server configuration.
              </p>
            </div>
            <div>
              <strong className="text-primary">3. .htaccess Configuration Example:</strong>
              <div className="ml-4 mt-2 bg-muted p-3 rounded text-xs font-mono">
                <code>
                  AuthType Basic<br/>
                  AuthName "Restricted Area"<br/>
                  AuthUserFile /path/to/.htpasswd<br/>
                  Require valid-user
                </code>
              </div>
            </div>
            <div>
              <strong className="text-primary">4. URL with Embedded Auth:</strong>
              <p className="ml-4 mt-2 text-muted-foreground">
                Use the example URL format for quick testing, but avoid embedding credentials in URLs in production environments.
              </p>
            </div>
            <div>
              <strong className="text-primary">5. Security Notes:</strong>
              <ul className="ml-4 mt-2 list-disc text-muted-foreground space-y-1">
                <li>Always use HTTPS when transmitting Basic Auth credentials</li>
                <li>Store the .htpasswd file outside your web root directory</li>
                <li>The generated hash is simplified for demo - use proper bcrypt in production</li>
                <li>Consider using more secure authentication methods for production applications</li>
                <li>Regularly rotate credentials and use strong, unique passwords</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
