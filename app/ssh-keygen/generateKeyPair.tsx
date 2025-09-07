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

export async function generateKeyPair() {
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

  return {
    publicKey: formattedPublicKey,
    privateKey: formattedPrivateKey
  }
}