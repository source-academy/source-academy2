import * as React from 'react'
import { render } from 'react-dom'
import { DateRangePicker } from '@blueprintjs/datetime'
import * as moment from 'moment-timezone'
import renderMarkdownWithoutLatex, { renderMarkdownWithLatex } from './renderMarkdown'

export const markdownView = async (container: HTMLElement) => {
  const markdown = await renderMarkdownWithoutLatex(container.textContent || '')
  container.innerHTML = markdown
}

export const latexMarkdownView = async (container: HTMLElement) => {
  await renderMarkdownWithLatex(container, container.innerHTML)
}

export const dateRangePicker = (
  container: HTMLElement,
  startInput: HTMLInputElement,
  endInput: HTMLInputElement
) => {
  const handleChange = ([newStart, newEnd]: [Date, Date]) => {
    newStart = moment(newStart).startOf('day').toDate()
    newEnd = moment(newEnd).startOf('day').toDate()
    startInput.value = newStart.getTime().toString()
    endInput.value = newEnd.getTime().toString()
  }
  let node: any
  if (startInput.value && endInput.value) {
    const startValue = moment(startInput.value).toDate()
    const endValue = moment(endInput.value).toDate()
    startInput.value = startValue.getTime().toString()
    endInput.value = endValue.getTime().toString()
    node = (
      <DateRangePicker
        defaultValue={[startValue!, endValue!]}
        onChange={handleChange}
      />
    )
  } else {
    node = <DateRangePicker onChange={handleChange} />
  }
  render(node, container)
}

export async function richTextEditor(container: HTMLInputElement) {
  const SimpleMDE = await import(/** webpackChunkName: "simplemde" */ 'simplemde')
  const value = container.value
  const mde = new SimpleMDE({
    autofocus: false,
    element: container,
    forceSync: true
  })
  mde.value(value)
}

export async function codeEditor(
  input: HTMLTextAreaElement,
  container: HTMLElement,
  mode = 'javascript'
) {
  const ace = await import(/** webpackChunkName: "brace" */ 'brace')
  await import('ayu-ace/light')
  if (mode === 'javascript') {
    await import('brace/mode/javascript')
  } else {
    await import('brace/mode/sql')
  }
  const editor = ace.edit(container)
  const session = editor.getSession()
  editor.setTheme('ace/theme/ayu-light')
  if (mode === 'javascript') {
    session.setMode('ace/mode/javascript')
  } else {
    session.setMode('ace/mode/sql')
  }
  editor.setFontSize('14px')
  editor.setValue(input.value)
  editor.on('change', () => (input.value = editor.getValue()))
  editor.clearSelection()
}

export async function jsonEditor(
  input: HTMLTextAreaElement,
  container: HTMLElement
) {
  const ace = await import(/** webpackChunkName: "brace" */ 'brace')
  await import('ayu-ace/light')
  await import('brace/mode/json')
  const editor = ace.edit(container)
  const session = editor.getSession()
  editor.setTheme('ace/theme/ayu-light')
  session.setMode('ace/mode/json')
  editor.setFontSize('14px')
  const json = JSON.parse(input.value)
  editor.setValue(JSON.stringify(json, null, '\t'))
  editor.on('change', () => (input.value = editor.getValue()))
  editor.clearSelection()
}
