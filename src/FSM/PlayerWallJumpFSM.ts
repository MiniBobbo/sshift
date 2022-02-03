import { C } from "../C";
import { Player } from "../entities/Player";
import { IH } from "../IH/IH";
import { FSMModule } from "./FSMModule";

export class PlayerWallJumpFSM extends FSMModule {
    p:Player;
    ih:IH;

    WALLJUMP_SPEED_X:number = 100;
    WALLJUMP_SPEED_Y:number = 200;
    WALLJUMP_TIME:number = 300;

    DeltaJump:number = 0;
    lastFrameDown:boolean = false;
    jumpingUp:boolean = false;

    moduleStart() {
        this.p = this.parent as Player;
        this.ih = this.p.ih;
        this.p.sprite.setMaxVelocity(C.PLAYER_AIR_SPEED, C.MAX_Y_SPEED);
        this.p.sprite.setDragX(0);
        this.p.sprite.body.blocked.down = false;
        this.p.sprite.body.touching.down = false;
        this.DeltaJump = 0;
        // this.FirstPass = true;
        // this.jumpingUp = true;
        this.p.sprite.setVelocityY(this.WALLJUMP_SPEED_Y);
        this.p.sprite.setVelocityX(-this.WALLJUMP_SPEED_X);
        if(this.p.sprite.flipX)
            this.p.sprite.setVelocityX(this.WALLJUMP_SPEED_X);

    }

    update(dt: number): void {
        if(!this.p.ih.IsPressed('jump') || this.p.sprite.body.blocked.up)
            this.jumpingUp = false;
        if(this.DeltaJump <= this.WALLJUMP_TIME) {
            this.DeltaJump += dt;
        } else {
            this.jumpingUp = false;
        }

        if(this.jumpingUp) {
            this.p.sprite.setVelocityY(-C.PLAYER_JUMP_STR);
        }

        if(this.p.sprite.body.velocity.y >= 0) {
            console.log('Changing back to air.');
            this.parent.changeFSM('air');
        }

    }

    moduleEnd(args: any): void {
        this.p.sprite.setMaxVelocity(C.PLAYER_AIR_SPEED, C.MAX_Y_SPEED);
        this.p.sprite.setDragX(C.PLAYER_AIR_DRAG);

    }
}