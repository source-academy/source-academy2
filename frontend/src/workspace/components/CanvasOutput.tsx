import * as React from 'react'

class CanvasOutput extends React.Component<{}, {}> {
  $canvas: HTMLCanvasElement | null
  $parent: HTMLElement | null

  componentDidMount() {
    const source = document.querySelector('.rune-canvas') as HTMLCanvasElement
    const context = (window as any).RUNE_CONTEXT || '2d'
    if (context === '2d') {
      const ctx = this.$canvas!.getContext(context)
      ctx!.drawImage(source, 0, 0)
    } else {
      this.$canvas!.hidden = true
      this.$parent!.appendChild(source)
      source.hidden = false
    }
  }

  render() {
    return (
      <div ref={r => (this.$parent = r)}
           className="canvas-container">
        <canvas width={512} height={512} ref={r => (this.$canvas = r)} />
      </div>
    )
  }
}

export default CanvasOutput
