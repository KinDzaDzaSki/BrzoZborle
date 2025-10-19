import { MiniCompletedRow } from './MiniCompletedRow'

type Props = {
    guesses: string[]
}

type MiniGridProps = {
    guesses: string[]
    gameMode?: 'classic' | 'timed' | 'hard' | null
}

export const MiniGrid = ({ guesses, gameMode }: MiniGridProps) => {
    return (
        <div className="pb-6">
            {guesses.map((guess, i) => (
                <MiniCompletedRow key={i} guess={guess} gameMode={gameMode} />
            ))}
        </div>
    )
}
