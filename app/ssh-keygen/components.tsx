'use client'

import {Button} from '@/components/ui/button'
import SyntaxHighlighter from 'react-syntax-highlighter';
import {github} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {useQuery} from "@tanstack/react-query";
import {generateKeyPair} from "@/app/ssh-keygen/generateKeyPair";
import {useClipboard} from '@/hooks/use-clipboard'
import ShikiHighlighter from "react-shiki";
import '@/components/styles/codeblock.css'

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
              <ShikiHighlighter language="shell" theme="github-light" showLanguage={false}>
                {keyPair.publicKey}
              </ShikiHighlighter>
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
              <div className="bg-muted p-4 rounded-lg text-sm font-mono max-w-full overflow-x-auto elevation-1">
                <div className="min-w-0 break-words whitespace-pre-wrap">
                  {keyPair.privateKey}
                </div>
              </div>
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
              <ShikiHighlighter language="bash" theme="github-light" showLanguage={false}>
                {[
                  `chmod 600 ~/.ssh/id_ed25519`,
                  `chmod 644 ~/.ssh/id_ed25519.pub`
                ].join("\n")}
              </ShikiHighlighter>
            </div>
            <div>
              <strong className="text-primary">3. Add to SSH agent:</strong>
              <div className="mt-2 bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto elevation-1">
                <div className="whitespace-nowrap">
                  <SyntaxHighlighter language="shell" style={github}>
                    {`ssh-add ~/.ssh/id_ed25519`}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
            <div>
              <strong className="text-primary">4. Add public key to servers:</strong>
              <div className="mt-2 bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto elevation-1">
                <div className="whitespace-nowrap">
                  <SyntaxHighlighter language="shell" style={github}>
                    {[
                      `# Copy public key content to ~/.ssh/authorized_keys on target server`,
                      `# Or use: `,
                      `ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server`,
                    ].join("\n")}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-6 elevation-1 w-full">
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
