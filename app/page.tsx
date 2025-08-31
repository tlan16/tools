import Link from 'next/link'


export default function Home() {
  return (
    <div className="flex-1 p-6">
      <h3 className="text-xl font-semibold mb-4">Available Tools</h3>
      <p className="text-muted-foreground mb-6">
        Select a tool from the sidebar to get started.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/ssh-keygen"
          prefetch={true}
          className="rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
        >
          <h4 className="font-semibold mb-2">SSH Keygen</h4>
          <p className="text-sm text-muted-foreground">
            Generate Ed25519 SSH key pairs for secure authentication.
          </p>
        </Link>

        <Link
          href="/basic-auth"
          prefetch={true}
          className="rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
        >
          <h4 className="font-semibold mb-2">Basic Auth</h4>
          <p className="text-sm text-muted-foreground">
            Generate HTTP Basic Authentication credentials and headers.
          </p>
        </Link>
      </div>
    </div>
  )
}
