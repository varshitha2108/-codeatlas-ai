type Job = () => Promise<void>

const queue: Job[] = []
let isProcessing = false

export function enqueue(job: Job) {
  queue.push(job)
  processQueue()
}

async function processQueue() {
  if (isProcessing) return
  isProcessing = true

  while (queue.length > 0) {
    const job = queue.shift()
    if (job) {
      try {
        await job()
      } catch (err) {
        console.error('Job failed:', err)
      }
    }
  }

  isProcessing = false
}