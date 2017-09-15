import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import renderMarkdownWithoutLatex from '../../common/renderMarkdown'

import PlaygroundControl from './PlaygroundControl'
import * as actions from '../actions'
import { Shape, MCQQuestion } from '../shape'

export type OwnProps = {}

export type Props = OwnProps & {
  mcqQuestion: MCQQuestion
  selectChoice: (id: number) => void
}

const mapStateToProps = (state: Shape, ownProps: OwnProps) => ({
  mcqQuestion: state.mcqQuestion
})

const mapDispatchToProps = (dispatch: Dispatch<Shape>) =>
  bindActionCreators({ selectChoice: actions.selectChoice }, dispatch)

class MCQWorkspace extends React.Component<Props, {}> {
  $content: HTMLDivElement | null

  async componentDidMount() {
    const content = this.props.mcqQuestion.content
    const html = await renderMarkdownWithoutLatex(content)
    this.$content!.innerHTML = html
  }

  get choices() {
    const { selectChoice, mcqQuestion } = this.props
    const choices = mcqQuestion.choices

    return (
      <ul className="choices">
        {choices.map((c, idx) => {
          const handleClick = () => selectChoice(c.id)
          let className
          if (c.selected && mcqQuestion.done) {
            className = 'choice choice-correct'
          } else if (c.selected) {
            className = 'choice choice-incorrect'
          } else {
            className = 'choice'
          }
          return (
            <li key={idx} className={className} onClick={handleClick}>
              {c.content}
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    const controlType = 'submission'
    const hint = this.props.mcqQuestion.hint
    const hintClassName = this.props.mcqQuestion.done
      ? 'pt-callout pt-intent-success'
      : 'pt-callout pt-intent-danger'

    return (
      <div className="sa-workspace">
        <PlaygroundControl type={controlType} />
        <div className="sa-mcq container pt-dark">
          <div className="body row">
            <div className="col-xs-12">
              <div ref={r => this.$content = r} className="content" />
              {hint && (
                <div className={hintClassName}>
                  {hint}
                </div>
              )}
              {this.choices}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MCQWorkspace)
