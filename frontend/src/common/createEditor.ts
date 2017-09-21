async function createEditor(container: HTMLElement, initialValue = '') {
  const ace = await import(/* webpackChunkName: "brace" */ 'brace')
  await import(/* webpackChunkName: "ayu-ace.mirage" */ 'ayu-ace/mirage')
  await import(/* webpackChunkName: "brace.javascript" */ 'brace/mode/javascript')
  const editor = ace.edit(container)
  editor.session.setMode('ace/mode/javascript')
  editor.setTheme('ace/theme/ayu-mirage')
  editor.setFontSize('14px')
  editor.setPrintMarginColumn(80)
  editor.setValue(initialValue)
  editor.clearSelection()

  return editor
}

export default createEditor
