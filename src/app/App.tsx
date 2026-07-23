import { AppLayout } from './layouts'
import { AppProvider } from './providers'

export function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  )
}
