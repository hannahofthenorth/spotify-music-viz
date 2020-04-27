import { auth } from './classes/sync'
import Template from './template'
import Example from './example'
import FractalTree from './fractalTree'
import Square from './squares'

if (window.location.hash === '#start') {
  //const template = new Template()
  //const example = new Example()
  //const tree = new FractalTree()
  const square = new Square()
} else {
  auth()
}