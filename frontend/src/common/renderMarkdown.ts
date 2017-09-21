export const renderMarkdownWithoutLatex = async (markdown: string) => {
  const marked = await import(/* webpackChunkName: "marked" */ 'marked')
  const html = marked(markdown)
  return html
}

export const renderMarkdownWithLatex = async (
  container: HTMLElement,
  content?: string
) => {
  const marked = await import(/* webpackChunkName: "marked" */ 'marked')
  content = content || container.innerHTML
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    // Important: Since MathJax is used before
    sanitize: false,
    smartLists: true,
    smartypants: false
  })
  container.innerHTML = content
  const done = () => {
    let text = container.innerHTML
    text = text.replace(/^&gt;/gm, '>')
    container.innerHTML = marked(text)
  }
  MathJax.Callback.Queue(['Typeset', MathJax.Hub, container], [done])
}
