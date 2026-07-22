import { useState } from 'react'
import { Button } from './shared/components/Button'
import { Card } from './shared/components/Card'
import { Tabs } from './shared/components/Tabs'
import { Modal } from './shared/components/Modal'

function App() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex h-screen items-center justify-center bg-canvas gap-6">
      <Card className="w-80">
        <Tabs
          tabs={[
            { id: 'a', label: 'Overview', content: <p className="text-primary text-sm">Overview content</p> },
            { id: 'b', label: 'Details', content: <p className="text-primary text-sm">Details content</p> },
          ]}
        />
      </Card>

      <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Example Modal">
        <p className="text-secondary text-sm mb-4">This is modal content.</p>
        <Button variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
      </Modal>
    </div>
  )
}

export default App