import { auth } from './classes/sync'
import Template from './template'
import Example from './example'
import FractalTree from './fractalTree'

if (window.location.hash === '#start') {
  //const template = new Template()
  const example = new Example()
  //const tree = new FractalTree()
} else {
  auth()
}