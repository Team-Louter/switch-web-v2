import { useNavigate } from 'react-router-dom'

import authorChoiHyeonSu from '../assets/images/author-choi-hyeon-su.png'
import authorIdoYeon from '../assets/images/author-ido-yeon.png'
import authorJeonSuAn from '../assets/images/author-jeon-su-an.png'
import authorJoSangCheol from '../assets/images/author-jo-sang-cheol.png'
import authorLeeJunHyeon from '../assets/images/author-lee-jun-hyeon.png'
import attachmentChevronIcon from '../assets/svg/attachment-chevron.svg'
import backChevronIcon from '../assets/svg/back-chevron.svg'
import heartColoredIcon from '../assets/svg/heart-colored.svg'
import kebabIcon from '../assets/svg/kebab.svg'
import paperclipIcon from '../assets/svg/paperclip.svg'
import sendIcon from '../assets/svg/send.svg'
import commentIcon from '@/shared/assets/my/comment-icon.svg'
import eyeIcon from '@/shared/assets/my/eye-icon.svg'

import * as S from './CommunityDetailPage.style'

interface CommentItem {
  id: number
  author: string
  authorImage: string
  date: string
  dateTime: string
  content: string
  isReply: boolean
}

const COMMENTS: readonly CommentItem[] = [
  {
    id: 1,
    author: '이준현',
    authorImage: authorLeeJunHyeon,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    content: '저도 궁금합니다....',
    isReply: false,
  },
  {
    id: 2,
    author: '최현수',
    authorImage: authorChoiHyeonSu,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    content: '저도요',
    isReply: true,
  },
  {
    id: 3,
    author: '이도연',
    authorImage: authorIdoYeon,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    content: '음',
    isReply: true,
  },
  {
    id: 4,
    author: '전수안',
    authorImage: authorJeonSuAn,
    date: '2026.01.01 23:59',
    dateTime: '2026-01-01T23:59:00',
    content: '쉽지 않네요',
    isReply: false,
  },
]

export function CommunityDetailPage() {
  const navigate = useNavigate()

  const handleBackToList = () => {
    navigate('/community')
  }

  return (
    <S.Page>
      <S.Content>
        <S.BackButton type="button" onClick={handleBackToList}>
          <S.BackIcon src={backChevronIcon} alt="" />
          목록 보기
        </S.BackButton>

        <S.Article>
          <S.ArticleHeading>
            <S.TitleBlock>
              <S.CategoryBadge>Q&amp;A</S.CategoryBadge>
              <S.TitleRow>
                <S.Title>대소고 탈출하는 방법이 궁금해요</S.Title>
                <S.PostMeta>
                  <S.PostAuthor>
                    <S.PostAuthorImage
                      src={authorJoSangCheol}
                      alt="조상철 프로필"
                    />
                    <S.PostAuthorName>조상철</S.PostAuthorName>
                  </S.PostAuthor>
                  <S.MetaDot aria-hidden="true" />
                  <S.PostDate dateTime="2026-01-01T23:59:00">
                    2026.01.01 23:59
                  </S.PostDate>
                </S.PostMeta>
              </S.TitleRow>
            </S.TitleBlock>
            <S.Divider />
          </S.ArticleHeading>

          <S.BodyText>
            {'대소고 탈출하는 방법이 궁금합니다.\n어떻게 하면 대소고를 탈출할 수 있을까요?\n\n아는 분들은 제발 알려주세요.'}
          </S.BodyText>
        </S.Article>

        <S.Engagement aria-label="게시글 반응과 첨부파일">
          <S.EngagementRow>
            <S.StatGroup aria-label="게시글 반응">
              <S.Stat>
                <S.StatIcon src={heartColoredIcon} alt="좋아요" />
                12
              </S.Stat>
              <S.Stat>
                <S.StatIcon src={commentIcon} alt="댓글" />1
              </S.Stat>
              <S.Stat>
                <S.StatIcon src={eyeIcon} alt="조회" />32
              </S.Stat>
            </S.StatGroup>

            <S.AttachmentButton type="button" aria-expanded="false">
              <S.AttachmentLabel>
                <S.AttachmentIcon src={paperclipIcon} alt="" />
                첨부 파일 “탈출법.pdf”외 4개
              </S.AttachmentLabel>
              <S.AttachmentDivider aria-hidden="true" />
              <S.AttachmentChevron src={attachmentChevronIcon} alt="" />
            </S.AttachmentButton>
          </S.EngagementRow>
          <S.Divider />
        </S.Engagement>

        <S.Comments>
          <S.CommentComposer>
            <S.CommentForm>
              <S.CommentHeading>댓글</S.CommentHeading>
              <S.CommentInputRow>
                <S.CommentInput
                  type="text"
                  aria-label="댓글 내용"
                  placeholder="어떤 댓글을 남겨볼까요?"
                />
                <S.SendButton type="button" aria-label="댓글 등록">
                  <S.SendIcon src={sendIcon} alt="" />
                </S.SendButton>
              </S.CommentInputRow>
            </S.CommentForm>
            <S.AnonymousLabel>
              <S.AnonymousCheckbox type="checkbox" />
              익명으로 게시
            </S.AnonymousLabel>
          </S.CommentComposer>

          <S.CommentList aria-label="댓글 목록">
            {COMMENTS.map((comment) => (
              <S.CommentRow key={comment.id}>
                {comment.isReply && <S.ReplyGuide aria-hidden="true" />}
                <S.CommentItem>
                  <S.CommentAuthorImage
                    src={comment.authorImage}
                    alt={`${comment.author} 프로필`}
                  />
                  <S.CommentContent>
                    <S.CommentHeader>
                      <S.CommentMeta>
                        <S.CommentAuthor>{comment.author}</S.CommentAuthor>
                        <S.MetaDot aria-hidden="true" />
                        <S.CommentDate dateTime={comment.dateTime}>
                          {comment.date}
                        </S.CommentDate>
                      </S.CommentMeta>
                      <S.CommentMenuButton
                        type="button"
                        aria-label={`${comment.author} 댓글 메뉴`}
                      >
                        <S.CommentMenuIcon src={kebabIcon} alt="" />
                      </S.CommentMenuButton>
                    </S.CommentHeader>
                    <S.CommentText>{comment.content}</S.CommentText>
                  </S.CommentContent>
                </S.CommentItem>
              </S.CommentRow>
            ))}
          </S.CommentList>
        </S.Comments>
      </S.Content>
    </S.Page>
  )
}
