import { useNavigate } from 'react-router-dom'

import attachmentChevronIcon from '../assets/svg/attachment-chevron.svg'
import backChevronIcon from '../assets/svg/back-chevron.svg'
import boldIcon from '../assets/svg/editor-bold.svg'
import codeIcon from '../assets/svg/editor-code.svg'
import headingOneIcon from '../assets/svg/editor-heading-one.svg'
import headingTwoIcon from '../assets/svg/editor-heading-two.svg'
import imageIcon from '../assets/svg/editor-image.svg'
import italicIcon from '../assets/svg/editor-italic.svg'
import linkIcon from '../assets/svg/editor-link.svg'
import orderedListIcon from '../assets/svg/editor-ordered-list.svg'
import quoteIcon from '../assets/svg/editor-quote.svg'
import strikeIcon from '../assets/svg/editor-strike.svg'
import underlineIcon from '../assets/svg/editor-underline.svg'
import unorderedListIcon from '../assets/svg/editor-unordered-list.svg'
import { Button } from '@/shared/ui'

import * as S from './CommunityWritePage.style'

interface EditorTool {
  label: string
  icon: string
  width: number
  height: number
}

const CATEGORIES = [
  '공지사항',
  '자유게시판',
  '정보 공유',
  '과제',
  '로드맵',
  '대회',
  'Q&A',
] as const

const EDITOR_TOOLS: readonly EditorTool[] = [
  { label: '굵게', icon: boldIcon, width: 15.001, height: 21.314 },
  { label: '기울임', icon: italicIcon, width: 11, height: 21.314 },
  { label: '밑줄', icon: underlineIcon, width: 14.999, height: 21.314 },
  { label: '취소선', icon: strikeIcon, width: 16.999, height: 21.314 },
  { label: '제목 1', icon: headingOneIcon, width: 24, height: 24 },
  { label: '제목 2', icon: headingTwoIcon, width: 24, height: 24 },
  { label: '글머리표 목록', icon: unorderedListIcon, width: 20, height: 20 },
  { label: '번호 목록', icon: orderedListIcon, width: 20, height: 20 },
  { label: '코드', icon: codeIcon, width: 22, height: 22 },
  { label: '인용', icon: quoteIcon, width: 24, height: 24 },
  { label: '링크', icon: linkIcon, width: 21.001, height: 21 },
  { label: '이미지', icon: imageIcon, width: 20, height: 20 },
]

export function CommunityWritePage() {
  const navigate = useNavigate()

  const handleBackToList = () => {
    navigate('/community')
  }

  return (
    <S.Page>
      <S.Content>
        <S.Header>
          <S.BackButton type="button" onClick={handleBackToList}>
            <S.BackIcon src={backChevronIcon} alt="" />
            목록 보기
          </S.BackButton>

          <S.WriteForm>
            <S.TitleRow>
              <S.Heading>게시글 작성</S.Heading>
              <Button size="md">게시하기</Button>
            </S.TitleRow>

            <S.Fields>
              <S.CategoryField>
                <S.CategorySelect defaultValue="" aria-label="카테고리">
                  <option value="" disabled>
                    카테고리
                  </option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </S.CategorySelect>
                <S.CategoryChevron src={attachmentChevronIcon} alt="" />
              </S.CategoryField>

              <S.TitleInput
                type="text"
                aria-label="게시글 제목"
                placeholder="제목을 입력해주세요"
              />
            </S.Fields>
          </S.WriteForm>
        </S.Header>

        <S.Editor aria-label="게시글 내용 편집기">
          <S.Toolbar>
            <S.ToolbarActions aria-label="서식 도구">
              {EDITOR_TOOLS.map((tool) => (
                <S.ToolbarButton
                  key={tool.label}
                  type="button"
                  aria-label={tool.label}
                >
                  <S.ToolbarIcon
                    src={tool.icon}
                    alt=""
                    $width={tool.width}
                    $height={tool.height}
                  />
                </S.ToolbarButton>
              ))}
            </S.ToolbarActions>

            <S.AnonymousLabel>
              익명으로 게시하기
              <S.AnonymousToggle type="checkbox" role="switch" />
            </S.AnonymousLabel>
          </S.Toolbar>

          <S.EditorDivider />
          <S.ContentInput
            aria-label="게시글 내용"
            placeholder="어떤 내용을 공유하고 싶으신가요?"
          />
        </S.Editor>
      </S.Content>
    </S.Page>
  )
}
