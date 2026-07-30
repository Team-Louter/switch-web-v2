import { MenteeLearningPage } from './MenteeLearningPage'
import { MentorLearningPage } from './MentorLearningPage'

type UserRole = 'mentor' | 'mentee'

const TEMP_USER_ROLE = 'mentor' as UserRole

export function LearningPage() {
  return TEMP_USER_ROLE === 'mentor' ? (
    <MentorLearningPage />
  ) : (
    <MenteeLearningPage />
  )
}
