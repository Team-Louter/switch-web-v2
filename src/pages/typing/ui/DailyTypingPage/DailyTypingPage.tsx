import { useCallback, useEffect, useRef, useState } from 'react'

import * as S from './DailyTypingPage.style'
import { TypingCountdown } from '../TypingCountdown/TypingCountdown'
import { TypingPracticeHeader } from '../TypingPracticeHeader/TypingPracticeHeader'

export function DailyTypingPage() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [typedSentence, setTypedSentence] = useState('')
  const startTimeRef = useRef<number | null>(null)

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

  const typingSpeed = elapsedSeconds === 0 ? 0 : Math.round(typedSentence.length / (elapsedSeconds / 60))
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return (
    <S.Page>
      <TypingCountdown onComplete={handleCountdownComplete} />
      <S.PracticeFrame>
        <TypingPracticeHeader category="일상 영어" time={formattedTime} typingSpeed={`${typingSpeed}타`} accuracy="100%" />

        <S.Workspace>
          <S.Paper>
            <S.SentenceRow>
              <S.Label>이전 문장</S.Label>
              <S.SentenceBlock>
                <S.Sentence>Fucking Hungry. Give me some food.</S.Sentence>
                <S.TypedLine as="div">Fucking Hungry. Give me some food.</S.TypedLine>
              </S.SentenceBlock>
            </S.SentenceRow>

            <S.SentenceRow $current>
              <S.Label $current>현재 문장</S.Label>
              <S.SentenceBlock>
                <S.Sentence>I want to go home!! Let me go!!</S.Sentence>
                <S.TypedLine aria-label="문장 입력" value={typedSentence} onChange={event => setTypedSentence(event.target.value)} />
              </S.SentenceBlock>
            </S.SentenceRow>

            <S.SentenceRow>
              <S.Label>다음 문장</S.Label>
              <S.SentenceBlock>
                <S.Sentence>I don’t have fucking vacation... I want to take a rest!!!</S.Sentence>
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
