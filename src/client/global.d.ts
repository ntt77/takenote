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

declare module 'react-beautiful-dnd' {
  import * as React from 'react'

  export interface DropResult {
    draggableId: string
    type: string
    source: {
      index: number
      droppableId: string
    }
    destination?: {
      droppableId: string
      index: number
    } | null
    reason?: 'DROP' | 'CANCEL'
    mode?: 'FLUID' | 'SNAP'
  }

  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void
    children?: React.ReactNode
  }

  export class DragDropContext extends React.Component<DragDropContextProps> {}

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => any
    placeholder?: React.ReactElement | null
    droppableProps: any
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean
    draggingOverWith?: string | null
    draggingFromThisWith?: string | null
    isUsingPlaceholder: boolean
  }

  export interface DroppableProps {
    droppableId: string
    type?: string
    mode?: 'standard' | 'virtual'
    isDropDisabled?: boolean
    isCombineEnabled?: boolean
    direction?: 'vertical' | 'horizontal'
    ignoreContainerClipping?: boolean
    renderClone?: any
    getContainerForClone?: () => HTMLElement
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactElement
  }

  export class Droppable extends React.Component<DroppableProps> {}

  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => any
    draggableProps: any
    dragHandleProps?: any
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean
    isDropAnimating: boolean
    dropAnimation?: any
    draggingOver?: string | null
    combineWith?: string | null
    combineTargetFor?: string | null
    mode?: 'FLUID' | 'SNAP' | null
  }

  export interface DraggableProps {
    draggableId: string
    index: number
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactElement
    type?: string
    isDragDisabled?: boolean
    disableInteractiveElementBlocking?: boolean
    shouldRespectForcePress?: boolean
  }

  export class Draggable extends React.Component<DraggableProps> {}
}
