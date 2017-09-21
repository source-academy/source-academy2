import {
  renderMarkdownWithoutLatex,
  renderMarkdownWithLatex
} from './common/renderMarkdown'

export const markdownView = async (container: HTMLElement) => {
  const markdown = await renderMarkdownWithoutLatex(container.textContent || '')
  container.innerHTML = markdown
}

export const latexMarkdownView = async (container: HTMLElement) => {
  await renderMarkdownWithLatex(container, container.innerHTML)
}

// Process Markdown Views
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('div.markdown-view')
  for (let i = 0; i < items.length; i++) {
    markdownView(items.item(i) as HTMLElement)
  }

  const latexMarkdowns = document.querySelectorAll('div.markdown-latex-view')
  for (let i = 0; i < latexMarkdowns.length; i++) {
    latexMarkdownView(latexMarkdowns.item(i) as HTMLElement)
  }
})
