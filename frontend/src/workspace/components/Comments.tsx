import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'
import { Shape, Comment } from '../shape'
import { Button, Intent } from '@blueprintjs/core'

export type OwnProps = {}

export type Props = OwnProps & {
  comments: Comment[]
  newCommentValue: string
  setNewCommentValue: (content: string) => any
  createComment: () => any
}

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  comments: state.comments.comments,
  newCommentValue: state.comments.newComment
})

const mapDispatchToProps = (dispatch: Dispatch<Shape>) =>
  bindActionCreators({
    setNewCommentValue: actions.setNewCommentValue,
    createComment: actions.createComment
  }, dispatch)

const Comments: React.StatelessComponent<Props> = ({
  comments,
  newCommentValue,
  setNewCommentValue,
  createComment
}) => {
  const handleChange = (evt: any) => {
    setNewCommentValue(evt.target.value)
  }
  return (
  <div className="sa-comments pt-dark">
    <ul>
      {
        comments.map((comment, idx) => (
          <li key={idx}>
            <div className="pt-card">
              <span className="date">
                {comment.createdAt}
              </span>
              <span className="poster">
                {comment.posterName}
              </span>
              <span className="content">
                {comment.content}
              </span>
            </div>
          </li>
        ))
      }
      <li className="new-comment">
          <textarea className="pt-input pt-fill"
              rows={4}
              value={newCommentValue} onChange={handleChange} />
          <Button intent={Intent.SUCCESS} onClick={createComment}>
            Add Comment
          </Button>
      </li>
    </ul>
  </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)
