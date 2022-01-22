export class MessageZone extends Phaser.GameObjects.Zone {
    message:string;
    lastTouching:boolean = false;
    constructor(scene:Phaser.Scene, o:any) {
        super(scene, o.x, o.y, o.width, o.height);
        scene.physics.world.enableBody(this);
        this.name = 'Message Zone';
        let b = this.body as Phaser.Physics.Arcade.Body;
        this.message = o.type;
        b.setAllowGravity(false);
        b.moves = false;
        scene.add.existing(this);
        this.setOrigin(0,0);
        this.on('overlap', (o:any)=> {
            if(o.name == 'player')  {
                this.scene.events.emit('message', this.message, this.x,this.y, this.width);
                // console.log('Raising message event');
            }
        }, this);
    }

    // preUpdate(time, delta) {}
}