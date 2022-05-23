import { Entity } from "./Entity";
import { C } from "../C";
import { PlayerMoveFSM } from "../FSM/PlayerMoveFSM";
import { PlayerRollFSM } from "../FSM/PlayerRoll";
import { PlayerAttackFSM } from "../FSM/PlayerAttackFSM";

export class Player extends Entity {
    Attack:Phaser.Physics.Arcade.Image;
    D1:Phaser.Physics.Arcade.Image;
    D2:Phaser.Physics.Arcade.Image;
    //The angle that this player is facing, in radians.  
    Facing:number;

    constructor(scene:Phaser.Scene) {
        super(scene);
        this.hp = 5;
        this.maxhp = 5;
        this.flashTime = 1000;
        this.sprite.setCircle(8);
        this.sprite.name = 'player';
        this.sprite.setVisible(false);
        this.sprite.setGravityY(0);
        this.sprite.setDepth(5);
        this.PlayAnimation('stand');
        this.fsm.addModule('move', new PlayerMoveFSM(this));
        this.fsm.addModule('roll', new PlayerRollFSM(this));
        this.fsm.addModule('attack', new PlayerAttackFSM(this));
        this.fsm.changeModule('move');
        this.gs.collideMap.add(this.sprite);

        this.Attack = this.gs.physics.add.image(0,0, 'atlas').setVisible(false).setCircle(12);
        this.Attack.setOffset(this.Attack.width/2 - this.Attack.body.width/2, this.Attack.height/2- this.Attack.body.height/2);
        this.D1 = this.gs.physics.add.image(0,0, 'atlas').setVisible(false).setCircle(8);
        this.D1.setOffset(this.D1.width/2 - this.D1.body.width/2, this.D1.height/2- this.D1.body.height/2);
        this.D2 = this.gs.physics.add.image(0,0, 'atlas').setVisible(false).setCircle(8);
        this.D2.setOffset(this.D2.width/2 - this.D2.body.width/2, this.D2.height/2- this.D2.body.height/2);

    }

    Update(time:number, dt:number) {
        super.Update(time, dt);
    }




}