import Visualizer from './classes/visualizer'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import { getRandomElement } from './util/array'
import { sin, circle, star, drawShape, fractal } from './util/canvas'

export default class Example extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 10 })
    this.theme = ['#00ffd0', '#7718FF', '#06C5FE', '#ff00c3', '#00ffd0']
    this.counter = 1
    this.rotation = 20
    this.height = 256
    this.section = 1
    this.dir = 1
  }

  hooks () {
    this.sync.on('tatum', tatum => {
      if (this.rotation>360) {
        this.rotation=20;
      }
      if (this.rotation > 165 && this.rotation < 195) {
        this.rotation = 195
      }
      this.rotation+= 3
    })
    this.sync.on('beat', beat => {
      if (this.rotation>360) {
        this.rotation=20;
      }
      if (this.rotation > 165 && this.rotation < 195) {
        this.rotation = 195
      }
      this.rotation+= 3
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
      if (this.height<height/5){
        this.dir *= -1
      }
      if (this.height>height) {
        this.dir *= -1
      }
      this.height+= this.dir*3
      console.log(this.dir)
    })
    this.sync.on('section', section => {
      if (this.height<height/5){
        this.dir *= -1
      }
      if (this.height>height) {
        this.dir *= -1
      }
      this.height+= this.dir*3
    })
  }

  paint ({ ctx, height, width, now }) {
    const bar = interpolateBasis([0, this.sync.volume * 10, 0])(this.sync.bar.progress)
    const beat = interpolateBasis([0, this.sync.volume * 300, 0])(this.sync.beat.progress)
    const tatum = interpolateBasis([0, this.sync.volume * 200, 0])(this.sync.tatum.progress)
    
    var vol_input = this.sync.volume*this.height;
    if (vol_input < height/5) {
      vol_input = height/5
    }
    
    ctx.fillStyle = 'rgba(0, 0, 0, .05)' //Fill the background black at alpha 0.05 for fade effect
    ctx.fillRect(0, 0, width, height) //Fill the whole screen
    ctx.lineWidth = 4 // Define line width
    ctx.strokeStyle = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress) // transition between colors smoothly
    fractal(ctx, vol_input+1, width/2, height, this.rotation)
    // if (this.counter<10){
    //   fractal(ctx, vol_input+1, width/2, height, this.rotation)
    // }else {
    //   ctx.rotate(Math.PI)
    //   fractal(ctx, vol_input+1, width/2, height, this.rotation)
    // } 
    //fractal(ctx, this.height, width/2, height,this.rotation)
    ctx.stroke()
  }
}