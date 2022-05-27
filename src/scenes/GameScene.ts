import { TextBox } from "../entities/TextBox";
import { IH } from "../IH/IH";
import { TravelZone } from "../zones/TravelZone";
import { EnemyFactory } from "../EnemyFactory";
import { MessageZone } from "../zones/MessageZone";
import { DamageZone } from "../zones/DamageZone";
import { PowerupZone } from "../zones/PowerupZone";
import { Player } from "../entities/Player";
import { LDtkMapPack, LdtkReader, Neighbour } from "../map/LDtkReader";
import { SetupMapHelper } from "../helpers/SetupMapHelper";
import { MapObjects } from "../map/MapObjects";
import { C } from "../C";
import { NumericLiteral } from "typescript";
import { threadId } from "worker_threads";
import { SceneEvents } from "../events/SceneEvents";
import { BaseAttack } from "../attacks/BaseAttack";
import { Signals } from "../Signals";

export class GameScene extends Phaser.Scene {
    player!:Player;
    ih!:IH;
    reader:LdtkReader;
    currentMap:LDtkMapPack;
    nextMap:LDtkMapPack;
    allMaps:Array<LDtkMapPack>;
    AllMapObjects:Array<MapObjects>;
    debugText!:Phaser.GameObjects.BitmapText;
    map!:Phaser.Tilemaps.Tilemap;
    zones!:Phaser.GameObjects.Group;
    collideMap!:Phaser.GameObjects.Group;
    enemies!:Phaser.GameObjects.Group;
    cam:Phaser.GameObjects.Image;
    IntMaps:Phaser.GameObjects.Group;
    effects!:Phaser.GameObjects.Group;
    tb!:TextBox;
    mg!:Phaser.Tilemaps.TilemapLayer;
    private LastVisitedLevels:Array<string>;
    private _mapCollider:Phaser.Physics.Arcade.Collider;

    private _enemyAttacks:Phaser.GameObjects.Group;
    private _playerAttacks:Phaser.GameObjects.Group;
    private _playerDefense:Phaser.GameObjects.Group;


    PointerOffset:{x:number, y:number};
    Pointer:Phaser.GameObjects.Image;

    g:Phaser.GameObjects.Graphics;

    init:boolean = false;

    preload() {
        this.ih = new IH(this);
    }

    create() {
        // let g = this.add.graphics();
        if(!this.init) {
            this.InitScene();
            this.init = true;
        }

        this.ChangeMap(C.currentLevel);
        SetupMapHelper.CreatePlayer(this, this.currentMap);
        this._playerDefense = this.add.group([this.player.D1, this.player.D2]);
        this._playerAttacks = this.add.group([this.player.Attack]);

        this.PointerOffset = {x:0, y:0};
        this.Pointer = this.add.image(0,0, 'pointer').setDepth(1000).setScrollFactor(0,0);

        // this.CreateMap(this.reader);
        this.cameras.main.startFollow(this.player.sprite);
        this.g = this.add.graphics({
            x:0, y:0,
        }).fillStyle(0x882244, .5).setDepth(5000);
        this.input.on('pointerdown', (pointer:Phaser.Input.Pointer) => {
            if(!this.input.mouse.locked)
            this.input.mouse.requestPointerLock();
            else {
                // console.log(`Buton pressed ${pointer.button}`);
                if(pointer.button == 0)
                    this.events.emit(SceneEvents.Button_1_Pressed);
                else
                this.events.emit(SceneEvents.Button_2_Pressed);
            }
        }, this);
        this.input.on('pointerup', (pointer:Phaser.Input.Pointer) => {
                // console.log(`Buton pressed ${pointer.button}`);
                if(pointer.button == 0)
                    this.events.emit(SceneEvents.Button_1_Released);
                else
                this.events.emit(SceneEvents.Button_2_Released);
        }, this);

        this.events.on('preupdate', this.preupdate, this);

        this.events.on('debug', (t:string, reset:boolean = false) => {  if(reset) this.debugText.text = "";  this.debugText.text += t;  });
        // // When locked, you will have to use the movementX and movementY properties of the pointer
        // // (since a locked cursor's xy position does not update)
        this.input.on('pointermove', (pointer) => {

        if (this.input.mouse.locked)
        {
            this.PointerOffset.x += pointer.movementX * C.MOUSE_SENSITIVITY;
            this.PointerOffset.y += pointer.movementY * C.MOUSE_SENSITIVITY;
        }
        }, this);
        // let ground = this.physics.add.sprite(400,400, 'atlas').setSize(100,100).setImmovable(true);
        let m = this.allMaps.find(e=>e.level.identifier == 'Level_0');
        this.CreatePhysics();
        this.cameras.main.fadeIn(300);
    }

    CreatePhysics() {
        this.physics.overlap(this._enemyAttacks, this._playerDefense, (a:Phaser.GameObjects.GameObject ) => { console.log("Defended"); a.emit(Signals.CollidePlayerDefense);});
    }

    InitScene() {
        this.zones= this.add.group();
        this.collideMap=this.add.group();
        this.IntMaps = this.add.group();
        this.enemies = this.add.group();
        this._enemyAttacks = this.add.group();
        var r:LdtkReader = new LdtkReader(this,this.cache.json.get('level'));
        this.reader = r;
        this.cam = this.add.image(0,0,'atlas').setVisible(false);


        this.allMaps = [];
        this.AllMapObjects = [];
        r.ldtk.levels.forEach(element => {
            let m = r.CreateMap(element.identifier, 'mapts')
            this.allMaps.push(m);
            this.IntMaps.add(m.collideLayer);
        });

        this.effects = this.add.group({
            classType:Phaser.GameObjects.Sprite
        });

        this.debugText = this.add.bitmapText(2,22, '6px', '')
        .setScrollFactor(0,0).setDepth(1000);

        this.events.on('effect', this.Effect, this);
        // this.player.sprite.on('dead', this.PlayerDied, this);
        this.events.on('shutdown', this.ShutDown, this);
        // this.events.on('travel', () => { this.player.fsm.clearModule(); this.cameras.main.fadeOut(200, 0,0,0,(cam:any, progress:number) => { if(progress == 1) this.scene.restart();}); }, this);
        this.events.on('textbox', (speaker:{x:number, y:number}, message:string) => {
            this.tb.setVisible(true);
            this.tb.SetText(message); 
            this.tb.MoveAbove(speaker); 
        }, this);
        this.events.on('hidetextbox', ()=> {this.tb.setVisible(false);}, this);
        this.input.on('pointerup', (pointer:any) => {
            },this);

        this.tb = new TextBox(this, this.ih);
        this.tb.setVisible(false);
        this.cameras.main.setRoundPixels(true);
    }

    private ChangeMap(newMap:string) {
        // this.IntMaps.clear();
        C.currentLevel = newMap;
        if(this.currentMap != null) {
            this.currentMap.SetVisible(false);
            this.physics.world.colliders.remove(this._mapCollider);
        }

        this._enemyAttacks.children.entries.forEach(element => {
            element.emit('end');
        });

        let m = this.allMaps.find(e=>e.level.identifier == newMap);
        m.SetVisible(true);
        m.collideLayer.setCollision([1,3]);
        this._mapCollider = this.physics.add.collider(this.collideMap, m.collideLayer, this.Collided);
        this.physics.world.colliders[0];
        this.currentMap = m;
        this.cameras.main.setBounds(0, 0, this.currentMap.width, this.currentMap.height);

        let mo = new MapObjects();
        SetupMapHelper.CreateEntities(this, m, mo);
    }
    
    Collided(e:any, o:any) {
        e.emit(Signals.CollideMap, o);
    }
    preupdate(time:number, dt:number) {
        if(this.PointerOffset == null)
        return;
        this.PointerOffset.x = Phaser.Math.Clamp(this.PointerOffset.x, 0,360);
        this.PointerOffset.y = Phaser.Math.Clamp(this.PointerOffset.y, 0,270);

        let p = {x:0, y:0};
        p.x = this.Pointer.x + this.cameras.main.scrollX;
        p.y = this.Pointer.y + this.cameras.main.scrollY;
        this.Pointer.setPosition(this.PointerOffset.x, this.PointerOffset.y);
        this.player.Facing = Phaser.Math.Angle.BetweenPoints(this.player.sprite, p);
        this.events.emit('debug', `Angle: ${Phaser.Math.RadToDeg(this.player.Facing)}`);
    }

    /**
     * remove the listeners of all the events creted in create() or they will fire multiple times.  
     */
    ShutDown() {
        this.events.removeListener('shutdown');
        this.events.removeListener('debug');
        this.events.removeListener('travel');
        this.events.removeListener('effect');
        this.events.removeListener('pointerup');
    }


    Effect(data:{name:string, x:number, y:number}) {
        let e:Phaser.GameObjects.Sprite = this.effects.getFirstDead(true, 100,100,'atlas');
        e.setActive(true);
        e.setDepth(55);
        e.visible = true;
        switch (data.name) {
            default:
                break;
        }

    }

    update(time:number, dt:number) {
        this.debugText.text = '';
        this.ih.update();

        this.PointerOffset.x = Phaser.Math.Clamp(this.PointerOffset.x, 0,400);
        this.PointerOffset.y = Phaser.Math.Clamp(this.PointerOffset.y, 0,400);

        this.Pointer.setPosition(this.PointerOffset.x, this.PointerOffset.y);

        if(this.ih.IsJustPressed('event')) {
            var from = C.GetTileFromPosition(this.player.sprite.x, this.player.sprite.y);
            var to = C.GetTileFromPosition(this.Pointer.x + this.cameras.main.scrollX, this.Pointer.y + this.cameras.main.scrollY);
            var line = this.GetLine(from.x, from.y, to.x, to.y);
            this.g.clear();
            line.forEach(element => {
                this.g.fillRect(element.x * C.TILE_SIZE, element.y * C.TILE_SIZE, C.TILE_SIZE, C.TILE_SIZE);
            });
        }

        this.events.emit('debug', `Player Defense: ${this._playerDefense.countActive()}`);
        this.events.emit('debug', `Enemy Attack  : ${this._enemyAttacks.countActive()}`);

        if(this.player.sprite.x > this.currentMap.width) {
            console.log('Off screen to right');
            
            //TODO: Find the correct level, not just the first because there might be more than one.
            var levels:Neighbour = this.currentMap.level.__neighbours.find(e=> e.dir == 'e');
            let mapname = this.reader.GetLevelFromID(levels.levelUid).identifier;
            this.ChangeMap(mapname);
            this.player.sprite.x = 10;
        } else if (this.player.sprite.x < 0) {
            console.log('Off screen to left');
            var width = this.currentMap.width;
            //TODO: Find the correct level, not just the first because there might be more than one.
            var levels:Neighbour = this.currentMap.level.__neighbours.find(e=> e.dir == 'w');
            let mapname = this.reader.GetLevelFromID(levels.levelUid).identifier;
            this.ChangeMap(mapname);
            this.player.sprite.x = width - 10;
        } else if (this.player.sprite.y < 0) {
            console.log('Off screen up');
            var height = this.currentMap.height;
            //TODO: Find the correct level, not just the first because there might be more than one.
            var levels:Neighbour = this.currentMap.level.__neighbours.find(e=> e.dir == 'n');
            let mapname = this.reader.GetLevelFromID(levels.levelUid).identifier;
            this.ChangeMap(mapname);
            this.player.sprite.y = height - 10;
        } else if (this.player.sprite.y > this.currentMap.height) {
            console.log('Off screen down');
            var height = this.currentMap.height;
            //TODO: Find the correct level, not just the first because there might be more than one.
            var levels:Neighbour = this.currentMap.level.__neighbours.find(e=> e.dir == 's');
            let mapname = this.reader.GetLevelFromID(levels.levelUid).identifier;
            this.ChangeMap(mapname);
            this.player.sprite.y = 10;
        }

    }

    CreateZones() {
        this.map.objects[0].objects.forEach((o)=> {
            switch (o.name) {
                case 'travel':
                    let travel = new TravelZone(this, o);
                    this.zones.add(travel);
                    break;
                case 'message':
                    let message = new MessageZone(this, o);
                    this.zones.add(message);
                    break;
                case 'damage':
                    let dz = new DamageZone(this, o);
                    this.zones.add(dz);
                    break;
                case 'powerup':
                    let puz = new PowerupZone(this, o);
                    this.zones.add(puz);
                    break;
                case 'enemy':
                    EnemyFactory.CreateEnemy(this, this.ih, o);
                break;
                default:
                    break;
            }
        });
    }

    GetEnemyAttack():Phaser.Physics.Arcade.Sprite {
        let a = this._enemyAttacks.getFirstDead();
        if(a==null) {
            a = this.physics.add.sprite(-100,-100,'atlas');
            this._enemyAttacks.add(a);
            this.collideMap.add(a);
        }
        return a;
    }
        
    GetPlayerAttack(type:string):any {
        // let a = this.playerAttacks.find( (a:Phaser.Physics.Arcade.Sprite) => { return a.body.enable === false && a.name === type;})
        // if(a===undefined) {
        //     a = new BaseAttack(this);
        //     this.playerAttacks.push(a);
        //     this.playerAttackSprites.push(a.sprite)
        // }
        // return a;
    }

    PlayerDied() {

    }

    /**
     * Uses bresenham's line algorithm to get a list of integer points between two points.  
     * If being used on a collition map this should be converted to tile units first.
     * @param x0 
     * @param y0 
     * @param x1 
     * @param y1 
     * @returns An array of points.  Unsure if ordered or not.
     */
    GetLine(x0:number, y0:number, x1:number, y1:number) : Array<{x:number, y:number}> {
        var pts:Array<{x:number, y:number}> = [];
        var swapXY = Math.abs( y1 - y0 ) > Math.abs( x1 - x0 );
        var tmp : number;
        if ( swapXY ) {
            // swap x and y
            tmp = x0; x0 = y0; y0 = tmp; // swap x0 and y0
            tmp = x1; x1 = y1; y1 = tmp; // swap x1 and y1
        }
    
        if ( x0 > x1 ) {
            // make sure x0 < x1
            tmp = x0; x0 = x1; x1 = tmp; // swap x0 and x1
            tmp = y0; y0 = y1; y1 = tmp; // swap y0 and y1
        }
    
        var deltax = x1 - x0;
        var deltay = Math.floor( Math.abs( y1 - y0 ) );
        var error = Math.floor( deltax / 2 );
        var y = y0;
        var ystep = y0 < y1 ? 1 : -1;
        if( swapXY )
            // Y / X
            for ( let x = x0; x < x1;x++ ) {
                pts.push({x:y, y:x});
                error -= deltay;
                if ( error < 0 ) {
                    y = y + ystep;
                    error = error + deltax;
                }
            }
        else
            // X / Y
            for ( let x = x0; x < x1;x++ ) {
                pts.push({x:x, y:y});
                error -= deltay;
                if ( error < 0 ) {
                    y = y + ystep;
                    error = error + deltax;
                }
            }
        return pts;
    }
        
}