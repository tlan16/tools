'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface KeyPair {
  publicKey: string
  privateKey: string
}

// Convert private key to OpenSSH format
function formatPrivateKey(privateKeyBuffer: ArrayBuffer): string {
  const base64Key = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))
  const lines = base64Key.match(/.{1,64}/g) || []
  return `-----BEGIN OPENSSH PRIVATE KEY-----\n${lines.join('\n')}\n-----END OPENSSH PRIVATE KEY-----`
}

// Convert public key to SSH format
function formatPublicKey(publicKeyBytes: Uint8Array): string {
  // SSH Ed25519 public key format
  const keyType = 'ssh-ed25519'
  const keyTypeBytes = new TextEncoder().encode(keyType)

  // Create SSH wire format
  const totalLength = 4 + keyTypeBytes.length + 4 + publicKeyBytes.length
  const sshKey = new Uint8Array(totalLength)
  let offset = 0

  // Key type length (4 bytes, big endian)
  sshKey[offset++] = 0
  sshKey[offset++] = 0
  sshKey[offset++] = 0
  sshKey[offset++] = keyTypeBytes.length

  // Key type
  sshKey.set(keyTypeBytes, offset)
  offset += keyTypeBytes.length

  // Public key length (4 bytes, big endian)
  sshKey[offset++] = 0
  sshKey[offset++] = 0
  sshKey[offset++] = 0
  sshKey[offset++] = publicKeyBytes.length

  // Public key
  sshKey.set(publicKeyBytes, offset)

  const base64Key = btoa(String.fromCharCode(...sshKey))
  return `ssh-ed25519 ${base64Key}`
}

export default function SSHKeygenPage() {
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateKeyPair = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Check if Ed25519 is supported
      if (!window.crypto || !window.crypto.subtle) {
        throw new Error('Web Crypto API not supported in this browser')
      }

      // Generate Ed25519 key pair
      const cryptoKeyPair = await window.crypto.subtle.generateKey(
        {
          name: 'Ed25519',
        },
        true, // extractable
        ['sign', 'verify']
      )

      // Export keys
      const [privateKeyBuffer, publicKeyBuffer] = await Promise.all([
        window.crypto.subtle.exportKey('pkcs8', cryptoKeyPair.privateKey),
        window.crypto.subtle.exportKey('spki', cryptoKeyPair.publicKey)
      ])

      // Extract the actual Ed25519 key material from the SPKI format
      // Ed25519 public key is 32 bytes, located at the end of the SPKI structure
      const publicKeyBytes = new Uint8Array(publicKeyBuffer).slice(-32)

      const formattedPublicKey = formatPublicKey(publicKeyBytes)
      const formattedPrivateKey = formatPrivateKey(privateKeyBuffer)

      setKeyPair({
        publicKey: formattedPublicKey,
        privateKey: formattedPrivateKey
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate key pair')
    } finally {
      setIsGenerating(false)
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
        <h2 className="text-3xl font-bold tracking-tight text-foreground">SSH Keygen</h2>
      </div>

      <div className="space-y-6 w-full">
        <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
          <h3 className="text-xl font-semibold mb-4 text-card-foreground">Generate SSH Key Pair</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Create a new Ed25519 SSH key pair for secure authentication using native browser cryptography.
          </p>

          <Button
            onClick={generateKeyPair}
            disabled={isGenerating}
            variant="default"
            size="lg"
            className="mb-4"
          >
            {isGenerating ? 'Generating...' : 'Generate Ed25519 Key Pair'}
          </Button>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl max-w-full overflow-hidden elevation-1">
              <div className="break-words">{error}</div>
            </div>
          )}
        </div>

        {keyPair && (
          <div className="space-y-6 w-full">
            <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">Public Key</h3>
              <div className="bg-muted p-4 rounded-lg text-sm font-mono break-all max-w-full overflow-x-auto elevation-1">
                <div className="min-w-0 break-words whitespace-pre-wrap">
                  {keyPair.publicKey}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => copyToClipboard(keyPair.publicKey)}
              >
                Copy to clipboard
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
              <h3 className="text-lg font-semibold mb-3 text-card-foreground">Private Key</h3>
              <div className="bg-muted p-4 rounded-lg text-sm font-mono max-w-full overflow-x-auto elevation-1">
                <div className="min-w-0 break-words whitespace-pre-wrap">
                  {keyPair.privateKey}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => copyToClipboard(keyPair.privateKey)}
              >
                Copy to clipboard
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Usage Instructions</h3>
          <div className="space-y-4 text-sm leading-relaxed">
            <div>
              <strong className="text-primary">1. Save your keys:</strong>
              <ul className="ml-4 mt-2 list-disc text-muted-foreground space-y-1">
                <li>Save the private key to <code className="bg-muted px-2 py-1 rounded break-words text-xs">~/.ssh/id_ed25519</code></li>
                <li>Save the public key to <code className="bg-muted px-2 py-1 rounded break-words text-xs">~/.ssh/id_ed25519.pub</code></li>
              </ul>
            </div>
            <div>
              <strong className="text-primary">2. Set correct permissions:</strong>
              <div className="mt-2 bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto elevation-1">
                <div className="whitespace-nowrap">
                  chmod 600 ~/.ssh/id_ed25519<br/>
                  chmod 644 ~/.ssh/id_ed25519.pub
                </div>
              </div>
            </div>
            <div>
              <strong className="text-primary">3. Add to SSH agent:</strong>
              <div className="mt-2 bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto elevation-1">
                <div className="whitespace-nowrap">ssh-add ~/.ssh/id_ed25519</div>
              </div>
            </div>
            <div>
              <strong className="text-primary">4. Add public key to servers:</strong>
              <div className="mt-2 bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto elevation-1">
                <div className="whitespace-nowrap">
                  # Copy public key content to ~/.ssh/authorized_keys on target server<br/>
                  # Or use: ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-6 elevation-1 w-full">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">Security Notes</h3>
          <div className="space-y-3 text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
            <p>• Keys are generated entirely in your browser using the native Web Crypto API</p>
            <p>• No data is sent to any server - everything happens locally</p>
            <p>• Private keys should never be shared and should be stored securely</p>
            <p>• Consider using a passphrase when saving your private key</p>
          </div>
        </div>
      </div>
    </div>
  )
}
