import Visualizer from './classes/visualizer'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import { getRandomElement } from './util/array'
import { sin, circle, star, drawShape, fractal } from './util/canvas'

export default class Example extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 10 })
    this.theme = ['#00ffd0', '#7718FF', '#06C5FE', '#ff00c3', '#00ffd0']
    this.counter = 1
    this.rotation = 0
  }

  hooks () {
    this.sync.on('bar', beat => {
      this.lastColor = this.nextColor || getRandomElement(this.theme)
      this.nextColor = getRandomElement(this.theme.filter(color => color !== this.nextColor))
      this.counter = this.counter + 1
      if (this.counter%15==0) {
        this.counter=1
        this.rotation=0
      }
    })
    this.sync.on('tatum', tatum => {
      this.rotation++
    })
  }

  paint ({ ctx, height, width, now }) {
    const bar = interpolateBasis([0, this.sync.volume * 10, 0])(this.sync.bar.progress)
    const beat = interpolateBasis([0, this.sync.volume * 300, 0])(this.sync.beat.progress)
    const tatum = interpolateBasis([0, this.sync.volume * 200, 0])(this.sync.tatum.progress)
    ctx.fillStyle = 'rgba(0, 0, 0, .05)' //Fill the background black at alpha 0.05 for line fade effect
    ctx.fillRect(0, 0, width, height) //Fill the whole screen
    
    if (this.counter<5) {
      ctx.lineWidth = bar+2 // Use bar to control linewidth
      ctx.strokeStyle = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress) // transition between colors smoothly
      sin(ctx, now / 50, (height / 2) + this.counter, this.sync.volume * 100, 100) // Define sine curve to draw
      ctx.stroke() // Draw the sine curve
      ctx.fillStyle = 'rgba(0, 0, 0, 1)' // Fill style for circle drawing
      ctx.beginPath()
      ctx.lineWidth = beat
      ctx.stroke()
      ctx.fill()
    } else if (this.counter<10) {
      ctx.lineWidth = 4
      ctx.strokeStyle = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress) // transition between colors smoothly
      star(ctx, this.counter, this.sync.volume * 50, this.sync.volume * 200, width / 2, height / 2, this.rotation, false) // Define star curve to draw
      ctx.stroke() // Draw the star
      ctx.fillStyle = 'rgba(0, 0, 0, 1)' // Fill style for circle drawing
      ctx.beginPath()
      ctx.lineWidth = 2*beat
      //circle(ctx, (width / 2) + 50*Math.sin(tatum), (height / 2) + 50*Math.sin(tatum), this.sync.volume * height / 5 + beat / 10)
      ctx.stroke()
      ctx.fill()
    } else {
      ctx.lineWidth = 4
      ctx.strokeStyle = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress) // transition between colors smoothly
      //console.log(this.sync.bar.progress)
      fractal(ctx, 256, width/2, 5*height/6, 40+(this.rotation))
      ctx.stroke()
      ctx.fillStyle = 'rgba(0, 0, 0, 1)' // Fill style for circle drawing
      ctx.beginPath()
      ctx.lineWidth = beat
      ctx.stroke()
      ctx.fill()
    }
  }
}