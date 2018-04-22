import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import Moment from 'moment-timezone'

import * as actions from '../actions'
import { Shape } from '../shape'
import createEditor from '../../common/createEditor'

import EditorDiffOverlay from './EditorDiffOverlay'

export type OwnProps = {
  newEditorValue: string
}

export type Props = OwnProps & {
  initialValue: string
  isReadOnly: boolean
  id: number
  savedAt: Date
  setEditorValue: (value: string) => any
}

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  initialValue: state.editor.value,
  isReadOnly: state.config.isReadOnly,
  id: state.editor.id,
  savedAt: state.editor.savedAt
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

  constructor(props: any) {
    super(props)
    this.state = { showDiffModal: false }
  }

  componentWillUpdate(prevProps: Props) {
    if (prevProps.newEditorValue !== this.props.newEditorValue) {
      this.editor.getSession().setValue(prevProps.newEditorValue)
    }
  }

  toggleModal = (shouldShow: boolean) => {
    this.setState((prevState: any) => ({
      showDiffModal: shouldShow
    }))
  }

  openModal = () => this.toggleModal(true)
  closeModal = () => this.toggleModal(false)
  getLocalStorageKey = () => {
    return `source_academy_editor_${this.props.id}`
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isReadOnly !== this.props.isReadOnly) {
      this.editor.setReadOnly(this.props.isReadOnly)
    }
  }

  getLocalBackup() {
    const localBackupStr = localStorage.getItem(this.getLocalStorageKey())
    const localBackup = localBackupStr
      ? JSON.parse(localBackupStr)
      : {
          exists: false
        }
    if (localBackup.savedAt) {
      localBackup.savedAt = new Date(localBackup.savedAt)
      localBackup.exists = true
    }
    return localBackup
  }

  isLocalBackupNewer(localBackup: any) {
    // Fuzzy checking. Allow difference of up to 5 seconds
    return (
      localBackup.exists &&
      Moment(this.props.savedAt)
        .add(5, 'seconds')
        .isBefore(Moment(localBackup.savedAt)) &&
      localBackup.value !== this.props.initialValue
    )
  }

  async componentDidMount() {
    const $editor = findDOMNode(this.$editor!) as HTMLElement
    const localBackup = this.getLocalBackup()
    const editor = await createEditor($editor, this.props.initialValue)
    editor.getSession().on('change', () => {
      const saveObj = {
        value: editor.getValue(),
        savedAt: new Date()
      }
      localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(saveObj))
      this.props.setEditorValue(editor.getValue())
    })
    if (!this.props.isReadOnly && this.isLocalBackupNewer(localBackup)) {
      this.openModal()
    }
    if (this.props.isReadOnly) {
      editor.setReadOnly(true)
    }
    this.editor = editor as AceAjax.Editor
  }

  render() {
    let modal = null
    if (this.state.showDiffModal) {
      const localBackup = this.getLocalBackup()
      const modalProps = {
        localBackup: localBackup,
        cloudSave: {
          value: this.props.initialValue,
          savedAt: this.props.savedAt
        },
        handleClose: this.closeModal,
        handleSelectLocal: () => {
          this.props.setEditorValue(localBackup.value)
          this.editor.session.setValue(localBackup.value)
          this.closeModal()
        }
      }

      modal = <EditorDiffOverlay {...modalProps} />
    }
    return (
      <div className="editor-container">
        {modal}
        <div className="editor" ref={r => (this.$editor = r)} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
