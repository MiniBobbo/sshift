import { off } from "process";
import { C } from "../C";
import { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { SceneEvents } from "../events/SceneEvents";
import { IH } from "../IH/IH";
import { FSMModule } from "./FSMModule"

export class PlayerDefenseFSM extends FSMModule {
    e!:Player;
    ih!:IH;
    timer:Phaser.Time.TimerEvent;
    o1:{x:number, y:number};
    o2:{x:number, y:number};
    
    moduleStart() {
        this.e = this.parent as Player;
        this.ih = this.e.ih;
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_ATTACK_SPEED);
        this.e.sprite.setDrag(C.PLAYER_GROUND_DRAG);

        this.o1 = {x:this.e.D1.x - this.e.sprite.x, y:this.e.D1.y - this.e.sprite.y};
        this.o2 = {x:this.e.D2.x - this.e.sprite.x, y:this.e.D2.y - this.e.sprite.y};

        console.log('Defense');
        this.e.gs.events.on(SceneEvents.Button_2_Released, () => {this.parent.changeFSM('move');}, this);



    }


    moduleEnd() {
        this.e.sprite.setDrag(C.PLAYER_GROUND_DRAG);
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_ATTACK_SPEED);
        if(this.timer != null)
        this.timer.destroy();
        this.e.D1.setPosition(-500,-500);
        this.e.D2.setPosition(-500,-500);
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
    

        this.e.D1.setPosition(this.e.sprite.x + this.o1.x, this.e.sprite.y + this.o1.y);
        this.e.D2.setPosition(this.e.sprite.x + this.o2.x, this.e.sprite.y + this.o2.y);
        
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