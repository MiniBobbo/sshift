import { off } from "process";
import { C } from "../C";
import { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { SceneEvents } from "../events/SceneEvents";
import { IH } from "../IH/IH";
import { FSMModule } from "./FSMModule"

export class PlayerAttackFSM extends FSMModule {
    e!:Player;
    ih!:IH;
    timer:Phaser.Time.TimerEvent;
    offset:{x:number, y:number};
    
    moduleStart() {
        this.e = this.parent as Player;
        this.ih = this.e.ih;
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_ATTACK_SPEED);
        this.e.sprite.setDrag(C.PLAYER_GROUND_DRAG);

        this.offset = {x:this.e.Attack.x - this.e.sprite.x, y:this.e.Attack.y - this.e.sprite.y};

        console.log('Attacking');
        this.timer = this.e.gs.time.addEvent({
            delay:C.PLAYER_ATTACK_TIME,
            callbackScope:this,
            callback:() => {
                this.parent.changeFSM('move');
            }
        });


    }


    moduleEnd() {
        this.e.sprite.setDrag(C.PLAYER_GROUND_DRAG);
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_ATTACK_SPEED);
        if(this.timer != null)
        this.timer.destroy();
        this.e.Attack.setPosition(-500,-500);
    }

    update(dt:number) {
        this.e.sprite.setAcceleration(0,0);
        let ih = this.ih;
        let ax = 0;
        let ay = 0;
        // if(ih.IsJustPressed('attack')) {
        //     this.e.changeFSM('attack');
        //     return;
        // }

        if(ih.IsPressed('left'))
            ax--;
        if(ih.IsPressed('right'))
            ax++;
        if(ih.IsPressed('up'))
            ay--;
        if(ih.IsPressed('down'))
            ay++;
        this.e.scene.events.emit('debug', `P Accel: ${ax}`);
        this.e.sprite.setAccelerationX(ax * C.PLAYER_GROUND_ACCEL);
        this.e.sprite.setAccelerationY(ay * C.PLAYER_GROUND_ACCEL);
        //TODO: Cap speed by total velocity not separately in the X and Y axis.
        if(ih.IsPressed('roll'))
            this.parent.changeFSM('roll');
    

        this.e.Attack.setPosition(this.e.sprite.x + this.offset.x, this.e.sprite.y + this.offset.y);
        
        this.ChangeAnimation();
    }

    ChangeAnimation() {
        if(this.ih.IsPressed('left')) {
            this.e.PlayAnimation('run');
            this.e.sprite.flipX = true;
        }
        else if(this.ih.IsPressed('right')) {
            this.e.PlayAnimation('run');
            this.e.sprite.flipX = false;
        } else {
            this.e.PlayAnimation('stand');

        }


    }
}