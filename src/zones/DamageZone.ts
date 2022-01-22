import { C } from "../C";
import { Entity } from "../entities/Entity";

export class DamageZone extends Phaser.GameObjects.Zone {
    NextLevel:string;
    constructor(scene:Phaser.Scene, o:any) {
        super(scene, o.x, o.y, o.width, o.height);
        this.NextLevel = o.type;
        this.name = 'Damage';
        scene.physics.world.enableBody(this);
        let b = this.body as Phaser.Physics.Arcade.Body;
        b.setAllowGravity(false);
        b.moves = false;
        scene.add.existing(this);
        this.setOrigin(0,0);
        this.on('overlap', (o:any)=> {
                o.emit('damage');
        }, this);
    }
}