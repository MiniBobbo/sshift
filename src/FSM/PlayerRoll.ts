import { C } from "../C";
import { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { IH } from "../IH/IH";
import { FSMModule } from "./FSMModule"

export class PlayerRollFSM extends FSMModule {
    e!:Player;
    ih!:IH;
    timer:Phaser.Time.TimerEvent;
    dragHold:number;

    moduleStart() {
        this.e = this.parent as Player;
        this.ih = this.e.ih;
        this.e.sprite.setDrag(0);
        this.e.sprite.setMaxVelocity(C.PLAYER_LEAP_SPEED);
        let angle = this.e.sprite.body.velocity.angle();        
        let roll = new Phaser.Math.Vector2(C.PLAYER_LEAP_SPEED,0);
        roll.rotate(angle);
        this.e.sprite.setVelocity(roll.x, roll.y);
        //TODO: Leap animation

        this.timer = this.e.gs.time.addEvent({
            delay:C.PLAYER_LEAP_TIME,
            callbackScope:this,
            callback:() => {
                this.e.sprite.setMaxVelocity(C.PLAYER_ROLL_SPEED);
                //TODO: Roll animation
                this.timer = this.e.gs.time.addEvent({
                    delay:C.PLAYER_ROLL_TIME,
                    callbackScope:this,
                    callback:() => {
                        this.parent.changeFSM('move');
                    }
                });


            }
        });



    }

    moduleEnd() {
        this.e.sprite.setDrag(C.PLAYER_GROUND_DRAG);
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_ATTACK_SPEED);
        if(this.timer != null)
        this.timer.destroy();
    }

    update(dt:number) {
    }

    ChangeAnimation() {

    }
}