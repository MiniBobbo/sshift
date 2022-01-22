import { C } from "../C";

export class PowerupZone extends Phaser.GameObjects.Zone {
    pUp:string;
    constructor(scene:Phaser.Scene, o:any) {
        super(scene, o.x, o.y, o.width, o.height);
        this.name = 'Powerup';
        this.pUp = o.type; 
        scene.physics.world.enableBody(this);
        let b = this.body as Phaser.Physics.Arcade.Body;
        b.setAllowGravity(false);
        b.moves = false;
        scene.add.existing(this);
        this.setOrigin(0,0);
        switch (this.pUp) {

            default:
                break;
        }

    }
}