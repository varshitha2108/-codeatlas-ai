import { useTheme } from './context/ThemeContext'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex h-screen items-center justify-center bg-canvas flex-col gap-4">
      <h1 className="text-4xl font-bold text-accent">Current theme: {theme}</h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-md bg-accent text-white font-sans"
      >
        Toggle theme
      </button>
    </div>
  )
}

export default App