import { Entity } from "../entities/Entity";

export class BaseAttack {
    sprite:Phaser.Physics.Arcade.Sprite;
    melee:boolean = false;
    attachedEntity!:Entity;
    offset!:{x:number, y:number};
    lastAnim:string = '';
    time:Phaser.Time.Clock;
    timeEvent!:Phaser.Time.TimerEvent;
    constructor(scene:Phaser.Scene) {
        this.sprite = scene.physics.add.sprite(-100,-100, 'atlas')
        .setVisible(false)
        .setCircle(4);
        this.finish();
        this.time = scene.time;
        this.sprite.on('hit', () => {
            this.finish();
        },this);
        this.sprite.on('collidemap', this.finish, this);
        this.sprite.on('end', this.finish, this);
    }

    update(dt:number) {
        if(!this.sprite.body.blocked.none)
            this.sprite.emit('hit');
    }

    finish() {
        this.sprite.body.enable = false;
        this.sprite.setVisible(false);
    }

    start() {
        this.sprite.body.enable = true;
        this.sprite.setVisible(true);
    }

    PlayAnimation(anim:string, ignoreIfPlaying:boolean = true) {
        if(ignoreIfPlaying && anim == this.lastAnim)
            return;
        this.sprite.anims.play(anim, ignoreIfPlaying);
        this.sprite.setOffset(this.sprite.width/2 - this.sprite.body.width/2, this.sprite.height/2- this.sprite.body.height/2);
        this.lastAnim = anim;
    }

}