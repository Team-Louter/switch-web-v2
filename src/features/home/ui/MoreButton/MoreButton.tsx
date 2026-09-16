import arrowRightIcon from '../../assets/arrow-right.svg'
import * as S from './MoreButton.style'

interface MoreButtonProps {
  label?: string
  onClick: () => void
}

export function MoreButton({ label = '더보기', onClick }: MoreButtonProps) {
  return (
    <S.Chip type="button" onClick={onClick}>
      {label}
      <S.ArrowIcon src={arrowRightIcon} alt="" />
    </S.Chip>
  )
}
