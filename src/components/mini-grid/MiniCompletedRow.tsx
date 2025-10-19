import { getGuessStatuses } from '../../lib/statuses'
import { getModeWordOfDay, getWordOfDay } from '../../lib/words'
import { MiniCell } from './MiniCell'

type Props = {
    guess: string
    gameMode?: 'classic' | 'timed' | 'hard' | null
}

export const MiniCompletedRow = ({ guess, gameMode }: Props) => {
    const solution = gameMode ? getModeWordOfDay(gameMode) : getWordOfDay()
    const statuses = getGuessStatuses(guess, solution)

    return (
        <div className="flex justify-center mb-1">
            {guess.split('').map((letter, i) => (
                <MiniCell key={i} status={statuses[i]} />
            ))}
        </div>
    )
}
