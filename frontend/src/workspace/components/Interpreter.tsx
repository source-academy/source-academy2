import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { bindActionCreators, Dispatch } from 'redux'
import { Button, Intent } from '@blueprintjs/core'
import { connect } from 'react-redux'

import { toString } from '../../toolchain/interop'
import CanvasOutput from './CanvasOutput'

import * as actions from '../actions'
import { Shape, InterpreterOutput, ErrorOutput } from '../shape'
import createEditor from '../../common/createEditor'

export type OwnProps = {}

export type Props = OwnProps & {
  outputs: InterpreterOutput[]
  evalInInterpreter: (code: string) => any
  clearInterpreter: () => any
}

const mapStateToProps = (state: Shape) => ({
  outputs: state.interpreter.outputs
})

const mapDispatchToProps = (dispatch: Dispatch<Shape>) =>
  bindActionCreators(
    {
      evalInInterpreter: actions.evalInterpreter,
      clearInterpreter: actions.clearInterpreter
    },
    dispatch
  )

export type InterpreterOutputProps = {
  output: InterpreterOutput
}

class InterpreterOutputView extends React.Component<
  InterpreterOutputProps,
  {}
> {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const { output } = this.props

    const getErrors = (output: ErrorOutput) => {
      const errorLines = output.errors.map(e => {
        const line = e.location ? e.location.start.line : '<unknown>'
        const explanation = e.explain()
        return `Line ${line}:\n${explanation}`
      })
      return (
        <div className="errors">
          {errorLines.map((e, idx) => {
            return (
              <span key={idx} className="error">
                {e}
              </span>
            )
          })}
        </div>
      )
    }
    const renderCode = (value: any) => {
      return (
        <pre className="code">
          <code>{value}</code>
        </pre>
      )
    }
    const renderValue = (value: any) => {
      const aw = window as any
      if (
        typeof aw.ShapeDrawn !== 'undefined' &&
        value instanceof aw.ShapeDrawn
      ) {
        return <CanvasOutput />
      } else {
        return (
          <pre className="value">
            <code>{toString(value)}</code>
          </pre>
        )
      }
    }
    const renderLog = (value: string) => (
      <pre className="log">
        <code>{value}</code>
      </pre>
    )
    let content
    if (output.type === 'code') {
      content = renderCode(output.value)
    } else if (output.type === 'result') {
      content = renderValue(output.value)
    } else if (output.type === 'log') {
      content = renderLog(output.value)
    } else {
      content = getErrors(output)
    }
    return (
      <div className={`output output-${output.type}`}>
        {output.type === 'code' ? (
          <span className="indicator pt-icon-standard pt-icon-code" />
        ) : (
          <span className="indicator pt-icon-standard pt-icon-chevron-left" />
        )}
        {content}
      </div>
    )
  }
}

class Interpreter extends React.Component<Props, {}> {
  $editor: HTMLDivElement | null
  editor: AceAjax.Editor

  constructor(props: Props, context: any) {
    super(props, context)
    this.handleEval = this.handleEval.bind(this)
  }

  async componentDidMount() {
    const $editor = findDOMNode(this.$editor!) as HTMLElement
    const editor = (await createEditor($editor)) as AceAjax.Editor
    editor.renderer.setShowGutter(false)
    this.setupKeybindings(editor)
    this.editor = editor
  }

  setupKeybindings(editor: AceAjax.Editor) {
    editor.commands.addCommand({
      name: 'evaluate',
      bindKey: {
        win: 'Shift-Enter',
        mac: 'Shift-Enter'
      },
      exec: (editor: AceAjax.Editor) => {
        this.handleEval()
      }
    })
  }

  handleEval() {
    const code = this.editor.getValue().trim()
    this.props.evalInInterpreter(code)
    this.editor.setValue('')
  }

  render() {
    const evalButton = (
      <Button intent={Intent.SUCCESS} onClick={this.handleEval}>
        Eval
      </Button>
    )
    const clearButton = (
      <Button intent={Intent.DANGER} onClick={this.props.clearInterpreter}>
        Clear
      </Button>
    )

    const outputs = this.props.outputs.map((output, idx) => (
      <InterpreterOutputView key={idx} output={output} />
    ))

    return (
      <div className="interpreter">
        <div className="controls pt-dark">
          <div className="pt-button-group pt-minimal">
            {evalButton}
            {clearButton}
          </div>
        </div>
        {outputs}
        <div className="input">
          <span className="indicator pt-icon-standard pt-icon-chevron-right" />
          <div className="editor" ref={r => (this.$editor = r)} />
          <div className="hint">
            Press <b>Shift-Enter</b> to Evaluate
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Interpreter)
