import Visualizer from './classes/visualizer'
import { interpolateRgb, interpolateBasis, interpolateHcl } from 'd3-interpolate'
import { getRandomElement } from './util/array'
import { sin, circle, star, drawShape, fractal, square, shape } from './util/canvas_sandbox'
import { convertToRGBA } from './util/rgb_to_rgba'

export default class Square extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 10 })
    this.theme = ['#00ffd0', '#7718FF', '#06C5FE', '#ff00c3', '#00ffd0','#ffa0b3']
    this.counter = 1
    this.rotation = 20
    this.height = 256
    this.section = 1
    this.dir = 1
    this.sides = 3
  }

  hooks () {
    this.sync.on('tatum', tatum => {
      if (this.rotation>360) {
        this.rotation=0;
      }
      this.rotation+= 2
    })
    this.sync.on('beat', beat => {
      if (this.rotation>360) {
        this.rotation=0;
      }
      this.rotation+= 2
    })
    this.sync.on('bar', bar => {
      this.lastColor = this.nextColor || getRandomElement(this.theme)
      this.nextColor = getRandomElement(this.theme.filter(color => color !== this.nextColor))
      this.counter++
      if (this.counter%20==0) {
        this.counter=1
      }
    })
    this.sync.on('segment', segment => {
      if (this.sides>7) {
        this.sides = 2
      }
      this.sides++
    })
    this.sync.on('section', section => {
      if (this.sides>7) {
        this.sides = 2
      }
      this.sides++
    })
  }

  paint ({ ctx, height, width, now }) {
    const bar = interpolateBasis([0, this.sync.volume * 10, 0])(this.sync.bar.progress)
    const beat = interpolateBasis([0, this.sync.volume * 300, 0])(this.sync.beat.progress)
    const tatum = interpolateBasis([0, this.sync.volume * 200, 0])(this.sync.tatum.progress)
    
    var vol_input = this.sync.volume*height
    if (vol_input > height) {
      vol_input = height
    }

    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)'
    ctx.fillRect(0, 0, width, height) //Fill the whole screen
    ctx.strokeStyle = interpolateHcl(this.lastColor, this.nextColor)(this.sync.bar.progress) // transition between colors smoothly
    shape(ctx, this.sides, width/2 + beat-tatum+bar, vol_input, 50*bar+tatum, this.rotation)
    ctx.stroke()
  }
}