import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SSH Keygen - Tools',
  description: 'Generate SSH keys with ease',
}

export default function SSHKeygenPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">SSH Keygen</h2>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Generate SSH Key Pair</h3>
          <p className="text-muted-foreground mb-6">
            Create a new Ed25519 SSH key pair for secure authentication.
          </p>

          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
            Generate Ed25519 Key Pair
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-3">Public Key</h3>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILs...
            </div>
            <button className="mt-3 text-sm text-primary hover:underline">
              Copy to clipboard
            </button>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-3">Private Key</h3>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              -----BEGIN OPENSSH PRIVATE KEY-----<br/>
              b3BlbnNzaC1rZXktdjEAAAAA...<br/>
              -----END OPENSSH PRIVATE KEY-----
            </div>
            <button className="mt-3 text-sm text-primary hover:underline">
              Download private key
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-3">Usage Instructions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong>1. Save your keys:</strong>
              <ul className="ml-4 mt-1 list-disc text-muted-foreground">
                <li>Save the private key to <code className="bg-muted px-1 rounded">~/.ssh/id_ed25519</code></li>
                <li>Save the public key to <code className="bg-muted px-1 rounded">~/.ssh/id_ed25519.pub</code></li>
              </ul>
            </div>
            <div>
              <strong>2. Set correct permissions:</strong>
              <div className="mt-1 bg-muted p-2 rounded font-mono text-xs">
                chmod 600 ~/.ssh/id_ed25519<br/>
                chmod 644 ~/.ssh/id_ed25519.pub
              </div>
            </div>
            <div>
              <strong>3. Add to SSH agent:</strong>
              <div className="mt-1 bg-muted p-2 rounded font-mono text-xs">
                ssh-add ~/.ssh/id_ed25519
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
