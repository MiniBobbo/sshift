import { Entity } from "./Entity";
import { C } from "../C";
import { PlayerMoveFSM } from "../FSM/PlayerMoveFSM";
import { PlayerRollFSM } from "../FSM/PlayerRoll";
import { PlayerAttackFSM } from "../FSM/PlayerAttackFSM";
import { PlayerDefenseFSM } from "../FSM/PlayerDefenseFSM";
import { Signals } from "../Signals";
import { Sign } from "crypto";

export class Shooter extends Entity {

    private _shootTime:number = 1500;
    private _timer:Phaser.Time.TimerEvent;
    private _bullet_speed:number = 200;

    constructor(scene:Phaser.Scene) {
        super(scene);
        this.hp = 5;
        this.maxhp = 5;
        this.flashTime = 1000;
        this.sprite.setCircle(8);
        this.sprite.name = 'shooter';
        this.sprite.setVisible(false);
        this.sprite.setGravityY(0);
        this.sprite.setDepth(5);
        // this.PlayAnimation('stand');
        this._timer = this.gs.time.addEvent({
            delay:this._shootTime,
            callbackScope:this,
            loop:true,
            callback:() => {
                let a = this.gs.GetEnemyAttack();
                a.removeListener(Signals.CollideMap);
                a.removeListener(Signals.CollidePlayerDefense);
                a.enableBody(true, this.sprite.x, this.sprite.y, true, true);
                a.once(Signals.CollideMap, () => {a.disableBody(true, true);});
                a.once(Signals.CollidePlayerDefense, () => {a.disableBody(true,true);});

                // a.setPosition(this.sprite.x, this.sprite.y);
                let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, this.gs.player.sprite);
                this.gs.physics.moveTo(a, this.gs.player.sprite.x, this.gs.player.sprite.y, this._bullet_speed);
            }
        });
    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
    }




}