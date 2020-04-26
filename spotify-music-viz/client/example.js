import Visualizer from './classes/visualizer'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import { getRandomElement } from './util/array'
import { sin, circle, star, drawShape, fractal } from './util/canvas'
import { convertToRGBA } from './util/rgb_to_rgba'

export default class Example extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 10 })
    this.theme = ['#00ffd0', '#7718FF', '#06C5FE', '#ff00c3', '#00ffd0','#ffa0b3']
    this.counter = 1
    this.rotation = 20
    this.height = 256
    this.section = 1
    this.dir = 1
    this.xtrans = -300
  }

  hooks () {
    this.sync.on('tatum', tatum => {
      if (this.rotation>330) {
        this.rotation=40;
      }
      if (this.rotation > 150 && this.rotation < 210) {
        this.rotation = 210
      }
      if (this.xtrans>300) {
        this.xtrans = -300
      }
      this.rotation+= 3
      this.xtrans+= 5
    })
    this.sync.on('beat', beat => {
      if (this.rotation>330) {
        this.rotation=40;
      }
      if (this.rotation > 150 && this.rotation < 210) {
        this.rotation = 210
      }
      if (this.xtrans>300) {
        this.xtrans = -300
      }
      this.rotation+= 3
      this.xtrans+= 5
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
      if (this.height<256){
        this.dir *= -1
      }
      if (this.height>1024) {
        this.dir *= -1
      }
      this.height+= this.dir*2
    })
    this.sync.on('section', section => {
      if (this.height<256){
        this.dir *= -1
      }
      if (this.height>1024) {
        this.dir *= -1
      }
      this.height+= this.dir*2
    })
  }

  paint ({ ctx, height, width, now }) {
    const bar = interpolateBasis([0, this.sync.volume * 10, 0])(this.sync.bar.progress)
    const beat = interpolateBasis([0, this.sync.volume * 300, 0])(this.sync.beat.progress)
    const tatum = interpolateBasis([0, this.sync.volume * 200, 0])(this.sync.tatum.progress)
    
    var vol_input = this.sync.volume*this.height
    console.log(this.sync.volume)
    if (vol_input < height/5) {
      vol_input = height/5
    }
    if (vol_input > height) {
      vol_input = height
    }
    console.log(vol_input)
    
    var fillStyleInput = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress)
    fillStyleInput = convertToRGBA(fillStyleInput)
    //console.log(fillStyleInput)
    //console.log(typeof fillStyleInput)


    ctx.fillStyle = fillStyleInput //Fill the background black at alpha 0.05 for fade effect
    ctx.fillRect(0, 0, width, height) //Fill the whole screen
    ctx.lineWidth = 8 // Define line width
    //ctx.strokeStyle = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress) // transition between colors smoothly
    //console.log(ctx.strokeStyle)
    ctx.strokeStyle = '#ffffff'
    fractal(ctx, this.height, width/2, height, this.rotation)
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