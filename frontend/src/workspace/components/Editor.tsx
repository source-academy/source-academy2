import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as actions from '../actions'
import { Shape } from '../shape'
import createEditor from '../../common/createEditor'

export type OwnProps = {
  newEditorValue: string
}

export type Props = OwnProps & {
  initialValue: string
  isReadOnly: boolean
  setEditorValue: (value: string) => any
}

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  initialValue: state.editor.value,
  isReadOnly: state.config.isReadOnly
})

const mapDispatchToProps = (dispatch: Dispatch<Shape>) =>
  bindActionCreators(
    {
      setEditorValue: actions.setEditorValue
    },
    dispatch
  )

class Editor extends React.Component<Props, any> {
  $editor: HTMLDivElement | null
  editor: AceAjax.Editor

  componentWillUpdate(prevProps: Props) {
    if (prevProps.newEditorValue !== this.props.newEditorValue) {
      this.editor.getSession().setValue(prevProps.newEditorValue)
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isReadOnly !== this.props.isReadOnly) {
      this.editor.setReadOnly(this.props.isReadOnly)
    }
  }

  async componentDidMount() {
    const $editor = findDOMNode(this.$editor!) as HTMLElement
    const editor = await createEditor($editor, this.props.initialValue)
    editor.getSession().on('change', () => {
      this.props.setEditorValue(editor.getValue())
    })
    if (this.props.isReadOnly) {
      editor.setReadOnly(true)
    }
    this.editor = editor as AceAjax.Editor
  }

  render() {
    return (
      <div className="editor-container">
        <div className="editor" ref={r => (this.$editor = r)} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
