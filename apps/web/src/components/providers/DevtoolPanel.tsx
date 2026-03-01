// import { DevtoolsEventClient } from './eventClient.ts'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { EventClient } from '@tanstack/devtools-event-client'
import { Button } from '../ui/button'
type EventMap = {
  // The key of the event map is a combination of {pluginId}:{eventSuffix}
  // The value is the expected type of the event payload
  'custom-devtools:counter-state': { count: number; history: number[] }
}
class CustomEventClient extends EventClient<EventMap> {
  constructor() {
    super({
      // The pluginId must match that of the event map key
      pluginId: 'custom-devtools',
    })
  }
}

// This is where the magic happens, it'll be used throughout your application.
export const DevtoolsEventClient = new CustomEventClient()

export function createCounter() {
  let count = 0
  const history: Array<number> = []

  return {
    getCount: () => count,
    increment: () => {
      count++
      history.push(count)

      // The emit eventSuffix must match that of the EventMap defined in eventClient.ts
      DevtoolsEventClient.emit('counter-state', {
        count,
        history,
      })
    },
    decrement: () => {
      count--
      history.push(count)

      DevtoolsEventClient.emit('counter-state', {
        count,
        history,
      })
    },
  }
}
export function DevtoolPanel() {
  const [state, setState] = useState<{ count: number; history: number[] } | null>(null)
  const router = useRouter()
  useEffect(() => {
    // subscribe to the emitted event
    const cleanup = DevtoolsEventClient.on('counter-state', e => setState(e.payload))
    return cleanup
  }, [])
  return (
    <div>
      <div>{state?.count}</div>
      <div>{JSON.stringify(state?.history)}</div>
      <Button onClick={() => router.back()}>back</Button>
    </div>
  )
}
