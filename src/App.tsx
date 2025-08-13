import { ChartBarIcon, InformationCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import React, { useEffect, useState } from 'react'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { WinModal } from './components/modals/WinModal'
import { getTimeUntilNextWord, getWordOfDay, getWordOfDayIndex, isWinningWord, isWordInWordList } from './lib/words'
import { loadGameStateFromLocalStorage, saveGameStateToLocalStorage } from './lib/localStorage'
import { convert, LETTERS_EN } from './lib/keyboard'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import { StatsModal } from './components/modals/StatsModals'
import { MainMenuModal } from './components/modals/MainMenuModal'
import { CountdownTimer } from './components/CountdownTimer'

function App() {
    const [gameMode, setGameMode] = useState<'classic' | 'timed' | 'hard' | null>(null)
    const [isMainMenuOpen, setIsMainMenuOpen] = useState(true)
    const [currentGuess, setCurrentGuess] = useState('')
    const [isGameWon, setIsGameWon] = useState(false)
    const [isWinModalOpen, setIsWinModalOpen] = useState(false)
    const [isWinAnimationStarted, setIsWinAnimationStarted] = useState(false)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
    const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
    const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
    const [isGameLost, setIsGameLost] = useState(false)
    const [shareComplete, setShareComplete] = useState(false)
    const [timeUntilNextWord, setTimeUntilNextWord] = useState(getTimeUntilNextWord())
    const [applyPenalty, setApplyPenalty] = useState(false)
    const [guesses, setGuesses] = useState<string[]>(() => {
        const loaded = loadGameStateFromLocalStorage()
        if (loaded?.solutionIndex !== getWordOfDayIndex()) {
            return []
        }
        if (loaded.guesses.includes(getWordOfDay())) {
            setIsGameWon(true)
        }
        return loaded.guesses
    })

    const [stats, setStats] = useState(() => loadStats())

    const [solution] = useState(() => getWordOfDay())

    // Fix 1: Keep only the setter since we don't use timeRemaining directly
    const [, setTimeRemaining] = useState<number>(180)
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)

    // Fix 2: Add proper effect cleanup and dependency
    useEffect(() => {
        if (gameMode === 'timed' || gameMode === 'hard') {
            setTimeRemaining(180)
            setIsTimerRunning(true)
        } else {
            setIsTimerRunning(false)
        }

        // Cleanup when component unmounts or gameMode changes
        return () => {
            setIsTimerRunning(false)
        }
    }, [gameMode])

    useEffect(() => {
        // Don't load state from localStorage in timed mode
        if (gameMode === 'timed') {
            setGuesses([])
            return
        }
        
        const state = loadGameStateFromLocalStorage()
        if (!state || state?.solutionIndex === timeUntilNextWord.solutionIndex) {
            if (isWinModalOpen) {
                const timer = setTimeout(() => {
                    setTimeUntilNextWord(getTimeUntilNextWord)
                }, 1000)
                return () => clearTimeout(timer)
            }
        } else {
            setIsGameWon(false)
            setGuesses([])
        }
    }, [timeUntilNextWord, isWinModalOpen])

    useEffect(() => {
        saveGameStateToLocalStorage({
            guesses,
            solutionIndex: getWordOfDayIndex(),
        })
    }, [guesses])

    useEffect(() => {
        const timeout = setTimeout(() => setIsWinModalOpen(isGameWon), 2500)
        return () => clearTimeout(timeout)
    }, [isGameWon])

    useEffect(() => {
        const timeout = setTimeout(() => setIsWinAnimationStarted(isGameWon), 150 * 5 + 250)
        return () => clearTimeout(timeout)
    }, [isGameWon])

    const onChar = (value: string) => {
        if (isGameWon || isGameLost || (gameMode === 'timed' && !isTimerRunning)) {
            return
        }
        let converted = value
        if (LETTERS_EN.includes(value)) {
            converted = convert(value)
        }
        if (currentGuess.length < 5 && guesses.length < 6) {
            setCurrentGuess(`${currentGuess}${converted}`)
        }
    }

    const onDelete = () => {
        setCurrentGuess(currentGuess.slice(0, -1))
    }

    const onEnter = () => {
        if (isGameWon || isGameLost || (gameMode === 'timed' && !isTimerRunning)) {
            return
        }
        if (currentGuess.length !== 5) {
            setIsNotEnoughLetters(true)
            return setTimeout(() => {
                setIsNotEnoughLetters(false)
            }, 2000)
        }

        if (!isWordInWordList(currentGuess)) {
            setIsWordNotFoundAlertOpen(true)
            return setTimeout(() => {
                setIsWordNotFoundAlertOpen(false)
            }, 2000)
        }

        const winningWord = isWinningWord(currentGuess)

        if (currentGuess.length === 5 && guesses.length < 6 && !isGameWon) {
            setGuesses([...guesses, currentGuess])
            setCurrentGuess('')

            if (winningWord) {
                if (gameMode === 'classic') {
                    setStats(addStatsForCompletedGame(stats, guesses.length))
                }
                setIsGameWon(true)
                setIsTimerRunning(false)
                return
            }

            // Apply time penalty for wrong guesses in hard mode
            if (gameMode === 'hard' && !winningWord) {
                setApplyPenalty(true)
                // Reset the penalty flag after a brief delay
                setTimeout(() => setApplyPenalty(false), 100)
            }

            if (guesses.length === 5) {
                if (gameMode === 'classic') {
                    setStats(addStatsForCompletedGame(stats, guesses.length + 1))
                }
                setIsGameLost(true)
                setIsTimerRunning(false)
                setIsWinModalOpen(true)
            }
        }
    }

    return (
        <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Alert message="Немате внесено доволно букви" isOpen={isNotEnoughLetters} />
            <Alert message="Зборот не е пронајден во речникот на Брзо Зборле" isOpen={isWordNotFoundAlertOpen} />
            <Alert message={`Изгубивте, бараниот збор е ${getWordOfDay()}`} isOpen={isGameLost} />
            <Alert message="Копирано во clipboard за споделување" isOpen={shareComplete} variant="success" />
            <div className="flex w-80 mx-auto items-center mb-2">
                <QuestionMarkCircleIcon className="h-6 w-6 cursor-pointer" onClick={() => setIsInfoModalOpen(true)} />
                <h1 className="text-3xl sm:text-4xl text-center text-slate-700 tracking-wide sm:tracking-widest grow uppercase font-bold whitespace-nowrap">Брзо Зборле</h1>
                <ChartBarIcon className="h-6 w-6 cursor-pointer" onClick={() => setIsStatsModalOpen(true)} />
            </div>

            {gameMode && (
                <>
                    {(gameMode === 'timed' || gameMode === 'hard') && (
                        <div className="w-80 mx-auto mb-4">
                            <CountdownTimer
                                initialTime={180}
                                isRunning={isTimerRunning}
                                onTimeUp={() => {
                                    setIsTimerRunning(false)
                                    setIsGameLost(true)
                                    setIsWinModalOpen(true)
                                }}
                                timePenalty={gameMode === 'hard' ? 20 : 0}
                                applyPenalty={applyPenalty}
                            />
                        </div>
                    )}

                    <Grid
                        guesses={guesses}
                        currentGuess={currentGuess}
                        invalid={isNotEnoughLetters || isWordNotFoundAlertOpen}
                        win={isWinAnimationStarted}
                        gameMode={gameMode}
                    />

                    <Keyboard 
                        onChar={onChar} 
                        onDelete={onDelete} 
                        onEnter={onEnter} 
                        guesses={guesses}
                        gameMode={gameMode}
                    />
                </>
            )}

            <MainMenuModal
                isOpen={isMainMenuOpen}
                handleClose={() => {}}
                onModeSelect={(mode) => {
                    setGameMode(mode)
                    setIsMainMenuOpen(false)
                    if (mode === 'timed' || mode === 'hard') {
                        setIsTimerRunning(true)
                        setGuesses([])
                    }
                    // Clear any existing game state for a fresh start
                    localStorage.removeItem('gameState')
                    localStorage.removeItem('gameStats')
                    setGuesses([])
                    setIsGameWon(false)
                    setIsGameLost(false)
                    setCurrentGuess('')
                }}
            />

            <WinModal
                isOpen={isWinModalOpen}
                handleClose={() => setIsWinModalOpen(false)}
                guesses={guesses}
                handleShare={() => {
                    setIsWinModalOpen(false)
                    setShareComplete(true)
                    return setTimeout(() => {
                        setShareComplete(false)
                    }, 2000)
                }}
                timeLeft={timeUntilNextWord}
                isLost={isGameLost}
                solution={isGameLost ? solution : undefined}
            />
            <InfoModal isOpen={isInfoModalOpen} handleClose={() => setIsInfoModalOpen(false)} />
            <StatsModal isOpen={isStatsModalOpen} handleClose={() => setIsStatsModalOpen(false)} gameStats={stats} />
            <AboutModal isOpen={isAboutModalOpen} handleClose={() => setIsAboutModalOpen(false)} />

            <div className="flex flex-col items-center mt-8 space-y-4">
                {(isGameWon || isGameLost) && (
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                            setIsMainMenuOpen(true)
                            setGameMode(null)
                            setGuesses([])
                            setIsGameWon(false)
                            setIsGameLost(false)
                            setCurrentGuess('')
                            setIsTimerRunning(false)
                            localStorage.removeItem('gameState')
                            localStorage.removeItem('gameStats')
                        }}
                    >
                        Нова Игра
                    </button>
                )}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        className="flex items-center px-4 py-1 border border-transparent text-xs font-medium rounded text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        onClick={() => {
                            setGuesses([])
                            setIsGameWon(false)
                            setIsGameLost(false)
                            setCurrentGuess('')
                            setIsTimerRunning(false)
                            if (gameMode === 'timed' || gameMode === 'hard') {
                                setTimeRemaining(180)
                                setIsTimerRunning(true)
                            }
                            localStorage.removeItem('gameState')
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        ново зборче
                    </button>
                    <button
                        type="button"
                        className="flex items-center px-4 py-1 border border-transparent text-xs font-medium rounded text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        onClick={() => setIsMainMenuOpen(true)}
                    >
                        <InformationCircleIcon
                            className="h-6 w-6 cursor-pointer mr-2"
                        />
                        мени
                    </button>
                </div>
            </div>
        </div>
    )
}

export default App
