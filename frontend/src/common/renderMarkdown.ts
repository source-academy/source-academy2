const renderMarkdown = async (markdown: string) => {
  const marked = await import(/** webpackChunkName: "marked" */ 'marked')
  const html = marked(markdown)
  return html
}

export default renderMarkdown
