import {NextResponse} from 'next/server'

// Health check endpoint used as /api/dummy (healthz)
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'tools',
    endpoint: 'healthz',
    now: new Date().toISOString(),
    ok: true,
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
