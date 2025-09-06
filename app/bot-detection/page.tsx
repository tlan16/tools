import type {Metadata} from 'next'
import {BotDetection} from "@/app/bot-detection/components";

export const metadata: Metadata = {
  title: 'Bot Detection',
  description: 'Collect and display browser fingerprint checks and diagnostics.',
}

export default function BotDetectionPage() {
  return (
    <BotDetection/>
  )
}
