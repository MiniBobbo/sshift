import { Entity } from "./Entity";
import { C } from "../C";
import { PlayerMoveFSM } from "../FSM/PlayerMoveFSM";

export class Player extends Entity {
    Attack:Phaser.Physics.Arcade.Image;
    D1:Phaser.Physics.Arcade.Image;
    D2:Phaser.Physics.Arcade.Image;

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

    LaunchAttack() {

        let p = {x:this.gs.Pointer.x + this.gs.cameras.main.scrollX, y:this.gs.Pointer.y + this.gs.cameras.main.scrollY};
        let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, p);
        let o = new Phaser.Math.Vector2(12,0);
        // o.rotate(Phaser.Math.RadToDeg(angle));
        o.rotate(angle);
        let bonusx = 0;
        let bonusy = 0;
        if(p.x > this.sprite.x)
        bonusx++;
        if(p.y > this.sprite.y)
        bonusy++;

        p.x = this.sprite.x + o.x;
        p.y = this.sprite.y + o.y;

        this.Attack.setPosition(p.x + bonusx, p.y + bonusy);
        // this.g.lineBetween(this.sprite.x, this.sprite.y, this.gs.Pointer.x, this.gs.Pointer.y);
    }

    LaunchDefense() {

        // this.g.clear();
        let p = {x:this.gs.Pointer.x + this.gs.cameras.main.scrollX, y:this.gs.Pointer.y + this.gs.cameras.main.scrollY};
        let angle = Phaser.Math.Angle.BetweenPoints(this.sprite, p);
        let o = new Phaser.Math.Vector2(8, 3);
        let o2 = new Phaser.Math.Vector2(8, -3);
        // o.rotate(Phaser.Math.RadToDeg(angle));
        o.rotate(angle);
        o2.rotate(angle);
        let bonusx = 0;
        let bonusy = 0;
        if(p.x > this.sprite.x)
        bonusx++;
        if(p.y > this.sprite.y)
        bonusy++;

        p.x = this.sprite.x  + o.x;
        p.y = this.sprite.y + o.y;
        this.D1.setPosition(p.x + bonusx, p.y + bonusy);
        p.x = this.sprite.x + o2.x;
        p.y = this.sprite.y + o2.y;
        this.D2.setPosition(p.x + bonusx, p.y + bonusy);
    }



}