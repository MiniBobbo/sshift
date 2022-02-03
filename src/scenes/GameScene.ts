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

export class GameScene extends Phaser.Scene {
    player!:Player;
    ih!:IH;
    reader:LdtkReader;
    currentMap:LDtkMapPack;
    nextMap:LDtkMapPack;
    currentMapObject:MapObjects;
    nextMapObjects:MapObjects;
    debugText!:Phaser.GameObjects.BitmapText;
    map!:Phaser.Tilemaps.Tilemap;
    zones!:Phaser.GameObjects.Group;
    collideMap!:Phaser.GameObjects.Group;
    enemies!:Phaser.GameObjects.Group;
    cam:Phaser.GameObjects.Image;
    IntMaps:Phaser.GameObjects.Group;
    // IntMaps:Array<Phaser.Tilemaps.TilemapLayer>;
    effects!:Phaser.GameObjects.Group;
    tb!:TextBox;
    mg!:Phaser.Tilemaps.TilemapLayer;

    PointerOffset:{x:number, y:number};
    Pointer:Phaser.GameObjects.Image;

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

        this.events.on('debug', (s:string) => {this.debugText.text += `${s}\n`;});

        this.PointerOffset = {x:0, y:0};
        this.Pointer = this.add.image(0,0, 'pointer').setDepth(1000).setScrollFactor(0,0);

        this.CreateMap(this.reader);
        this.cameras.main.startFollow(this.player.sprite);

    // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
    this.input.on('pointerdown', (pointer) => {

        this.input.mouse.requestPointerLock();

    }, this);

    // When locked, you will have to use the movementX and movementY properties of the pointer
    // (since a locked cursor's xy position does not update)
    this.input.on('pointermove', (pointer) => {

        if (this.input.mouse.locked)
        {
            this.PointerOffset.x += pointer.movementX * C.MOUSE_SENSITIVITY;
            this.PointerOffset.y += pointer.movementY * C.MOUSE_SENSITIVITY;
        }
    }, this);

        this.physics.add.collider(this.collideMap, this.IntMaps);
        this.cameras.main.fadeIn(300);
    }

    InitScene() {
        this.zones= this.add.group();
        this.collideMap=this.add.group();
        this.IntMaps = this.add.group();
        this.enemies = this.add.group();
        var r:LdtkReader = new LdtkReader(this,this.cache.json.get('level'));
        this.reader = r;
        this.cam = this.add.image(0,0,'atlas').setVisible(false);
        // this.physics.add.overlap(this.player.sprite, this.enemies, (p:any, e:any) => {
        //     e.emit('hitplayer', p);
        // }); 

        this.effects = this.add.group({
            classType:Phaser.GameObjects.Sprite
        });

        this.debugText = this.add.bitmapText(2,22, '6px', '')
        .setScrollFactor(0,0).setDepth(1000);

        this.events.on('effect', this.Effect, this);
        // this.player.sprite.on('dead', this.PlayerDied, this);
        this.events.on('shutdown', this.ShutDown, this);
        this.events.on('travel', () => { this.player.fsm.clearModule(); this.cameras.main.fadeOut(200, 0,0,0,(cam:any, progress:number) => { if(progress == 1) this.scene.restart();}); }, this);
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

    private CreateMap(r: LdtkReader) {
        this.nextMap = r.CreateMap(C.currentLevel, 'mapts');
        if(this.currentMap == null) {
            this.nextMapObjects = SetupMapHelper.SetupMap(this,this.nextMap);
            SetupMapHelper.CreatePlayer(this, this.nextMap);
            this.cameras.main.setBounds(0, 0, this.nextMap.width, this.nextMap.height);
        } else {
            this.nextMapObjects = SetupMapHelper.SetupMap(this,this.nextMap);
            // this.currentMapObject.Destroy();
            SetupMapHelper.DestroyMap(this, this.currentMap);
            this.cameras.main.setBounds(0, 0, this.nextMap.width, this.nextMap.height);
        }
        this.currentMap = this.nextMap;
        this.currentMapObject = this.nextMapObjects;
        this.nextMap = null;
        this.nextMapObjects = null;
        // this.physics.world.setBounds(this.currentMap.worldX, this.currentMap.worldY, this.currentMap.width, this.currentMap.height);
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
        if(this.tb.visible) {
            if(this.ih.IsJustPressed('jump') ||this.ih.IsJustPressed('attack') ) {
                this.tb.setVisible(false);
            }
        }

        this.PointerOffset.x = Phaser.Math.Clamp(this.PointerOffset.x, 0,400);
        this.PointerOffset.y = Phaser.Math.Clamp(this.PointerOffset.y, 0,400);

        this.Pointer.setPosition(this.PointerOffset.x, this.PointerOffset.y);

        if(this.ih.IsJustPressed('event')) {
            // this.events.emit('unlock');
        }

        this.events.emit('debug', `Player FSM: ${this.player.fsm.currentModuleName}`);
        // this.events.emit('debug', `Effects: ${this.effects.getLength()}`);
        // this.events.emit('debug', `P loc: ${Math.floor(this.player.sprite.body.x)},  ${Math.floor(this.player.sprite.body.y)}`);
        // this.events.emit('debug', `Mouse loc: ${Math.floor(this.input.mousePointer.worldX)},  ${Math.floor(this.input.mousePointer.worldY)}`);

        if(this.player.sprite.x > this.currentMap.width) {
            console.log('Off screen to right');
            
            //TODO: Find the correct level, not just the first because there might be more than one.
            var levels:Neighbour = this.currentMap.level.__neighbours.find(e=> e.dir == 'e');
            C.currentLevel = this.reader.GetLevelFromID(levels.levelUid).identifier;
            this.CreateMap(this.reader);
            this.player.sprite.x = 10;
        } else if (this.player.sprite.x < 0) {
            console.log('Off screen to left');
            var width = this.currentMap.width;
            //TODO: Find the correct level, not just the first because there might be more than one.
            var levels:Neighbour = this.currentMap.level.__neighbours.find(e=> e.dir == 'w');
            C.currentLevel = this.reader.GetLevelFromID(levels.levelUid).identifier;
            this.CreateMap(this.reader);
            this.player.sprite.x = width - 10;
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

    GetEnemyAttack():any {
        // let a = this.enemyAttacks.find( (a:BaseAttack) => { return a.sprite.body.enable === false;})
        // if(a===undefined) {
        //     a = new BaseAttack(this);
        //     this.enemyAttacks.push(a);
        // }
        // return a;
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
        
}