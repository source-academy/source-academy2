import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { Shape, VersionHistory } from '../shape'
import {
  Popover,
  PopoverInteractionKind,
  Position,
  Button,
  Intent
} from '@blueprintjs/core'
import Moment from 'moment-timezone'
import ReadOnlyEditor from './ReadOnlyEditor'

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
  marginRight: '20px',
  maxHeight: '75vh',
  overflowY: 'scroll'
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

class VersionHistoryCard extends React.Component<VersionHistoryProps> {
  useHistory = () => {
    this.props.changeNewEditorValue(this.props.history.content)
    this.props.setEditorValue(this.props.history.content)
  }

  render() {
    const saveDate = Moment(this.props.history.generatedAt)
    return (
      <Popover
        position={Position.LEFT_BOTTOM}
        interactionKind={PopoverInteractionKind.HOVER}
        popoverClassName="pt-popover-content-sizing"
        className="sa-popover-fill"
      >
        <div
          className="pt-card pt-elevation-2"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <p className="pt-text-muted" style={{ marginBottom: 0 }}>
              Saved at
            </p>
            <p className="pt-ui-text">
              {saveDate.format('MMMM Do YYYY hh:mm:ss a')} ({saveDate.fromNow()})
            </p>
          </div>
          <Button intent={Intent.PRIMARY} onClick={this.useHistory}>
            Use
          </Button>
        </div>
        <ReadOnlyEditor
          content={this.props.history.content}
          width="300px"
          height="200px"
          fontSize="12px"
        />
      </Popover>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  VersionHistoryComponent
)
