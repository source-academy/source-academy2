import * as React from 'react'
// @ts-ignore
import * as JsDiff from 'diff'
import { findDOMNode } from 'react-dom'
import { Button, Intent, Dialog, Classes, Icon } from '@blueprintjs/core'
import Moment from 'moment-timezone'

import createEditor from '../../common/createEditor'

export type OwnProps = {
  localBackup: {
    value: string
    savedAt: Date
  }
  cloudSave: {
    value: string
    savedAt: Date
  }
  handleClose: React.MouseEventHandler<HTMLElement>
  handleSelectLocal: React.MouseEventHandler<HTMLElement>
}

export type Props = OwnProps

class EditorDiffOverlay extends React.Component<Props, any> {
  $editorLeft: HTMLDivElement | null
  editorLeft: AceAjax.Editor
  $editorRight: HTMLDivElement | null
  editorRight: AceAjax.Editor
  diffHTML: string

  async componentDidMount() {
    const $editorLeft = findDOMNode(this.$editorLeft!) as HTMLElement
    const $editorRight = findDOMNode(this.$editorRight!) as HTMLElement
    const editorLeft = await createEditor(
      $editorLeft,
      this.props.localBackup.value
    )
    const editorRight = await createEditor(
      $editorRight,
      this.props.cloudSave.value
    )
    editorRight.setReadOnly(true)
    editorLeft.setReadOnly(true)
    this.editorLeft = editorLeft as AceAjax.Editor
    this.editorRight = editorRight as AceAjax.Editor
  }

  flexStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

  editorStyle: React.CSSProperties = {
    width: '100%',
    height: '60vh'
  }

  dialogStyle: React.CSSProperties = {
    width: '80vw'
  }

  buttonStyle: React.CSSProperties = {
    width: '35vw'
  }

  marginalizedStyle: React.CSSProperties = {
    marginBottom: '1em'
  }

  render() {
    const classes = `${Classes.CARD} ${Classes.ELEVATION_2} ${Classes.DARK}`
    const localSavedDate = Moment(this.props.localBackup.savedAt)
    const cloudSavedDate = Moment(this.props.cloudSave.savedAt)
    return (
      <Dialog className={classes} isOpen={true} style={this.dialogStyle}>
        <div className={`pt-dialog-body`}>
          <div
            className="pt-callout pt-intent-primary pt-icon-info-sign"
            style={this.marginalizedStyle}
          >
            <h4>Did you forget to save?</h4>
            We found a more recent local backup of your code and were wondering
            if you forgot to save your work. If you do use the local backup's
            code, do remember to <strong>save</strong> your work on the server
            by clicking the "Save" button.
          </div>
          <div style={this.flexStyle}>
            <div>
              <div style={this.marginalizedStyle}>
                <h3>Local Backup</h3>
                <div className="pt-text-muted">Saved at</div>
                <div className="pt-ui-text">
                  {localSavedDate.format('MMMM Do YYYY, h:mm:ss a')}{' '}
                  <em>({localSavedDate.fromNow()})</em>
                </div>
              </div>
              <div
                className="editorLeft"
                style={this.editorStyle}
                ref={r => {
                  this.$editorLeft = r
                }}
              />
              <Button
                intent={Intent.PRIMARY}
                onClick={this.props.handleSelectLocal}
                style={this.buttonStyle}
              >
                Use Local Backup
              </Button>
            </div>
            <div>
              <div style={this.marginalizedStyle}>
                <h3>Cloud Save</h3>
                <div className="pt-text-muted">Saved at</div>
                {cloudSavedDate.isValid() ? (
                  <div className="pt-ui-text">
                    {cloudSavedDate.format('MMMM Do YYYY, h:mm:ss a')}{' '}
                    <em>({cloudSavedDate.fromNow()})</em>
                  </div>
                ) : (
                  <div className="pt-ui-text">No save found</div>
                )}
              </div>
              <div
                className="editorRight"
                style={this.editorStyle}
                ref={r => {
                  this.$editorRight = r
                }}
              />
              <Button
                intent={Intent.PRIMARY}
                onClick={this.props.handleClose}
                style={this.buttonStyle}
              >
                Use Cloud Save
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    )
  }
}

export default EditorDiffOverlay
