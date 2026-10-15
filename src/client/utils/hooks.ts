import mousetrap from 'mousetrap'
import { useEffect, useRef } from 'react'

import 'mousetrap-global-bind'

const noop = () => {}

export function useKey(key: string, action: () => void) {
  const actionRef = useRef(noop)
  actionRef.current = action

  useEffect(() => {
    mousetrap.bindGlobal(key, (event: Event) => {
      event.preventDefault()
      if (actionRef.current) {
        actionRef.current()
      }
    })

    return () => mousetrap.unbind(key)
  }, [key])
}
