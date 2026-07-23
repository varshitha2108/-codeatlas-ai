import { useTheme } from './context/ThemeContext'
import { RadioGroup } from './shared/components/RadioGroup'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex h-screen items-center justify-center bg-canvas">
      <RadioGroup
        name="theme"
        value={theme}
        onChange={() => toggleTheme()}
        options={[
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' },
        ]}
      />
    </div>
  )
}

export default App