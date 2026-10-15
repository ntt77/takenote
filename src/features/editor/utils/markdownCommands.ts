import type { EditorView } from '@codemirror/view'

/**
 * Helper to wrap or unwrap the current selection with inline markdown markers.
 */
export function toggleInlineWrap(
  view: EditorView,
  marker: string,
  placeholder = 'text'
): void {
  const { from, to } = view.state.selection.main
  const markerLen = marker.length

  if (from !== to) {
    const selected = view.state.sliceDoc(from, to)

    // Check if the selection itself starts and ends with the marker
    if (
      selected.startsWith(marker) &&
      selected.endsWith(marker) &&
      selected.length >= markerLen * 2
    ) {
      const unwrapped = selected.slice(markerLen, selected.length - markerLen)
      view.dispatch({
        changes: { from, to, insert: unwrapped },
        selection: { anchor: from, head: from + unwrapped.length },
        scrollIntoView: true,
      })
      view.focus()
      return
    }

    // Check if the surrounding characters match the marker
    const docLen = view.state.doc.length
    const hasSurrounding =
      from >= markerLen &&
      to + markerLen <= docLen &&
      view.state.sliceDoc(from - markerLen, from) === marker &&
      view.state.sliceDoc(to, to + markerLen) === marker

    if (hasSurrounding) {
      view.dispatch({
        changes: [
          { from: from - markerLen, to: from, insert: '' },
          { from: to, to: to + markerLen, insert: '' },
        ],
        selection: { anchor: from - markerLen, head: to - markerLen },
        scrollIntoView: true,
      })
      view.focus()
      return
    }

    // Wrap the selected text
    const wrapped = `${marker}${selected}${marker}`
    view.dispatch({
      changes: { from, to, insert: wrapped },
      selection: { anchor: from + markerLen, head: to + markerLen },
      scrollIntoView: true,
    })
  } else {
    // Collapsed cursor: insert placeholder and select it
    const inserted = `${marker}${placeholder}${marker}`
    view.dispatch({
      changes: { from, to, insert: inserted },
      selection: { anchor: from + markerLen, head: from + markerLen + placeholder.length },
      scrollIntoView: true,
    })
  }
  view.focus()
}

/**
 * Toggle Heading level on selected line(s): none -> # -> ## -> ### -> none
 */
export function toggleHeading(view: EditorView): void {
  const { from, to } = view.state.selection.main
  const doc = view.state.doc
  const startLine = doc.lineAt(from)
  const endLine = doc.lineAt(to)

  const changes: { from: number; to: number; insert: string }[] = []

  for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo++) {
    const line = doc.line(lineNo)
    const text = line.text
    const match = text.match(/^(#{1,6})\s(.*)$/)

    if (match) {
      const level = match[1].length
      const rest = match[2]
      if (level >= 3) {
        // ### -> remove heading
        changes.push({ from: line.from, to: line.to, insert: rest })
      } else {
        // # -> ## or ## -> ###
        changes.push({ from: line.from, to: line.to, insert: `${'#'.repeat(level + 1)} ${rest}` })
      }
    } else {
      // Normal line -> H1
      changes.push({ from: line.from, to: line.to, insert: `# ${text}` })
    }
  }

  view.dispatch({ changes, scrollIntoView: true })
  view.focus()
}

/**
 * Toggle prefix on line(s) (e.g. blockquote '> ', bullet list '- ', checklist '- [ ] ')
 */
function toggleLinePrefix(
  view: EditorView,
  prefix: string,
  regexToRemove: RegExp,
  numbered = false
): void {
  const { from, to } = view.state.selection.main
  const doc = view.state.doc
  const startLine = doc.lineAt(from)
  const endLine = doc.lineAt(to)

  const changes: { from: number; to: number; insert: string }[] = []

  // Check if all lines already start with this prefix
  let allHavePrefix = true
  for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo++) {
    const line = doc.line(lineNo)
    if (!line.text.startsWith(prefix) && !(numbered && /^\d+\.\s/.test(line.text))) {
      allHavePrefix = false
      break
    }
  }

  let index = 1
  for (let lineNo = startLine.number; lineNo <= endLine.number; lineNo++) {
    const line = doc.line(lineNo)
    const text = line.text

    if (allHavePrefix) {
      // Remove prefix
      const stripped = text.replace(regexToRemove, '')
      changes.push({ from: line.from, to: line.to, insert: stripped })
    } else {
      // Remove any conflicting prefix first, then apply new prefix
      const cleaned = text.replace(regexToRemove, '')
      const currentPrefix = numbered ? `${index}. ` : prefix
      changes.push({ from: line.from, to: line.to, insert: `${currentPrefix}${cleaned}` })
      index++
    }
  }

  view.dispatch({ changes, scrollIntoView: true })
  view.focus()
}

export function toggleBlockquote(view: EditorView): void {
  toggleLinePrefix(view, '> ', /^>\s?/)
}

export function toggleBulletList(view: EditorView): void {
  toggleLinePrefix(view, '- ', /^([-*+]|\d+\.|- \[[ xX]\])\s?/)
}

export function toggleNumberedList(view: EditorView): void {
  toggleLinePrefix(view, '1. ', /^([-*+]|\d+\.|- \[[ xX]\])\s?/, true)
}

export function toggleTaskList(view: EditorView): void {
  toggleLinePrefix(view, '- [ ] ', /^([-*+]|\d+\.|- \[[ xX]\])\s?/)
}

/**
 * Insert or wrap Code Block
 */
export function insertCodeBlock(view: EditorView): void {
  const { from, to } = view.state.selection.main
  const doc = view.state.doc

  if (from !== to) {
    const selected = doc.sliceString(from, to)
    const needsPrefixNewline = from > 0 && doc.sliceString(from - 1, from) !== '\n' ? '\n' : ''
    const needsSuffixNewline = to < doc.length && doc.sliceString(to, to + 1) !== '\n' ? '\n' : ''
    const replacement = `${needsPrefixNewline}\`\`\`\n${selected}\n\`\`\`${needsSuffixNewline}`

    view.dispatch({
      changes: { from, to, insert: replacement },
      selection: { anchor: from + needsPrefixNewline.length + 4, head: from + needsPrefixNewline.length + 4 + selected.length },
      scrollIntoView: true,
    })
  } else {
    const needsPrefixNewline = from > 0 && doc.sliceString(from - 1, from) !== '\n' ? '\n' : ''
    const text = `${needsPrefixNewline}\`\`\`\ncode\n\`\`\`\n`
    view.dispatch({
      changes: { from, to, insert: text },
      selection: {
        anchor: from + needsPrefixNewline.length + 4,
        head: from + needsPrefixNewline.length + 8,
      },
      scrollIntoView: true,
    })
  }
  view.focus()
}

/**
 * Insert or wrap Link: [text](url)
 */
export function insertLink(view: EditorView): void {
  const { from, to } = view.state.selection.main
  const doc = view.state.doc

  if (from !== to) {
    const selected = doc.sliceString(from, to).trim()
    const isUrl = /^https?:\/\//i.test(selected)

    if (isUrl) {
      const insert = `[title](${selected})`
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + 1, head: from + 6 },
        scrollIntoView: true,
      })
    } else {
      const insert = `[${selected}](url)`
      view.dispatch({
        changes: { from, to, insert },
        selection: { anchor: from + selected.length + 3, head: from + selected.length + 6 },
        scrollIntoView: true,
      })
    }
  } else {
    const insert = '[title](url)'
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + 7, head: from + 10 },
      scrollIntoView: true,
    })
  }
  view.focus()
}

/**
 * Insert a Markdown Table template
 */
export function insertTable(view: EditorView): void {
  const { from, to } = view.state.selection.main
  const doc = view.state.doc

  const needsPrefixNewline = from > 0 && doc.sliceString(from - 1, from) !== '\n' ? '\n\n' : ''
  const table = `${needsPrefixNewline}| Header 1 | Header 2 | Header 3 |\n| -------- | -------- | -------- |\n| Cell 1   | Cell 2   | Cell 3   |\n`

  view.dispatch({
    changes: { from, to, insert: table },
    selection: {
      anchor: from + needsPrefixNewline.length + 2,
      head: from + needsPrefixNewline.length + 10,
    },
    scrollIntoView: true,
  })
  view.focus()
}
