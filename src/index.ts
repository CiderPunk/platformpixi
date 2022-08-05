require('./styles/styles.scss')
import * as PIXI from 'pixi.js'
import { TiledMap } from './loader/tiledmap';
import { ITiledMapData } from './models/tiledmodels';

const app = new PIXI.Application({ width:800, height:600, backgroundColor: PIXI.utils.rgb2hex([100, 100, 100])})

document.body.appendChild(app.view)

const loader = new PIXI.Loader("/dist/");
loader.add("mapjson", "maps/level1.json")
loader.load((loader,res)=>{
  
  const map = new TiledMap(res.mapjson.data as ITiledMapData )
})

