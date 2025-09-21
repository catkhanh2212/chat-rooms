import { useEffect, useState } from "react"
import { calculateDuration } from "../utils/calculateDuration"
import { useChatUserStore } from "@/app/store/chatUserStore"

export function useRelativeTime(from: string | Date) {
  const [value, setValue] = useState(() => calculateDuration(from))
  const refreshMessages = useChatUserStore((state) => state.refreshMessages)

  useEffect(() => {
    setValue(calculateDuration(from))
  }, [from, refreshMessages])

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(calculateDuration(from))
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [from])

  return value
}
