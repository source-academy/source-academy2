import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  Button,
  Popover,
  Menu,
  Position,
  MenuItem,
  Intent
} from '@blueprintjs/core'

import * as actions from '../actions'
import { Shape } from '../shape'

export type OwnProps = {}

export type Props = {
  isPlayground: boolean
  library: string
  filename: string
  activeLayout: 'split' | 'editor-only' | 'side-only'
  isReadOnly: boolean
  isDirty: boolean
  libraries: string[]
  nextAction?: string
  previousAction?: string
  questionType?: string
  setLayoutType: (type: 'split' | 'editor-only' | 'side-only') => any
  setReadOnly: (to: boolean) => any
  setFilename: (to: string) => any
  setLibrary: (to: string) => any
  evalEditor: () => any
  saveEditor: () => any
}

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  isPlayground: state.config.isPlayground,
  filename: state.config.filename,
  activeLayout: state.config.activeLayout,
  nextAction: state.config.nextAction,
  previousAction: state.config.previousAction,
  questionType: state.config.questionType,
  isReadOnly: state.config.isReadOnly,
  libraries: state.config.libraries.map(n => n.title),
  library: state.config.library.title,
  isDirty: state.editor.isDirty
})

const mapDispatchToProps = (dispatch: Dispatch<Shape>) =>
  bindActionCreators(
    {
      setLayoutType: actions.setLayoutType,
      setReadOnly: actions.setReadOnly,
      setLibrary: actions.setLibrary,
      setFilename: actions.setFilename,
      evalEditor: actions.evalEditor,
      saveEditor: actions.saveEditor
    },
    dispatch
  )

const getSaveButton = (props: Props) => {
  const { isReadOnly, questionType, isPlayground, isDirty, saveEditor } = props
  const isProgramming = questionType === 'programming_question'
  const isShown = !isReadOnly && isProgramming && !isPlayground
  if (isShown) {
    const intent = isDirty ? Intent.WARNING : Intent.NONE
    return (
      <Button intent={intent} onClick={saveEditor}
        iconName="floppy-disk">
        Save
      </Button>
    )
  } else {
    return null
  }
}

const PlaygroundControl: React.StatelessComponent<Props> = (props) => {
  const {
    isPlayground,
    setLayoutType,
    setLibrary,
    filename,
    isReadOnly,
    setFilename,
    evalEditor,
    libraries,
    library,
    nextAction,
    previousAction,
    questionType
    } = props
  let filenameInput
  const isProgramming = questionType === 'programming_question'

  const handleChangeFilename = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setFilename(value)
  }

  if (isReadOnly || !isPlayground) {
    filenameInput = filename
  } else {
    filenameInput = (
      <input
        value={filename}
        className="pt-input"
        placeholder="Filename..."
        onChange={handleChangeFilename}
        type="text"
      />
    )
  }

  const genericButton = (
    label: string,
    icon: string,
    handleClick = () => { },
    intent = Intent.NONE,
    notMinimal = false
  ) =>
    <Button
      onClick={handleClick}
      className={notMinimal ? "" : "pt-minimal"}
      intent={intent}
      iconName={icon}
    >
      {label}
    </Button>
  const runButton = (isPlayground || isProgramming)
    && genericButton('Run', 'play', evalEditor)
  const saveButton = getSaveButton(props)
  let nextButton = null
  let previousButton = null

  if (!isPlayground) {
    if (nextAction && /submit/.test(nextAction)) {
      if (isReadOnly) {
        nextButton = (
          <a className='pt-button pt-icon-tick pt-disabled'
             href={nextAction}>
            <span>Submitted</span>
          </a>
        )
      } else {
        nextButton = (
          <a className='pt-button pt-intent-success pt-icon-send-to' href={nextAction}>
            <span>Submit</span>
          </a>
        )
      }
    } else {
      nextButton = (
        <a className='pt-button pt-minimal pt-intent-success pt-icon-chevron-right' href={nextAction}>
          <span>Next</span>
        </a>
      )
    }
    previousButton = (
      <a className='pt-button pt-minimal pt-intent-success pt-icon-chevron-left' href={previousAction}>
        <span>Previous</span>
      </a>
    )
  }

  const handleSelectChange = (ev: React.ChangeEvent<any>) => {
    setLibrary(ev.target.value)
  }

  const weekInput = isPlayground && (
    <div className="pt-select">
      <select defaultValue={library} onChange={handleSelectChange}>
        {libraries.map(name =>
          <option key={name} value={name}>
            {name}
          </option>
        )}
      </select>
    </div>
  )

  const setLayoutOfType = (type: any) => () => setLayoutType(type)

  const layoutMenu = (
    <Menu>
      <MenuItem
        onClick={setLayoutOfType('split')}
        iconName="split-columns"
        text="Editor + Side"
      />
      <MenuItem
        onClick={setLayoutOfType('editor-only')}
        iconName="code"
        text="Editor Only"
      />
      <MenuItem
        onClick={setLayoutOfType('side-only')}
        iconName="column-layout"
        text="Side Content Only"
      />
    </Menu>
  )

  const layoutInput = (isPlayground || isProgramming) && (
    <Popover content={layoutMenu} position={Position.BOTTOM_RIGHT}>
      <Button iconName="page-layout" text="Layout" />
    </Popover>
  )

  return (
    <div className="sa-primary-tabs pt-navbar pt-dark row center-xs">
      <div className="tabs pt-navbar-group col-xs-6">
        {previousButton}
        {previousButton && <span className="pt-navbar-divider" />}
        {filenameInput}
      </div>
      <div className="tabs pt-navbar-group col-xs end-xs">
        {runButton}
        {saveButton}
        {saveButton && <span className="pt-navbar-divider" />}
        {weekInput}
        {weekInput && <span className="pt-navbar-divider" />}
        {layoutInput}
        {nextButton && <span className="pt-navbar-divider" />}
        {nextButton}
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaygroundControl)
