import { useEffect, useState } from 'react'

type Props = {
    initialTime: number // in seconds
    isRunning: boolean
    onTimeUp: () => void
}

export const CountdownTimer = ({ initialTime, isRunning, onTimeUp }: Props) => {
    const [timeLeft, setTimeLeft] = useState(initialTime)

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
