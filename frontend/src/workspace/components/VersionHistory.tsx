import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { Shape, VersionHistory } from '../shape'
import {
  Button,
  Intent,
  Popover,
  PopoverInteractionKind
} from '@blueprintjs/core'
import Moment from 'moment-timezone'

export type OwnProps = {
  changeNewEditorValue: (content: string) => any
}

export type Props = OwnProps & {
  versionHistories: VersionHistory[]
  setEditorValue: (content: string) => any
}

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  versionHistories: state.codeHistory
})

const mapDispatchToProps = (dispatch: Dispatch<Shape>) =>
  bindActionCreators(
    {
      setEditorValue: actions.setEditorValue
    },
    dispatch
  )

const containerStyle: React.CSSProperties = {
  marginLeft: '20px',
  marginRight: '20px'
}

const VersionHistoryComponent: React.StatelessComponent<Props> = ({
  versionHistories,
  setEditorValue,
  changeNewEditorValue
}) => {
  return (
    <div className="pt-dark" style={containerStyle}>
      {versionHistories.map((versionHistory, idx) => (
        <VersionHistoryCard
          changeNewEditorValue={changeNewEditorValue}
          history={versionHistory}
          key={idx}
          setEditorValue={setEditorValue}
        />
      ))}
    </div>
  )
}

type VersionHistoryProps = {
  history: VersionHistory
  setEditorValue: (content: string) => any
  changeNewEditorValue: (content: string) => any
}

class VersionHistoryCard extends React.Component<
  VersionHistoryProps,
  { isOpen: boolean }
> {
  constructor(props: VersionHistoryProps) {
    super(props)
    this.state = { isOpen: false }
  }

  handleClick = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))
  }

  useHistory = () => {
    this.props.changeNewEditorValue(this.props.history.content)
    this.props.setEditorValue(this.props.history.content)
  }

  render() {
    return (
      <Popover
        useSmartPositioning={true}
        interactionKind={PopoverInteractionKind.HOVER}
        popoverClassName="pt-popover-content-sizing"
      >
        <div className="pt-card pt-elevation-2" onClick={this.useHistory}>
          <p className="pt-ui-text">
            {Moment(this.props.history.generatedAt).format(
              'MMMM Do YYYY hh:mm:ss a'
            )}
          </p>
        </div>
        <div>
          <pre>{this.props.history.content}</pre>
        </div>
      </Popover>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  VersionHistoryComponent
)
