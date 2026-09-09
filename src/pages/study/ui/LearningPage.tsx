import { useUserStore } from '@/entities/profile'

import { MenteeLearningPage } from './MenteeLearningPage'
import { MentorLearningPage } from './MentorLearningPage'

export function LearningPage() {
  const role = useUserStore((state) => state.user?.role)

  if (role === 'MENTOR' || role === 'LEADER') {
    return <MentorLearningPage />
  }

  if (role === 'MENTEE') {
    return <MenteeLearningPage />
  }

  return null
}
