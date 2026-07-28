import React from "react"
import { useScreenSize } from "@/components/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"

export default function PixelTrailBackground() {
  const screenSize = useScreenSize()

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden opacity-75 dark:opacity-65 select-none">
      <PixelTrail
        pixelSize={screenSize.lessThan("md") ? 64 : 96}
        fadeDuration={800}
        delay={0}
        pixelClassName="rounded-full bg-[#FF6B00] dark:bg-[#FFE600] shadow-[0_0_12px_#FF6B00] dark:shadow-[0_0_14px_#FFE600]"
      />
    </div>
  )
}
