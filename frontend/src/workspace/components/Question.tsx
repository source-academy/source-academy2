import * as React from 'react'
import { renderMarkdownWithLatex } from '../../common/renderMarkdown'

export type Props = {
  content: string
}

class Question extends React.Component<Props, {}> {
  $container: HTMLDivElement | null

  async componentDidMount() {
    renderMarkdownWithLatex(this.$container as HTMLElement, this.props.content)
  }

  render() {
    return (
      <div className="sa-question">
        <div className="content pt-dark" ref={r => this.$container = r } />
      </div>
    )
  }
}

export default Question
