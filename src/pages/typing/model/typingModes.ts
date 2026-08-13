import { TbCircleLetterD, TbCircleLetterJ, TbCircleLetterS } from 'react-icons/tb'

export const TYPING_MODES = [
  {
    mode: '일상 영어',
    description: '일상적인 영어 문장으로 연습해요!',
    icon: TbCircleLetterD,
    serverValue: 'DAILY',
  },
  {
    mode: 'Java',
    description: 'Java 코드를 따라치며 연습해요!',
    icon: TbCircleLetterJ,
    serverValue: 'JAVA',
  },
  {
    mode: 'Javascript',
    description: 'Javascript 코드를 따라치며 연습해요!',
    icon: TbCircleLetterS,
    serverValue: 'JAVASCRIPT',
  },
]
