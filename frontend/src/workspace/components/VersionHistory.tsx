import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { Shape, VersionHistory } from '../shape'
import { Button, Intent, Collapse } from '@blueprintjs/core'
import Moment from 'moment-timezone'

export type OwnProps = {}

export type Props = OwnProps & {
  versionHistories: VersionHistory[]
  setEditor: (content: string) => any
}

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  versionHistories: state.codeHistory
})

const mapDispatchToProps = (dispatch: Dispatch<Shape>) =>
  bindActionCreators(
    {
      setEditor: actions.setEditorValue
    },
    dispatch
  )

const containerStyle: React.CSSProperties = {
  marginLeft: '20px',
  marginRight: '20px'
}

const VersionHistoryComponent: React.StatelessComponent<Props> = ({
  versionHistories,
  setEditor
}) => {
  return (
    <div className="pt-dark" style={containerStyle}>
      {versionHistories.map((versionHistory, idx) => (
        <VersionHistoryCard
          history={versionHistory}
          key={idx}
          setEditorValue={setEditor}
        />
      ))}
    </div>
  )
}

type VersionHistoryProps = {
  history: VersionHistory
  setEditorValue: (content: string) => any
}

class VersionHistoryCard extends React.Component<
  VersionHistoryProps,
  { isOpen: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
  }

  handleClick = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))
  }

  render() {
    console.log(this.props.history)
    return (
      <div className="pt-card pt-elevation-2" onClick={this.handleClick}>
        <p className="pt-ui-text">
          {Moment(this.props.history.generatedAt).format(
            'MMMM Do YYYY hh:mm:ss a'
          )}
        </p>
        <Collapse isOpen={this.state.isOpen}>
          <p>{this.props.history.content}</p>
          <Button
            intent={Intent.PRIMARY}
            onClick={() =>
              this.props.setEditorValue(this.props.history.content)}
          >
            Use
          </Button>
        </Collapse>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  VersionHistoryComponent
)
