"use client";

import Link from "next/link";

export function BotDetection() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-12 w-full space-y-6 h-svh">
      <div>
        <h1 className="text-2xl font-semibold">Source:
          <Link href="https://bot.sannysoft.com/"
                target="_blank"
                className="underline px-1">https://bot.sannysoft.com/
          </Link>
        </h1>
      </div>

      <div className="w-full h-full">
        <iframe
          src="https://bot.sannysoft.com/"
          title="Bot Detection - sannysoft"
          className="w-full h-full"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          loading="lazy"
        />
      </div>
    </div>
  )
}
