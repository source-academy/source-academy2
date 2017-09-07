import * as React from 'react'
import { Button } from '@blueprintjs/core'

class ListVisualizer extends React.Component<{}, {}> {
  $parent: HTMLElement | null

  handleClear() {
    window.ListVisualizer.clear()
  }

  handleNext() {
    window.ListVisualizer.next()
  }

  handlePrevious() {
    window.ListVisualizer.previous()
  }

  componentDidMount() {
    if (this.$parent) {
      window.ListVisualizer.init(this.$parent)
    }
  }

  render() {
    return (
      <div ref={r => this.$parent = r} className="sa-list-visualizer pt-dark">
        <div className="row">
          <div className="pt-button-group col-xs-12">
            <Button id="next" onClick={this.handleNext}>Next</Button>
            <Button id="previous" onClick={this.handlePrevious}>Previous</Button>
            <Button id="clear" onClick={this.handleClear}>Clear</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ListVisualizer
