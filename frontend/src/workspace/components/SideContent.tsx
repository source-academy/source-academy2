import * as React from 'react'
import { Button, IconClasses } from '@blueprintjs/core'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Shape } from '../shape'
import * as actions from '../actions'

export type OwnProps = {
  interpreter: React.ReactElement<any> | JSX.Element
  question: React.ReactElement<any> | JSX.Element
  comments: React.ReactElement<any> | JSX.Element
  listVisualizer: React.ReactElement<any> | JSX.Element
  toneMatrix: React.ReactElement<any> | JSX.Element
  versionHistory: React.ReactElement<any> | JSX.Element
}

export type Props = OwnProps & {
  activeTab: string
  assessmentType: string
  isPlayground: boolean
  setActiveTab: (activeTab: string) => any
}

const TAB_ICONS: { [tab: string]: string } = {
  interpreter: IconClasses.APPLICATION,
  question: IconClasses.HELP,
  comments: IconClasses.COMMENT,
  versions: IconClasses.HISTORY,
  tests: IconClasses.COMPARISON,
  grading: IconClasses.SAVED,
  list_visualizer: IconClasses.EYE_OPEN,
  tone_matrix: IconClasses.GRID_VIEW
}

const mapDispatchToProps = (dispatch: Dispatch<Shape>) =>
  bindActionCreators(
    {
      setActiveTab: actions.setActiveTab
    },
    dispatch
  )

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  activeTab: state.config.activeTab,
  assessmentType: state.config.assessmentType,
  isPlayground: state.config.isPlayground
})

const getTabs = ({
  isPlayground,
  assessmentType,
  activeTab,
  setActiveTab
}: Props) => {
  let baseTabs: string[] = []
  if (isPlayground) {
    baseTabs = ['interpreter']
  } else {
    baseTabs = ['question', 'interpreter', 'comments', 'versions']
  }
  let extraTabs: string[] = []
  if (assessmentType === 'path') {
    extraTabs = ['tests']
  }
  if (window.ListVisualizer) {
    extraTabs.push('list_visualizer')
  }
  if (window.ToneMatrix) {
    extraTabs.push('tone_matrix')
  }
  const tabs = baseTabs.concat(extraTabs)
  return tabs.map(key => (
    <Button
      key={key}
      iconName={TAB_ICONS[key]}
      className={`pt-minimal ${activeTab === key ? 'pt-active' : ''}`}
      onClick={() => setActiveTab(key)}
    />
  ))
}

const getBody = (props: Props) => {
  let body
  switch (props.activeTab) {
    case 'interpreter':
      body = props.interpreter
      break
    case 'comments':
      body = props.comments
      break
    case 'list_visualizer':
      body = props.listVisualizer
      break
    case 'tone_matrix':
      body = props.toneMatrix
      break
    case 'versions':
      body = props.versionHistory
      break
    default:
      body = props.question
      break
  }
  return body
}

const SideContent: React.StatelessComponent<Props> = props => {
  const body = getBody(props)
  const tabs = getTabs(props)
  return (
    <div className="side">
      <div className="row">
        <div className="col-xs-12 pt-dark">
          <div className="tabs pt-button-group pt-large">{tabs}</div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">{body}</div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SideContent)
