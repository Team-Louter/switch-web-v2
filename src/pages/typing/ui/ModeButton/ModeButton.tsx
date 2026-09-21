import type { IconType } from "react-icons";
import * as S from "./ModeButton.style";

interface ModeButtonProps {
  Icon: IconType;
  mode: string;
  description: string;
  setSelected: (value: string) => void;
  selected: boolean;
  serverValue: string;
}

export function ModeButton({ Icon, mode, description, setSelected, selected, serverValue }: ModeButtonProps) {
  return (
    <S.Card $selected={selected} onClick={() => setSelected(serverValue)}>
      <Icon size={35}/>
      <S.Column>
        <S.Label>{mode}</S.Label>
        <S.Value $selected={selected}>{description}</S.Value>
      </S.Column>
    </S.Card>
  )
}
