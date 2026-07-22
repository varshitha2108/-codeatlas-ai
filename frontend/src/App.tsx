import { Button } from './shared/components/Button'
import { Card } from './shared/components/Card'
import { Badge } from './shared/components/Badge'
import { Input } from './shared/components/Input'
import { Divider } from './shared/components/Divider'

function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-canvas">
      <Card className="w-80">
        <div className="flex gap-2 mb-3">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
        <Divider className="mb-3" />
        <Input placeholder="Type something..." className="mb-3 w-full" />
        <Button variant="primary">Submit</Button>
      </Card>
    </div>
  )
}

export default App