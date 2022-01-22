export class AudioZone extends Phaser.GameObjects.Zone {
    constructor(scene:Phaser.Scene, x:number, y:number, width:number, height:number, audio:string) {
        super(scene, x, y, width, height);
        scene.physics.world.enableBody(this);
        this.name = 'Audio Zone';
        let b = this.body as Phaser.Physics.Arcade.Body;
        
        b.setAllowGravity(false);
        b.moves = false;
        scene.add.existing(this);
        this.setOrigin(0,0);
        this.on('overlap', (o:any)=> {
            if(o.name == 'player')  {
                this.scene.sound.play(audio, {
                    volume:1.5
                });
                this.scene.events.emit('faceappear');
                //@ts-ignore
                this.body.enable = false;
                this.scene.time.addEvent({
                    delay:4000,
                    callbackScope:this,
                    callback: () => {this.scene.events.emit('facedisappear');}
                });

            }
        }, this);
    }

    // preUpdate(time, delta) {}
}