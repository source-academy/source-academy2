import * as React from 'react'
import { findDOMNode } from 'react-dom'

import createEditor from '../../common/createEditor'

export type OwnProps = {
  content: string
  fontSize?: string
  width: React.CSSLength
  height: React.CSSLength
}

export type Props = OwnProps

class ReadOnlyEditor extends React.Component<Props, any> {
  $editor: HTMLDivElement | null
  editor: AceAjax.Editor

  async componentDidMount() {
    const $editor = findDOMNode(this.$editor!) as HTMLElement
    const editor = await createEditor($editor, this.props.content)
    if (this.props.fontSize) {
      editor.setFontSize(this.props.fontSize)
    }
    editor.setReadOnly(true)
    this.editor = editor as AceAjax.Editor
  }

  render() {
    return (
      <div
        style={{
          height: this.props.height,
          width: this.props.width
        }}
        ref={r => {
          this.$editor = r
        }}
      />
    )
  }
}

export default ReadOnlyEditor
