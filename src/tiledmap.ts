import * as PIXI from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
import { ILayerData, ITiledMapData, ITilesetData } from "./models/tiledmodels";


export class TiledMap{


  readonly tileSets:Array<TileSet> 
  readonly layers: Map<string, Layer>
  
  public constructor(data:ITiledMapData){
    this.tileSets = new Array<TileSet>()
    this.layers = new Map<string, Layer>()

    data.tilesets.forEach(ts=>{
      const tileset = new TileSet(this, ts)
      this.tileSets.push(tileset)
    })

    data.layers.forEach(layer=>{
      this.layers.set(layer.name, new Layer(this, layer))
    })
  }



  getTile(tileNo: number):PIXI.Texture {
    const tile = this.tileSets.find((ts)=>{ return (tileNo >= ts.startIx && tileNo <ts.endIx)})?.getTile(tileNo)
    if (tile== undefined){
      throw("Tile not found id: " + tileNo)
    }
    return tile

  }

  public init(){
    this.layers.forEach((layer)=>{
      layer.init(this)
    })
  }

  getLayerTilemap(name:string):CompositeTilemap{
    const layer = this.layers.get(name)?.tileMap
    if (layer== undefined){
      throw("layer not found: " + name)
    }
    return layer
  }

  public findTileset(name:string):number{
    return this.tileSets.findIndex(ts=>ts.name == name)
  }

  public setTilesetImage(ix:number|string, tx:PIXI.Texture ):void{
    if (typeof(ix) ==="number" ){
      this.tileSets[ix]?.setTexture(tx)  
    }
    else{
      this.tileSets[this.findTileset(ix)]?.setTexture(tx)  
    }
  }
}

class Layer{

  public readonly tileMap: CompositeTilemap;

  public constructor(readonly owner:TiledMap, readonly data:ILayerData){
    this.tileMap = new CompositeTilemap();
  }

  init(map: TiledMap) {
    this.tileMap.clear()
    const [width, height, data] = [this.data.width, this.data.height, this.data.data]

    for (let y = 0; y<height; y++){
      for (let x= 0; x< width; x++){
        const tileNo = data[(y * width) + x]
        if(tileNo>0){
          const tx = map.getTile(tileNo)
        }
      }
    }
  }
}

class TileSet{

  baseTx:PIXI.BaseTexture
  readonly tiles:Array<PIXI.Texture>
  public readonly startIx:number
  public readonly endIx:number
  public readonly name:string
  public readonly id:number

  public constructor(readonly owner:TiledMap, readonly data:ITilesetData){
    this.tiles = new Array<PIXI.Texture>(data.tilecount)
    this.name = data.name
    this.startIx = data.firstgid
    this.endIx = data.firstgid + data.tilecount

  }

  public getTile(id:number):PIXI.Texture{
    return this.tiles[id - this.startIx]
  }

  public setTexture(tx:PIXI.Texture):void{
    if (tx.width != this.data.imagewidth || tx.height!= this.data.imageheight){
      throw("Image doesn't match tileset dimensions")
    }

    const [tHeight,tWidth, spacing, margin] = [this.data.tileheight, this.data.tilewidth, this.data.spacing, this.data.margin]

    const tileWidthOffset = tWidth + spacing + (2* margin)
    const tileHeightOffset = tHeight + spacing + (2* margin)

    const cols = Math.floor(tx.width / tileWidthOffset)
    const rows = Math.floor(tx.height / tileHeightOffset)
    const tileRect = new PIXI.Rectangle(0,0,tWidth,tHeight)
    const origRect = new PIXI.Rectangle(0,0,tWidth, tHeight)

    for(let i = 0; i<rows;i++){
      origRect.y = (i* tileHeightOffset) + margin + spacing
      for (let j = 0; j<cols; j++){
        origRect.x = (j * tileWidthOffset) + margin + spacing
        this.tiles[i*cols + j] = (new PIXI.Texture(tx.baseTexture,tileRect, origRect))
      }
    }
  } 
}
