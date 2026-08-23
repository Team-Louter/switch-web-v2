import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const MENTORING_DASHBOARD_PATH = '/mentoring/dashboard'

export function useMentoringEntryPage() {
  const navigate = useNavigate()

  const handleDashboardClick = useCallback(() => {
    navigate(MENTORING_DASHBOARD_PATH)
  }, [navigate])

  return {
    handleDashboardClick,
  }
}
