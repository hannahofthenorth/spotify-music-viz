import Visualizer from './classes/visualizer'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import { getRandomElement } from './util/array'
import { sin, circle, star, drawShape, fractal } from './util/canvas'
import { fractalTree } from './util/fractals'


export default class Example extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 10 })
    this.theme = ['#00ffd0', '#7718FF', '#06C5FE', '#ff00c3', '#00ffd0']
    this.counter = 1
    this.rotation = 90
    this.height = 300
    this.section = 0
    this.dir = 1
    this.rotationDir = 1
  }

  hooks () {
    // Tatum
    this.sync.on('tatum', tatum => {
      if (this.rotation>120) {
        this.rotationDir*=-1
      }
      if (this.rotation<70) {
        this.rotationDir*= -1
      }
      if (this.rotation != 90) {
        this.rotation+= this.rotationDir
      }
    })
    // Beat
    this.sync.on('beat', beat => {
      if (this.rotation>120) {
        this.rotationDir*= -1
      }
      if (this.rotation<70) {
        this.rotationDir*= -1
      }
      if (this.rotation != 90) {
        this.rotation+= this.rotationDir
      }
    })
    // Bar
    this.sync.on('bar', bar => {
      this.lastColor = this.nextColor || getRandomElement(this.theme)
      this.nextColor = getRandomElement(this.theme.filter(color => color !== this.nextColor))
      this.counter++
      if (this.counter%15==0) {
        this.counter=1
      }
    })
    // Segment
    this.sync.on('segment', segment => {
      if (this.height<300){
        this.dir *= -1
      }
      if (this.height>712) {
        this.dir *= -1
      }
      this.height+= this.dir*3
      console.log(this.dir)
    })
    this.sync.on('section', section => {
      if (this.height<300){
        this.dir *= -1
      }
      if (this.height>712) {
        this.dir *= -1
      }
      this.height+= this.dir*3
    })
  }

  paint ({ ctx, height, width, now }) {
    const bar = interpolateBasis([0, this.sync.volume * 10, 0])(this.sync.bar.progress)
    const beat = interpolateBasis([0, this.sync.volume * 300, 0])(this.sync.beat.progress)
    const tatum = interpolateBasis([0, this.sync.volume * 200, 0])(this.sync.tatum.progress)
    
    
    ctx.fillStyle = 'rgba(0, 0, 0, .05)' //Fill the background black at alpha 0.05 for fade effect
    ctx.fillRect(0, 0, width, height) //Fill the whole screen
    ctx.lineWidth = 4 // Define line width
    ctx.strokeStyle = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress) // transition between colors smoothly
    
    if (this.counter<20) {
      fractalTree(ctx, this.height * this.sync.volume/2, width/4, height,this.rotation)
    } else{
      fractalTree(ctx, this.height, width/4, height,this.rotation)
    }
    ctx.stroke()
    //console.log(this.sync.volume) 
    if (this.height<350) {
      // ctx.fillStyle = 'rgba(0,0,0,1)'
      // ctx.beginPath()
      // ctx.lineWidth = beat
      // circle(ctx, width/2, height/4, this.sync.volume * height/5 + beat/10)
      // ctx.stroke()
      // ctx.fill()
    }
  }
}