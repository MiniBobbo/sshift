import { C } from "../C";
import { Entity } from "../entities/Entity";
import { IH } from "../IH/IH";
import { FSMModule } from "./FSMModule"

export class PlayerMoveFSM extends FSMModule {
    e!:Entity;
    ih!:IH;
    
    moduleStart() {
        this.e = this.parent as Entity;
        this.ih = this.e.ih;
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_SPEED);
        this.e.sprite.setDrag(C.PLAYER_GROUND_DRAG);
    }

    moduleEnd() {

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
        // this.e.sprite.body.velocity.length


        
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