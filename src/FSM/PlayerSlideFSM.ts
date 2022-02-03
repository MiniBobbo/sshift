import { C } from "../C";
import { Player } from "../entities/Player";
import { IH } from "../IH/IH";
import { FSMModule } from "./FSMModule";

export class PlayerSlideFSM extends FSMModule {
    p:Player;
    ih:IH;
    moduleStart() {
        this.p = this.parent as Player;
        this.ih = this.p.ih;
        this.p.sprite.setMaxVelocity(C.PLAYER_SLIDE_SPEED, C.MAX_Y_SPEED);
        this.p.sprite.setDragX(C.PLAYER_SLIDE_DRAG);
        var s = C.PLAYER_SLIDE_SPEED;
        if(this.p.sprite.flipX)
            s *= -1;
        this.p.sprite.setVelocityX(s);
    }

    update(dt: number): void {
        if(this.ih.IsJustPressed('jump')) {
            this.parent.changeFSM('air');
            this.p.sprite.setVelocityY(-C.PLAYER_JUMP_STR);
            this.p.sprite.y -= 1;
            this.p.sprite.body.touching.down = false;
            this.p.sprite.body.blocked.down = false;
            return;
        }

        if( !this.p.sprite.body.blocked.down) {
            this.parent.changeFSM('air');
            return;
        }

        if(Math.abs(this.p.sprite.body.velocity.x) < 100)
            this.parent.changeFSM('ground');

    }

    moduleEnd(args: any): void {
        this.p.sprite.setMaxVelocity(C.PLAYER_GROUND_SPEED, C.MAX_Y_SPEED);
        this.p.sprite.setDragX(C.PLAYER_GROUND_DRAG);

    }
}