import * as React from 'react'
import renderMarkdown from '../../common/renderMarkdown'

export type Props = {
  content: string
}

class Question extends React.Component<Props, {}> {
  $container: HTMLDivElement | null

  async componentDidMount() {
    const { content } = this.props
    const html = await renderMarkdown(content)
    this.$container!.innerHTML = html
  }

  render() {
    return (
      <div className="sa-question">
        <div className="content pt-dark" ref={r => this.$container = r }/>
      </div>
    )
  }
}

export default Question
