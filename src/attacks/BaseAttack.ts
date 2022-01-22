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
        this.sprite = scene.physics.add.sprite(-100,-100, 'mmatlas')
        .setSize(8,4);
        this.finish();
        this.time = scene.time;
        this.sprite.on('hit', () => {
            this.finish();
        },this);
    }


    MoveToMelee() {
        this.sprite.setPosition(this.attachedEntity.sprite.x + this.offset.x, this.attachedEntity.sprite.y + this.offset.y);
    }

    update(dt:number) {
        if(this.melee) {
            this.MoveToMelee();
        }
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