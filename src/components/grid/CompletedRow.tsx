import { getGuessStatuses } from '../../lib/statuses'
import { getModeWordOfDay, getWordOfDay } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
    guess: string
    win?: boolean
    gameMode?: 'classic' | 'timed' | 'hard' | null
}

export const CompletedRow = ({ guess, win = false, gameMode }: Props) => {
  const solution = gameMode ? getModeWordOfDay(gameMode) : getWordOfDay()
  const statuses = getGuessStatuses(guess, solution)
    return (
      <div className="flex justify-center mb-1">
          {guess.split('').map((letter, i) => {
            // In hard mode, only show correct letters in correct positions
            const status = gameMode === 'hard' ? 
                (statuses[i] === 'correct' ? 'correct' : undefined) : 
                statuses[i]
            return (
              <Cell 
                key={i} 
                value={letter} 
                status={status} 
                completed={true} 
                delay={i * 150} 
                win={win} 
              />
            )
          })}
      </div>
    )
}
