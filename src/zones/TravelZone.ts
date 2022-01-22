import { C } from "../C";

export class TravelZone extends Phaser.GameObjects.Zone {
    NextLevel:string;
    constructor(scene:Phaser.Scene, o:any) {
        super(scene, o.x, o.y, o.width, o.height);
        this.NextLevel = o.type;
        this.name = 'Travel';
        scene.physics.world.enableBody(this);
        let b = this.body as Phaser.Physics.Arcade.Body;
        b.setAllowGravity(false);
        b.moves = false;
        scene.add.existing(this);
        this.setOrigin(0,0);
        this.on('overlap', (o:any)=> {
            if(o.name == 'player') {
                C.previouslevel = C.currentLevel;
                C.currentLevel = this.NextLevel;
                this.scene.events.emit('travel');
                //@ts-ignore    
                 this.body.setEnable(false);
                
            }
        }, this);
    }
}