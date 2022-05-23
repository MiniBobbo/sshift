import { C } from "../C";
import { PlayerMoveFSM } from "../FSM/PlayerMoveFSM";
import { IH } from "../IH/IH";
import { Entity } from "./Entity";

export class MainChar extends Entity {
    constructor(scene:Phaser.Scene) {
        super(scene);
        this.hp = 5;
        this.maxhp = 5;
        this.flashTime = 1000;
        // this.gs.collideMap.add(this.sprite);
        this.sprite.setCircle(8);
        this.sprite.name = 'player';
        this.sprite.setVisible(false);
        this.sprite.setGravityY(0);
        this.sprite.setDepth(5);
        this.PlayAnimation('stand');
        this.fsm.addModule('move', new PlayerMoveFSM(this));
        this.fsm.changeModule('move');
        this.gs.collideMap.add(this.sprite);
    }
}