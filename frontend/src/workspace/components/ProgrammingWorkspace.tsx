import * as React from 'react'
import { connect } from 'react-redux'

import { Shape, LayoutTypes } from '../shape'
import Editor from './Editor'
import SideContent from './SideContent'
import Interpreter from './Interpreter'
import Question from './Question'
import Comments from './Comments'
import PlaygroundControl from './PlaygroundControl'
import ListVisualizer from './ListVisualizer'
import ToneMatrix from './ToneMatrix'
import VersionHistory from './VersionHistory'

export type OwnProps = {}
export type Props = OwnProps & {
  isPlayground: boolean
  activeLayout: LayoutTypes
  content: string
  marks: number
}

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  isPlayground: state.config.isPlayground,
  activeLayout: state.config.activeLayout,
  content: state.programmingQuestion.content
})

const getBody = (
  { activeLayout }: Props,
  editor: React.ReactNode,
  sideContent: React.ReactNode
) => {
  switch (activeLayout) {
    case LayoutTypes.SPLIT:
      return (
        <div className="body row">
          <div className="col-xs-6">{editor}</div>
          <div className="col-xs">{sideContent}</div>
        </div>
      )
    case LayoutTypes.EDITOR_ONLY:
      return (
        <div className="body row">
          <div className="col-xs-12">{editor}</div>
        </div>
      )
    default:
      return (
        <div className="body row">
          <div className="col-xs-12">{sideContent}</div>
        </div>
      )
  }
}

class ProgrammingWorkspace extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      newEditorValue: ''
    }
  }

  changeNewEditorValue = (str: string) => {
    this.setState(prevState => ({
      newEditorValue: str
    }))
  }

  render() {
    const interpreter = <Interpreter />
    const question = <Question content={this.props.content} />
    const comments = <Comments />
    const editor = <Editor newEditorValue={this.state.newEditorValue} />
    const versionHistory = (
      <VersionHistory changeNewEditorValue={this.changeNewEditorValue} />
    )
    const listVisualizer = window.ListVisualizer ? <ListVisualizer /> : <div />
    const toneMatrix = window.ToneMatrix ? <ToneMatrix /> : <div />
    const side = (
      <SideContent
        interpreter={interpreter}
        question={question}
        comments={comments}
        versionHistory={versionHistory}
        listVisualizer={listVisualizer}
        toneMatrix={toneMatrix}
      />
    )
    const body = getBody(this.props, editor, side)
    return (
      <div className="sa-workspace">
        <PlaygroundControl />
        {body}
      </div>
    )
  }
}

export default connect(mapStateToProps)(ProgrammingWorkspace)
