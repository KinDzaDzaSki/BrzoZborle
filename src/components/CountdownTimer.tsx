import { useEffect, useState } from 'react'

type Props = {
    initialTime: number // in seconds
    isRunning: boolean
    onTimeUp: () => void
    timePenalty?: number // amount to reduce when penalty is applied
    applyPenalty?: boolean // trigger to apply the penalty
}

export const CountdownTimer = ({ initialTime, isRunning, onTimeUp, timePenalty = 0, applyPenalty = false }: Props) => {
    const [timeLeft, setTimeLeft] = useState(initialTime)

    // Handle time penalties
    useEffect(() => {
        if (applyPenalty && timePenalty > 0) {
            setTimeLeft((prevTime) => Math.max(0, prevTime - timePenalty))
        }
    }, [applyPenalty, timePenalty])

    useEffect(() => {
        if (!isRunning) return

        if (timeLeft === 0) {
            onTimeUp()
            return
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, isRunning, onTimeUp])

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
        <div className="text-2xl font-bold text-center p-2">
            {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
    )
}
