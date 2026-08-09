import * as S from './DailyTypingPage.style'
import { TypingPracticeHeader } from '../TypingPracticeHeader/TypingPracticeHeader'

export function DailyTypingPage() {
  return (
    <S.Page>
      <S.PracticeFrame>
        <TypingPracticeHeader category="일상 영어" time="00:00" typingSpeed="200타" accuracy="100%" />

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
                <S.TypedLine aria-label="문장 입력" />
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
