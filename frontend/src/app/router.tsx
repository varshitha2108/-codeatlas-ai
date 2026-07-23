import { createBrowserRouter } from 'react-router-dom'
import { LandingScreen } from '../screens/landing/LandingScreen'
import { IngestionProgressOverlay } from '../screens/ingestion-progress/IngestionProgressOverlay'
import { WorkspaceScreen } from '../screens/workspace/WorkspaceScreen'
import { SettingsScreen } from '../screens/settings/SettingsScreen'

export const router = createBrowserRouter([
  { path: '/', element: <LandingScreen /> },
  { path: '/import/progress', element: <IngestionProgressOverlay /> },
  { path: '/workspace/:projectId', element: <WorkspaceScreen /> },
  { path: '/settings', element: <SettingsScreen /> },
])