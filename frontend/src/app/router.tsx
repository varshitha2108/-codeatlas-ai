import { createBrowserRouter } from 'react-router-dom'
import { LoginScreen } from '../screens/login/LoginScreen'
import { LandingScreen } from '../screens/landing/LandingScreen'
import { AuthSuccessScreen } from '../screens/auth-success/AuthSuccessScreen'
import { IngestionProgressOverlay } from '../screens/ingestion-progress/IngestionProgressOverlay'
import { WorkspaceScreen } from '../screens/workspace/WorkspaceScreen'
import { SettingsScreen } from '../screens/settings/SettingsScreen'

export const router = createBrowserRouter([
  { path: '/', element: <LoginScreen /> },
  { path: '/home', element: <LandingScreen /> },
  { path: '/auth/success', element: <AuthSuccessScreen /> },
  { path: '/import/progress', element: <IngestionProgressOverlay /> },
  { path: '/workspace/:projectId', element: <WorkspaceScreen /> },
  { path: '/settings', element: <SettingsScreen /> },
])