import { getGuessStatuses } from './statuses'
import { getWordOfDayIndex, getModeWordOfDay, getWordOfDay } from './words'

export const shareStatus = (guesses: string[], gameMode?: 'classic' | 'timed' | 'hard' | null) => {
    navigator.clipboard.writeText(
        `Брзо Зборле ${getWordOfDayIndex()} ${guesses.length}/6\n\n${generateEmojiGrid(
            guesses,
            gameMode
        )}\n\nИграјте БРЗО ЗБОРЛЕ https://zborle.mk`
    )
}

export const generateEmojiGrid = (guesses: string[], gameMode?: 'classic' | 'timed' | 'hard' | null) => {
    const solution = gameMode ? getModeWordOfDay(gameMode) : getWordOfDay()
    return guesses
        .map((guess) => {
            const status = getGuessStatuses(guess, solution)
            return guess
                .split('')
                .map((letter, i) => {
                    switch (status[i]) {
                        case 'correct':
                            return '🟩'
                        case 'present':
                            return '🟨'
                        default:
                            return '⬜'
                    }
                })
                .join('')
        })
        .join('\n')
}
