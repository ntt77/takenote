import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { TakeNoteApp } from '@/containers/TakeNoteApp'
import { getAuth } from '@/selectors'
import { login } from '@/slices/auth'

export const App: React.FC = () => {
  // ===========================================================================
  // Selectors
  // ===========================================================================

  const { loading } = useSelector(getAuth)

  // ===========================================================================
  // Dispatch
  // ===========================================================================

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(login())
  }, [dispatch])

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
