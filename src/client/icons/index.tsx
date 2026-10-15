import React, { forwardRef } from 'react'
import type { BoxIconProps, IconSize } from '@boxicons/react'
import {
  Folder as BxFolder,
  DotsHorizontal as BxDotsHorizontal,
  Book as BxBook,
  Star as BxStar,
  Trash as BxTrash,
  TrashAlt as BxTrashAlt,
  Eye as BxEye,
  Edit as BxEdit,
  EditAlt as BxEditAlt,
  ArrowToBottom as BxArrowToBottom,
  Gear as BxGear,
  Sun as BxSun,
  Moon as BxMoon,
  Clipboard as BxClipboard,
  ArrowUp as BxArrowUp,
  X as BxX,
  Command as BxCommand,
  Archive as BxArchive,
  ArchiveArrowDown as BxArchiveArrowDown,
  ArchiveArrowUp as BxArchiveArrowUp,
  Plus as BxPlus,
  ChevronDown as BxChevronDown,
  ChevronRight as BxChevronRight,
  Layers as BxLayers,
} from '@boxicons/react'

export interface IconProps extends Omit<BoxIconProps, 'size'> {
  size?: number | IconSize
  color?: string
}

export type Icon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>

const VALID_SIZES: IconSize[] = [
  'xs',
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
]

export function createIcon(BoxIconComponent: React.ComponentType<any>): Icon {
  const WrappedIcon = forwardRef<SVGSVGElement, IconProps>(
    ({ size, width, height, color, fill, ...rest }, ref) => {
      let resolvedWidth = width
      let resolvedHeight = height
      let resolvedSize: IconSize | undefined

      if (typeof size === 'number') {
        resolvedWidth = resolvedWidth ?? size
        resolvedHeight = resolvedHeight ?? size
      } else if (typeof size === 'string' && VALID_SIZES.includes(size as IconSize)) {
        resolvedSize = size as IconSize
      }

      const resolvedFill = fill ?? color ?? 'currentColor'

      return (
        <BoxIconComponent
          ref={ref}
          width={resolvedWidth}
          height={resolvedHeight}
          size={resolvedSize}
          fill={resolvedFill}
          {...rest}
        />
      )
    }
  )

  WrappedIcon.displayName = BoxIconComponent.displayName || BoxIconComponent.name || 'BoxIcon'

  return WrappedIcon
}

export const Folder = createIcon(BxFolder)
export const DotsHorizontal = createIcon(BxDotsHorizontal)
export const MoreHorizontal = DotsHorizontal
export const Book = createIcon(BxBook)
export const Star = createIcon(BxStar)
export const Trash = createIcon(BxTrash)
export const TrashAlt = createIcon(BxTrashAlt)
export const Trash2 = TrashAlt
export const Eye = createIcon(BxEye)
export const Edit = createIcon(BxEdit)
export const EditAlt = createIcon(BxEditAlt)
export const Edit2 = EditAlt
export const ArrowToBottom = createIcon(BxArrowToBottom)
export const Download = ArrowToBottom
export const Gear = createIcon(BxGear)
export const Settings = Gear
export const Sun = createIcon(BxSun)
export const Moon = createIcon(BxMoon)
export const Clipboard = createIcon(BxClipboard)
export const ArrowUp = createIcon(BxArrowUp)
export const X = createIcon(BxX)
export const Command = createIcon(BxCommand)
export const Archive = createIcon(BxArchive)
export const ArchiveArrowDown = createIcon(BxArchiveArrowDown)
export const DownloadCloud = ArchiveArrowDown
export const ArchiveArrowUp = createIcon(BxArchiveArrowUp)
export const UploadCloud = ArchiveArrowUp
export const Plus = createIcon(BxPlus)
export const ChevronDown = createIcon(BxChevronDown)
export const ChevronRight = createIcon(BxChevronRight)
export const Layers = createIcon(BxLayers)
