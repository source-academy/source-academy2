import * as React from 'react'
import { Button } from '@blueprintjs/core'

class ToneMatrix extends React.Component<{}, {}> {
  $container: HTMLElement | null

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    if (window.ToneMatrix) {
      window.ToneMatrix.initialise_matrix(this.$container!)
    }
  }

  handleClear() {
    window.ToneMatrix.clear_matrix()
  }

  handleRandomise() {
    window.ToneMatrix.randomise_matrix()
  }

  render() {
    return (
      <div className="sa-tone-matrix">
        <div className="row">
          <div className="controls col-xs-12 pt-dark pt-button-group">
            <Button id="clear-matrix" onClick={this.handleClear}>
              Clear
            </Button>
            <Button id="randomise-matrix" onClick={this.handleRandomise}>
              Randomise
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12" ref={r => this.$container = r} />
        </div>
      </div>
    )
  }
}

export default ToneMatrix
