require('./styles/styles.scss')
import * as PIXI from 'pixi.js'
import { TiledMap } from './tiledmap';
import { ITiledMapData } from './models/tiledmodels';

const app = new PIXI.Application({ width:800, height:600, backgroundColor: PIXI.utils.rgb2hex([100, 100, 100])})

document.body.appendChild(app.view)

app.loader.baseUrl ="/dist/"
const loader = app.loader
loader.add("mapjson", "maps/level1.json")
loader.add("tiles","assets/tilemap_packed.png")

loader.load((loader,res)=>{
  const map = new TiledMap(res.mapjson.data as ITiledMapData )
  map.setTilesetImage("tilemap_packed", PIXI.Texture.from(res.tiles.data) )
  
  
  map.init()
  
  app.stage.addChild(map.getLayerTilemap("ground"))



})

