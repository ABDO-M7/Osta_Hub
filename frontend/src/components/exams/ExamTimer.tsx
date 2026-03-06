"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface ExamTimerProps {
    durationMinutes: number
    onTimeUp: () => void
}

export function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)
    const totalSeconds = durationMinutes * 60

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp()
            return
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, onTimeUp])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    const percentage = (timeLeft / totalSeconds) * 100
    const isLowTime = percentage < 10

    return (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${isLowTime ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-700'}`}>
            <Clock className={`h-5 w-5 ${isLowTime ? 'animate-pulse' : ''}`} />
            <span className="font-mono font-bold text-lg w-20 text-center">{formatTime(timeLeft)}</span>
        </div>
    )
}
