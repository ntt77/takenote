import React, { useEffect } from 'react'

import { TakeNoteApp } from '@/containers/TakeNoteApp'
import { useAuthStore } from '@/store'

export const App: React.FC = () => {
  const { loading, login } = useAuthStore()

  useEffect(() => {
    login()
  }, [login])

  if (loading) {
    return (
      <div className="loading">
        <div className="la-ball-beat">
          <div />
          <div />
          <div />
        </div>
      </div>
    )
  }

  return (
    <>
      <meta charSet="utf-8" />
      <title>TakeNote</title>
      <link rel="canonical" href="https://takenote.dev" />

      <TakeNoteApp />
    </>
  )
}
