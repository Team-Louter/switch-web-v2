import * as S from './MentoringEntryPage.style'

const ROOM_SKELETON_COUNT = 6
const QUESTION_SKELETON_COUNT = 5

export function MentoringRoomListSkeleton() {
  return (
    <S.SkeletonList role="status" aria-label="멘토링 방을 불러오는 중입니다.">
      {Array.from({ length: ROOM_SKELETON_COUNT }, (_, index) => (
        <S.SkeletonRoomItem key={index} aria-hidden="true">
          <S.SkeletonRoomAvatar />
          <S.SkeletonRoomName />
          <S.SkeletonMenu />
        </S.SkeletonRoomItem>
      ))}
    </S.SkeletonList>
  )
}

export function MentoringQuestionListSkeleton() {
  return (
    <S.SkeletonList role="status" aria-label="멘토링 질문을 불러오는 중입니다.">
      {Array.from({ length: QUESTION_SKELETON_COUNT }, (_, index) => (
        <S.SkeletonQuestionItem key={index} aria-hidden="true">
          <S.SkeletonQuestionBody>
            <S.SkeletonQuestionTitle />
            <S.SkeletonQuestionMeta>
              <S.SkeletonQuestionStatus />
              <S.SkeletonQuestionDate />
            </S.SkeletonQuestionMeta>
          </S.SkeletonQuestionBody>
          <S.SkeletonMenu />
        </S.SkeletonQuestionItem>
      ))}
    </S.SkeletonList>
  )
}

export function MentoringDetailSkeleton() {
  return (
    <S.SkeletonDetail role="status" aria-label="멘토링 상세를 불러오는 중입니다.">
      <S.SkeletonDetailHeader aria-hidden="true">
        <S.SkeletonStatus />
        <S.SkeletonQuestionInfo>
          <S.SkeletonRoomLabel />
          <S.SkeletonDetailTitle />
          <S.SkeletonDetailAction />
        </S.SkeletonQuestionInfo>
      </S.SkeletonDetailHeader>
      <S.SkeletonCreatedAt aria-hidden="true" />
      <S.SkeletonChat>
        <S.SkeletonMessageList aria-hidden="true">
          <S.SkeletonMessageGroup>
            <S.SkeletonMessageAvatar />
            <S.SkeletonMessageBody>
              <S.SkeletonSenderName />
              <S.SkeletonBubble $width="188px" />
              <S.SkeletonMessageTime />
            </S.SkeletonMessageBody>
          </S.SkeletonMessageGroup>
          <S.SkeletonMessageGroup>
            <S.SkeletonMessageAvatar />
            <S.SkeletonMessageBody>
              <S.SkeletonSenderName />
              <S.SkeletonBubble $width="280px" />
              <S.SkeletonMessageTime />
            </S.SkeletonMessageBody>
          </S.SkeletonMessageGroup>
        </S.SkeletonMessageList>
        <S.SkeletonComposer aria-hidden="true">
          <S.SkeletonComposerField />
          <S.SkeletonComposerToolbar>
            <S.SkeletonComposerTools>
              <S.SkeletonTool />
              <S.SkeletonTool />
            </S.SkeletonComposerTools>
            <S.SkeletonComposerCount />
          </S.SkeletonComposerToolbar>
        </S.SkeletonComposer>
      </S.SkeletonChat>
    </S.SkeletonDetail>
  )
}
