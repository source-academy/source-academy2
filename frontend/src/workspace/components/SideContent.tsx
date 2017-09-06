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
}

export type Props = OwnProps & {
  activeTab: string,
  assessmentType: string,
  isPlayground: boolean
  setActiveTab: (activeTab: string) => any
}

const TAB_ICONS: {[tab:string]: string} = {
  interpreter: IconClasses.APPLICATION,
  question: IconClasses.HELP,
  comments: IconClasses.COMMENT,
  tests: IconClasses.COMPARISON,
  grading: IconClasses.SAVED
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

const getTabs = ({ isPlayground, assessmentType, activeTab, setActiveTab }: Props) => {
  let baseTabs: string[] = []
  if (isPlayground) {
    baseTabs = ['interpreter']
  } else {
    baseTabs = ['question', 'interpreter', 'comments']
  }
  let extraTabs: string[] = []
  if (assessmentType === 'path') {
    extraTabs = ['tests']
  }
  const tabs = baseTabs.concat(extraTabs)
  return tabs.map(key =>
    <Button
      key={key}
      iconName={TAB_ICONS[key]}
      className={`pt-minimal ${activeTab === key ? 'pt-active' : ''}`}
      onClick={() => setActiveTab(key)}
    />
  )
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
          <div className="tabs pt-button-group pt-large">
            {tabs}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12">
          {body}
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SideContent)
