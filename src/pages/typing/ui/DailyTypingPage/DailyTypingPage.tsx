import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getProblemsForPractice, type TypingProblem } from '@/entities/typing'

import * as S from './DailyTypingPage.style'
import { TypingCountdown } from '../TypingCountdown/TypingCountdown'
import { TypingPracticeHeader } from '../TypingPracticeHeader/TypingPracticeHeader'

export function DailyTypingPage() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<TypingProblem[]>([])
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [typedSentence, setTypedSentence] = useState('')
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchProblems = async () => {
      const data = await getProblemsForPractice('DAILY')

      if (isMounted) setProblems(data)
    }

    void fetchProblems()

    return () => {
      isMounted = false
    }
  }, [])

  const handleCountdownComplete = useCallback(() => {
    startTimeRef.current = performance.now()
  }, [])

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
  const typingSpeed = elapsedSeconds === 0 ? 0 : Math.round(typedSentence.length / (elapsedSeconds / 60))
  const accuracy = typedSentence.length === 0 ? 100 : Math.round((correctCharacterCount / typedSentence.length) * 100)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || !currentProblem || typedSentence.length !== currentSentence.length) return

    event.preventDefault()

    if (!nextProblem) {
      navigate('/typing')
      return
    }

    setCurrentProblemIndex(currentIndex => currentIndex + 1)
    setTypedSentence('')
  }

  return (
    <S.Page>
      <TypingCountdown onComplete={handleCountdownComplete} />
      <S.PracticeFrame>
        <TypingPracticeHeader category="일상 영어" time={formattedTime} typingSpeed={`${typingSpeed}타`} accuracy={`${accuracy}%`} />

        <S.Workspace>
          <S.Paper>
            <S.SentenceRow>
              <S.Label>이전 문장</S.Label>
              <S.SentenceBlock>
                <S.Sentence>{previousProblem?.content ?? ''}</S.Sentence>
                <S.TypedLine as="div">{previousProblem?.content ?? ''}</S.TypedLine>
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
                    aria-label="문장 입력"
                    autoFocus
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
              <span>현재 1등<br />이또또</span>
            </S.Podium>
          </S.Paper>
        </S.Workspace>
      </S.PracticeFrame>
    </S.Page>
  )
}
