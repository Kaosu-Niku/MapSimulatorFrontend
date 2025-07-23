import {Object3D, BoxGeometry, BoxHelper, Mesh, Material, MeshBasicMaterial, TextureLoader, Vector2} from "three"
import * as THREE from "three"
import { getTexture, getTile } from "./TextureHelper";
import { isArray } from "element-plus/es/utils/types.mjs";
import AliasHelper from "./AliasHelper";
import GameManager from "./GameManager";
import Trap from "./Trap";
import { GC_Add } from "./GC";
import GameConfig from "../utilities/GameConfig";

class Tile{
  static boxGeos = [];

  public gameManager: GameManager;
  tileData: any;

  width: number;
  height: number;
  margin: number;
  position: Vec2;

  passableMask: string;
  buildableType: string;  //可供部署类型
  tileKey: string;
  heightType: string;

  textureObj: THREE.Mesh;
  cube: Mesh;
  object: Object3D;
  border: BoxHelper;

  sideMaterial: Material;
  topMaterial: Material;

  isBanned: boolean = false;    //该格子是否被ban了

  trap: Trap = null;   //当前地块上的装置
  constructor(tileData: TileData , position: Vec2){
    this.tileData = tileData;
    const {tileKey, heightType, buildableType, passableMask} = tileData;

    this.passableMask = passableMask;
    this.buildableType = buildableType;

    this.width = 1;
    this.height = 0;
    this.margin = 0; //tile之间的间隔
    this.position = {
      x: 0,
      y: 0
    }

    this.position.x = position.x ? position.x : 0;
    this.position.y = position.y ? position.y : 0;


    this.tileKey = tileKey;
    this.heightType = heightType;
  }

  public initMeshs(){
    this.initSize();
    this.createMesh();
    this.createTexture();
    this.addBorder();
  }

  private initSize(){
    
    switch (this.tileKey) {
      case "tile_start":
      case "tile_end":
        this.height = 1;
        break;

      case "tile_fence":
      case "tile_fence_bound":
        this.height = 0;
        break;
      case "tile_passable_wall":
        this.height = GameConfig.TILE_HEIGHT;
        this.margin = 0.15; //高台有间隔
        break;
      default:
        if(this.heightType === "HIGHLAND"){
          this.height = GameConfig.TILE_HEIGHT;
          this.margin = 0.15; //高台有间隔

        }else if(this.heightType === "LOWLAND"){
          this.height = 0;
          
        }
        break;
    }
  }
  private createMesh(){

    const tileTexture = getTile(this.tileKey, this.buildableType, this.heightType);
    let {top : topMaterial, side : sideMaterial} = tileTexture;
    
    this.object = new Object3D();

    GC_Add(this.object);
    this.object.position.x = this.gameManager.getPixelSize(this.position.x);
    this.object.position.y = this.gameManager.getPixelSize(this.position.y);
    this.object.position.z = this.gameManager.getPixelSize(this.height / 2);

    switch (this.tileKey) {
      //给红蓝门添加地面，因为没有设置默认材质所以红蓝门本身是透明的
      case "tile_start":
      case "tile_end":
        const groundGe0 = this.getBoxGeo(this.width, 0, 0);
        const { ground } = tileTexture;
        const groundMesh = new Mesh( groundGe0, [
          null, null, null, null, ground, ground
        ]); 
        groundMesh.position.z = this.gameManager.getPixelSize(- this.height / 2)
        this.object.add(groundMesh);
        break;
      //围栏
      case "tile_fence":
      case "tile_fence_bound":
        const fenceWidth = this.width / 10;
        const sideGeometry = new BoxGeometry( 
          this.gameManager.getPixelSize(fenceWidth),
          this.gameManager.getPixelSize(this.width),
          this.gameManager.getPixelSize(2/7),
        );

        const fenceTop = tileTexture.fenceTop;
        const fenceMaterials = [
          sideMaterial, sideMaterial, sideMaterial, sideMaterial, fenceTop, fenceTop
        ];
        const left = new Mesh( sideGeometry, fenceMaterials); 
        const right = new Mesh( sideGeometry, fenceMaterials); 
        const up = new Mesh( sideGeometry, fenceMaterials); 
        const down = new Mesh( sideGeometry, fenceMaterials); 

        left.position.x = this.gameManager.getPixelSize(-this.width/2 + fenceWidth / 2);
        right.position.x = this.gameManager.getPixelSize(this.width/2 - fenceWidth / 2);
        up.position.y = this.gameManager.getPixelSize(this.width/2 - fenceWidth / 2);
        down.position.y = this.gameManager.getPixelSize(-this.width/2 + fenceWidth / 2);

        up.rotation.z = Math.PI / 2;
        down.rotation.z = Math.PI / 2;

        this.object.add(left);
        this.object.add(right);
        this.object.add(up);
        this.object.add(down);
        break;
        
      case "tile_yinyang_road":
      case "tile_yinyang_wall":
        const geometry = new THREE.CircleGeometry( this.gameManager.getPixelSize(this.width / 8),64);

        const {yin, yang}  = tileTexture;
        const dynamic = this.tileData?.blackboard?.find(arr => arr.key === "dynamic");

        const huimingMat = dynamic?.value === 0? yin : yang;
        const huiming = new THREE.Mesh( geometry, huimingMat );

        huiming.position.z = this.gameManager.getPixelSize(this.height/2) + 0.1;
        this.object.add(huiming);
        break;
      default:
        break;
      case "tile_hole":
        const hole = tileTexture.hole;
        const size = this.gameManager.getPixelSize(hole.scale * this.width);
        const holeGeo = new THREE.PlaneGeometry( size, size );
        const holeMesh = new THREE.Mesh( holeGeo, hole.material );
        holeMesh.position.z = 0.1;
        this.object.add(holeMesh);
        break;
    }

    const geometry = this.getBoxGeo(this.width, this.height, this.margin);

    this.cube = new Mesh( geometry, [
      sideMaterial, sideMaterial, sideMaterial, sideMaterial, topMaterial, topMaterial
    ]); 

    this.object.add(this.cube);
  }

  //生成地块上的图像
  private createTexture(){
    let texture = getTexture(this.tileKey);
    
    if(texture){
      let textureScale = this.tileKey === "tile_floor"? 0.85 : 0.9;
      const textureSize = this.gameManager.getPixelSize(this.width * textureScale);
      texture.scale.set(textureSize,textureSize,1);
      this.textureObj = texture;
      this.textureObj.position.setZ(this.gameManager.getPixelSize(this.height/2) + 0.08);
      this.object.add(this.textureObj)
    }

    if(this.isBanned){
      const bannedSize = this.gameManager.getPixelSize(this.width * 0.9);
      const bannedTexture = getTexture(
        "tile_banned"
      );
      texture.scale.set(bannedSize,bannedSize,1);
      bannedTexture.position.setZ(this.gameManager.getPixelSize(this.height/2) + 0.15);
      this.object.add(bannedTexture)
    }
  }

  //重复的geo直接读取缓存
  private getBoxGeo(width:number, height:number, margin:number):BoxGeometry {
    let boxGeo: BoxGeometry;

    boxGeo = Tile.boxGeos.find(item => {
      return item.width === width && 
      item.height === height && 
      item.margin === margin;
    })?.geo

    if(!boxGeo){
      boxGeo = new BoxGeometry( 
        this.gameManager.getPixelSize(width) - margin,
        this.gameManager.getPixelSize(width) - margin,
        this.gameManager.getPixelSize(height),
      );
      Tile.boxGeos.push({
        width, height, margin,
        geo: boxGeo
      })
    }
    return boxGeo;
  }

  //添加边框
  private addBorder(){
    let borderColor;
    switch (this.tileKey) {
      case "tile_start":
      case "tile_end":
        borderColor = this.tileKey === "tile_end"? "#359dde":"#e03253";
        break;
      case "tile_passable_wall":
        break;
      default:
        if(this.heightType === "LOWLAND"){

          borderColor = "#0d0d0d";
        }
        break;
    }

    if(borderColor){
      this.border = new BoxHelper( this.cube, borderColor);
      (this.border.material as THREE.MeshBasicMaterial).color.convertSRGBToLinear();
      this.object.add(this.border);
    }

  }

  public getPixelHeight(){
    return this.gameManager.getPixelSize(this.height)
  }

  public destroy() {
    //释放内存
    this.object = null;
    this.gameManager = null;
    
  }
}

export default Tile;