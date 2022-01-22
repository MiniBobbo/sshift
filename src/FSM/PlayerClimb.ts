import { IFSM } from "./FSM";
import { FSMModule } from "./FSMModule";
import { C } from "../C";
import { Entity } from "../entities/Entity";

export class PlayerClimb extends FSMModule {
    p:Entity;
    constructor(parent:IFSM) {
        super(parent);
        this. p = parent as Entity;
    }

    moduleStart(args:any) {
        this.p.sprite.setGravityY(0);
        if(!this.p.sprite.flipX)
            this.p.sprite.setGravityX(C.GRAVITY);
        else
            this.p.sprite.setGravityX(-C.GRAVITY);
        this.p.PlayAnimation('climb');

    }

    moduleEnd(args:any) {
        this.p.sprite.setGravityX(0);
        this.p.sprite.setGravityY(C.GRAVITY);

    }

    update(dt:number) {
        this.p.sprite.setVelocityY(0);
        if(!this.p.sprite.body.blocked.left && !this.p.sprite.body.blocked.right) {
            if(!this.p.sprite.flipX)
                this.p.sprite.x += 7;
            else
            this.p.sprite.x -= 7;

            this.parent.changeFSM('air');
            return;
        }

        if(this.p.ih.IsJustPressed('jump')) {
            
            this.parent.changeFSM('air');
            return;

        }
        if(this.p.ih.IsPressed('up')) {
            this.p.sprite.setVelocityY(-C.PLAYER_CLIMB_SPEED);
            // this.p.PlayAnimation('climbup');
        } else if (this.p.ih.IsPressed('down')) {
            this.p.sprite.setVelocityY(C.PLAYER_CLIMB_SPEED);
            // this.p.PlayAnimation('climbdown');
        } else {
            // this.p.PlayAnimation('climb');
        }
    }





}