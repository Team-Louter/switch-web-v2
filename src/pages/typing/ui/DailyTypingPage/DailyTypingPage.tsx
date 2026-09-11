import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { TypingProblem } from '@/entities/typing'
import { getRankingList } from '@/entities/typing/api/getRanking'
import { endRound, startRound, TypingCompletionModal } from '@/features/typing'

import * as S from './DailyTypingPage.style'
import { TypingCountdown } from '../TypingCountdown/TypingCountdown'
import { TypingPracticeHeader } from '../TypingPracticeHeader/TypingPracticeHeader'

export function DailyTypingPage() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<TypingProblem[]>([])
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [typedSentence, setTypedSentence] = useState('')
  const [previousTypedSentence, setPreviousTypedSentence] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isTypingEnabled, setIsTypingEnabled] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const [firstPlaceName, setFirstPlaceName] = useState('-')
  const roundIdRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const typingInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    let isMounted = true

    const beginRound = async () => {
      const round = await startRound('DAILY')

      if (isMounted) {
        roundIdRef.current = round.roundId
        setProblems(round.problems)
      }
    }

    const getFirstPlace = async () => {
      const rankingList = await getRankingList('DAILY')
      const firstPlace = rankingList.topRankings.find(ranking => ranking.rank === 1)

      if (isMounted) {
        setFirstPlaceName(firstPlace?.userName ?? '-')
      }
    }

    void beginRound()
    void getFirstPlace()

    return () => {
      isMounted = false
    }
  }, [])

  const handleCountdownComplete = useCallback(() => {
    startTimeRef.current = performance.now()
    setIsTypingEnabled(true)
  }, [])

  useEffect(() => {
    if (isTypingEnabled) typingInputRef.current?.focus()
  }, [isTypingEnabled])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (startTimeRef.current === null) return

      setElapsedSeconds(Math.floor((performance.now() - startTimeRef.current) / 1000))
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [])

  const previousProblem = problems[currentProblemIndex - 1]
  const currentProblem = problems[currentProblemIndex]
  const nextProblem = problems[currentProblemIndex + 1]
  const currentSentence = currentProblem?.content ?? ''
  const correctCharacterCount = [...typedSentence].filter((character, index) => character === currentSentence[index]).length
  const currentErrorCount = typedSentence.length - correctCharacterCount
  const completedCharacterCount = problems.slice(0, currentProblemIndex).reduce((total, problem) => total + problem.content.length, 0)
  const typingSpeed = elapsedSeconds === 0 ? 0 : Math.round((completedCharacterCount + typedSentence.length) / (elapsedSeconds / 60))
  const totalCharacterCount = completedCharacterCount + typedSentence.length
  const accuracy = totalCharacterCount === 0 ? 100 : Math.round(((totalCharacterCount - errorCount - currentErrorCount) / totalCharacterCount) * 100)
  const resultAccuracy = totalCharacterCount === 0 ? 100 : Math.round(((totalCharacterCount - errorCount) / totalCharacterCount) * 100)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.key !== 'Enter' && event.key !== ' ') || !currentProblem || typedSentence.length !== currentSentence.length) return

    event.preventDefault()
    if (!nextProblem) {
      const finalErrorCount = errorCount + currentErrorCount
      const finalAccuracy = totalCharacterCount === 0 ? 100 : Math.round(((totalCharacterCount - finalErrorCount) / totalCharacterCount) * 100)

      startTimeRef.current = null
      setErrorCount(finalErrorCount)

      if (roundIdRef.current !== null) {
        void endRound(roundIdRef.current, finalAccuracy, elapsedSeconds, typingSpeed)
      }

      setIsComplete(true)
      return
    }

    setPreviousTypedSentence(typedSentence)
    setErrorCount(count => count + currentErrorCount)
    setCurrentProblemIndex(currentIndex => currentIndex + 1)
    setTypedSentence('')
  }

  return (
    <S.Page>
      <TypingCountdown onComplete={handleCountdownComplete} />
      <S.PracticeFrame onCopy={event => event.preventDefault()}>
        <TypingPracticeHeader category="일상 영어" time={formattedTime} typingSpeed={`${typingSpeed}타`} accuracy={`${accuracy}%`} />

        <S.Workspace>
          <S.Paper>
            <S.SentenceRow>
              <S.Label>이전 문장</S.Label>
              <S.SentenceBlock>
                <S.Sentence>{previousProblem?.content ?? ''}</S.Sentence>
                <S.TypedLine as="div">
                  {[...previousTypedSentence].map((character, index) => (
                    <S.TypedCharacter key={index} $error={character !== previousProblem?.content[index]}>{character}</S.TypedCharacter>
                  ))}
                </S.TypedLine>
              </S.SentenceBlock>
            </S.SentenceRow>

            <S.SentenceRow $current>
              <S.Label $current>현재 문장</S.Label>
              <S.SentenceBlock>
                <S.Sentence>{currentSentence}</S.Sentence>
                <S.TypingInputWrapper>
                  <S.TypedCharacters aria-hidden="true">
                    {[...typedSentence].map((character, index) => (
                      <S.TypedCharacter key={index} $error={character !== currentSentence[index]}>{character}</S.TypedCharacter>
                    ))}
                  </S.TypedCharacters>
                  <S.TypingInput
                    ref={typingInputRef}
                    aria-label="문장 입력"
                    autoFocus
                    disabled={!isTypingEnabled}
                    maxLength={currentSentence.length}
                    value={typedSentence}
                    onChange={event => setTypedSentence(event.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </S.TypingInputWrapper>
              </S.SentenceBlock>
            </S.SentenceRow>

            <S.SentenceRow>
              <S.Label>다음 문장</S.Label>
              <S.SentenceBlock>
                <S.Sentence>{nextProblem?.content ?? ''}</S.Sentence>
              </S.SentenceBlock>
            </S.SentenceRow>

            <S.Eraser aria-hidden="true" />
            <S.Podium aria-hidden="true">
              <i /><i /><i />
              <span>현재 1등<br />{firstPlaceName}</span>
            </S.Podium>
          </S.Paper>
        </S.Workspace>
      </S.PracticeFrame>
      {isComplete && (
        <TypingCompletionModal
          accuracy={resultAccuracy}
          category="일상 영어"
          errorCount={errorCount}
          time={formattedTime}
          typingSpeed={typingSpeed}
          onClose={() => navigate('/typing')}
        />
      )}
    </S.Page>
  )
}
