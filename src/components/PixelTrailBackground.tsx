import React from "react"
import { useScreenSize } from "@/components/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"

export default function PixelTrailBackground() {
  const screenSize = useScreenSize()

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden opacity-30 dark:opacity-20 select-none">
      <PixelTrail
        pixelSize={screenSize.lessThan("md") ? 32 : 48}
        fadeDuration={600}
        delay={0}
        pixelClassName="rounded-full bg-[#FF6B00] dark:bg-[#FFE600]"
      />
    </div>
  )
}
