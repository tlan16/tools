export default function Home() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Tools</h2>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Available Tools</h3>
          <p className="text-muted-foreground mb-6">
            Select a tool from the sidebar to get started.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">SSH Keygen</h4>
              <p className="text-sm text-muted-foreground">
                Generate Ed25519 SSH key pairs for secure authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
