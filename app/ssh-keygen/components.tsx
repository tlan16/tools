'use client'

import {Button} from '@/components/ui/button'
import {useQuery} from "@tanstack/react-query";
import {generateKeyPair} from "@/app/ssh-keygen/generateKeyPair";
import {useClipboard} from '@/hooks/use-clipboard'
import '@/components/codeblock/codeblock.css'
import {Codeblock} from "@/components/codeblock/codeblock";

export function SSHKeygen() {
  const {isFetching, data: keyPair, refetch} = useQuery({
    queryKey: ['ssh-keygen-keypair'],
    queryFn: generateKeyPair,
    retry: 10,
    enabled: true,
  })

  const {copyToClipboard, error} = useClipboard()

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
            onClick={() => refetch()}
            disabled={isFetching}
            variant="default"
            size="lg"
            className="mb-4"
          >
            {isFetching ? 'Generating...' : 'Generate Ed25519 Key Pair'}
          </Button>

          {error && (
            <div
              className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl max-w-full overflow-hidden elevation-1">
              <div className="break-words">{error}</div>
            </div>
          )}
        </div>

        {keyPair && (
          <div className="space-y-6 w-full">
            <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-card-foreground">Public Key</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-8 px-2 text-xs hidden sm:flex"
                  onClick={() => copyToClipboard(keyPair.publicKey)}
                >
                  Copy
                </Button>
              </div>
              <Codeblock language="publickey" theme="github-light" showLanguage={false}>
                {keyPair.publicKey}
              </Codeblock>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 sm:hidden"
                onClick={() => copyToClipboard(keyPair.publicKey)}
              >
                Copy public key
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-6 elevation-1 w-full">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-card-foreground">Private Key</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 h-8 px-2 text-xs hidden sm:flex"
                  onClick={() => copyToClipboard(keyPair.privateKey)}
                >
                  Copy
                </Button>
              </div>
              <Codeblock language="privatekey" theme="github-light" showLanguage={false}>
                {keyPair.privateKey}
              </Codeblock>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 sm:hidden"
                onClick={() => copyToClipboard(keyPair.privateKey)}
              >
                Copy private key
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
                <li>Save the private key to <code
                  className="bg-muted px-2 py-1 rounded break-words text-xs">~/.ssh/id_ed25519</code></li>
                <li>Save the public key to <code
                  className="bg-muted px-2 py-1 rounded break-words text-xs">~/.ssh/id_ed25519.pub</code></li>
              </ul>
            </div>
            <div>
              <strong className="text-primary">2. Set correct permissions:</strong>
              <Codeblock language="shell" theme="github-light" showLanguage={false}>
                {[
                  `chmod 600 ~/.ssh/id_ed25519`,
                  `chmod 644 ~/.ssh/id_ed25519.pub`
                ].join("\n")}
              </Codeblock>
            </div>
            <div>
              <strong className="text-primary">3. Add to SSH agent:</strong>
              <Codeblock language="shell" theme="github-light" showLanguage={false}>
                {`ssh-add ~/.ssh/id_ed25519`}
              </Codeblock>
            </div>
            <div>
              <strong className="text-primary">4. Add public key to servers:</strong>
              <Codeblock language="shell" theme="github-light" showLanguage={false}>
                {[
                  `# Copy public key content to ~/.ssh/authorized_keys on target server`,
                  `# Or use: `,
                  `ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server`,
                ].join("\n")}
              </Codeblock>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
