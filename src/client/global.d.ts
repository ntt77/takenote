/// <reference types="vite/client" />

declare module '*.png' {
  const value: any
  export default value
}

declare module '*.svg' {
  const value: any
  export default value
}

declare module '*.md' {
  const content: string
  export = content
}

declare module 'mousetrap'

declare module 'react-split-pane' {
  import { Component, ReactNode, CSSProperties } from 'react'

  export interface SplitPaneProps {
    split?: 'vertical' | 'horizontal'
    minSize?: number
    maxSize?: number
    defaultSize?: number
    size?: number
    allowResize?: boolean
    resizerStyle?: CSSProperties
    children?: ReactNode
    className?: string
    primary?: 'first' | 'second'
    step?: number
    onDragStarted?: () => void
    onDragFinished?: (newSize: number) => void
    onChange?: (newSize: number) => void
  }

  export default class SplitPane extends Component<SplitPaneProps, any> {}
}

