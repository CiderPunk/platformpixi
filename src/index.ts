require('./styles/styles.scss')
import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ width:800, height:800, backgroundColor: PIXI.utils.rgb2hex([100, 100, 100])})

document.body.appendChild(app.view)