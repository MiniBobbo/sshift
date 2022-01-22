import { TextBox } from "../entities/TextBox";
import { IH } from "../IH/IH";
import { TravelZone } from "../zones/TravelZone";
import { C } from "../C";
import { EnemyFactory } from "../EnemyFactory";
import { MessageZone } from "../zones/MessageZone";
import { DamageZone } from "../zones/DamageZone";
import { PowerupZone } from "../zones/PowerupZone";
import { Player } from "../entities/Player";
import { LDtkMapPack, LdtkReader, Neighbour } from "../map/LDtkReader";
import { SetupMapHelper } from "../helpers/SetupMapHelper";
import { isThisTypeNode, textChangeRangeIsUnchanged } from "typescript";
import { threadId } from "worker_threads";
import { MapObjects } from "../map/MapObjects";
import {MergedInput} from "../MergedInput";
import { Console } from "console";

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
    zones!:Array<Phaser.GameObjects.Zone>;
    collideMap!:Array<Phaser.GameObjects.GameObject>;
    enemies!:Array<Phaser.GameObjects.GameObject>;
    cam:Phaser.GameObjects.Image;

    effects!:Phaser.GameObjects.Group;
    tb!:TextBox;
    mg!:Phaser.Tilemaps.TilemapLayer;

    preload() {
        this.ih = new IH(this);
        this.load.scenePlugin('mergedInput', MergedInput);
        

    }

    create() {
        let g = this.add.graphics();
        this.zones=[];
        this.collideMap=[];
        this.enemies = [];
        var r:LdtkReader = new LdtkReader(this,this.cache.json.get('level'));
        this.reader = r;
        this.cam = this.add.image(0,0,'atlas').setVisible(false);

        this.CreateMap(r, 'Level_0');
        this.cameras.main.startFollow(this.player.sprite);

        this.physics.add.overlap(this.player.sprite, this.enemies, (p:any, e:any) => {
            e.emit('hitplayer', p);
        }); 

        this.effects = this.add.group({
            classType:Phaser.GameObjects.Sprite
        });

        this.debugText = this.add.bitmapText(2,22, '6px', '')
        .setScrollFactor(0,0);

        this.events.on('effect', this.Effect, this);
        this.player.sprite.on('dead', this.PlayerDied, this);
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
        this.cameras.main.fadeIn(300);
    }

    private CreateMap(r: LdtkReader, nextMapName:string) {
        this.nextMap = r.CreateMap(nextMapName, 'mapts');
        if(this.currentMap == null) {
            this.nextMapObjects = SetupMapHelper.SetupMap(this,this.nextMap);
            SetupMapHelper.CreatePlayer(this, this.nextMap);
            this.cameras.main.setBounds(0, 0, this.nextMap.width, this.nextMap.height);
        } else {
            this.nextMapObjects = SetupMapHelper.SetupMap(this,this.nextMap);
            this.currentMapObject.Destroy();
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

        this.cam.setPosition(this.player.sprite.x, this.player.sprite.y);

        if(this.ih.IsJustPressed('event')) {
            // this.events.emit('unlock');
        }

        this.events.emit('debug', `Effects: ${this.effects.getLength()}`);
        this.events.emit('debug', `P loc: ${Math.floor(this.player.sprite.body.x)},  ${Math.floor(this.player.sprite.body.y)}`);
        this.events.emit('debug', `Mouse loc: ${Math.floor(this.input.mousePointer.worldX)},  ${Math.floor(this.input.mousePointer.worldY)}`);

        if(this.player.sprite.x > this.currentMap.width) {
            console.log('Off screen to right');
            
            //TODO: Find the correct level, not just the first because there might be more than one.
            var levels:Neighbour = this.currentMap.level.__neighbours.find(e=> e.dir == 'e');
            this.CreateMap(this.reader, this.reader.GetLevelFromID(levels.levelUid).identifier);
            this.player.sprite.x = 10;
        } else if (this.player.sprite.x < 0) {
            console.log('Off screen to left');
            var width = this.currentMap.width;
            //TODO: Find the correct level, not just the first because there might be more than one.
            var levels:Neighbour = this.currentMap.level.__neighbours.find(e=> e.dir == 'w');
            this.CreateMap(this.reader, this.reader.GetLevelFromID(levels.levelUid).identifier);
            this.player.sprite.x = width - 10;

        }

    }

    CreateZones() {
        this.map.objects[0].objects.forEach((o)=> {
            switch (o.name) {
                case 'travel':
                    let travel = new TravelZone(this, o);
                    this.zones.push(travel);
                    break;
                case 'message':
                    let message = new MessageZone(this, o);
                    this.zones.push(message);
                    break;
                case 'damage':
                    let dz = new DamageZone(this, o);
                    this.zones.push(dz);
                    break;
                case 'powerup':
                    let puz = new PowerupZone(this, o);
                    this.zones.push(puz);
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