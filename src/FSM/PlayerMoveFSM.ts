import { C } from "../C";
import { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { SceneEvents } from "../events/SceneEvents";
import { IH } from "../IH/IH";
import { FSMModule } from "./FSMModule"

export class PlayerMoveFSM extends FSMModule {
    e!:Player;
    ih!:IH;
    
    moduleStart() {
        this.e = this.parent as Player;
        this.ih = this.e.ih;
        this.e.sprite.setMaxVelocity(C.PLAYER_GROUND_SPEED);
        this.e.sprite.setDrag(C.PLAYER_GROUND_DRAG);

        this.e.gs.events.on(SceneEvents.Button_1_Pressed, this.TryAttack, this);
        this.e.gs.events.on(SceneEvents.Button_2_Pressed, this.TryDefense, this);
    }

    TryAttack() {
        this.LaunchAttack();
    }

    TryDefense() {
        this.LaunchDefense();
    }

    moduleEnd() {
        this.e.gs.events.removeListener(SceneEvents.Button_1_Pressed, this.TryAttack, this);
        this.e.gs.events.removeListener(SceneEvents.Button_2_Pressed, this.TryDefense, this);

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

    LaunchAttack() {
        let o = new Phaser.Math.Vector2(12,0);
        // o.rotate(Phaser.Math.RadToDeg(angle));
        o.rotate(this.e.Facing);
        let bonusx = 0;
        let bonusy = 0;
        // if(p.x > this.sprite.x)
        // bonusx++;
        // if(p.y > this.sprite.y)
        // bonusy++;

        let p:{x:number, y:number} = {x:0, y:0};

        p.x = this.e.sprite.x + o.x;
        p.y = this.e.sprite.y + o.y;

        this.e.Attack.setPosition(p.x + bonusx, p.y + bonusy);
        this.parent.changeFSM('attack');
        // this.g.lineBetween(this.sprite.x, this.sprite.y, this.gs.Pointer.x, this.gs.Pointer.y);
    }

    LaunchDefense() {

        // this.g.clear();
        // let p = {x:this.gs.Pointer.x + this.gs.cameras.main.scrollX, y:this.gs.Pointer.y + this.gs.cameras.main.scrollY};
        // let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, p);
        let o = new Phaser.Math.Vector2(8, 3);
        let o2 = new Phaser.Math.Vector2(8, -3);
        // // o.rotate(Phaser.Math.RadToDeg(angle));
        o.rotate(this.e.Facing);
        o2.rotate(this.e.Facing);
        // let bonusx = 0;
        // let bonusy = 0;
        // if(p.x > this.sprite.x)
        // bonusx++;
        // if(p.y > this.sprite.y)
        // bonusy++;
        let p:{x:number, y:number} = {x:0, y:0};

        p.x = this.e.sprite.x  + o.x;
        p.y = this.e.sprite.y + o.y;
        this.e.D1.setPosition(p.x , p.y);
        p.x = this.e.sprite.x + o2.x;
        p.y = this.e.sprite.y + o2.y;
        this.e.D2.setPosition(p.x , p.y);

        this.parent.changeFSM('defense');

    }

}