import { textChangeRangeIsUnchanged } from "typescript";
import { C } from "../C";
import { MainChar } from "../entities/MainChar";

export class TestScene extends Phaser.Scene {
    g:Phaser.GameObjects.Graphics;
    PointerOffset:{x:number, y:number};
    Pointer:Phaser.GameObjects.Image;
    Attack:Phaser.Physics.Arcade.Image;
    D1:Phaser.Physics.Arcade.Image;
    D2:Phaser.Physics.Arcade.Image;
    p:MainChar;
    t:Phaser.GameObjects.Text;

    create() {
        this.g = this.add.graphics();
        this.g.fillStyle(0x333388);
        this.g.fillRect(0,0,360,270);
        this.g.fillStyle(0x000000);
        this.g.fillRect(360,0,130,270);
        this.PointerOffset = {x:0, y:0};
        this.Pointer = this.add.image(0,0, 'pointer').setDepth(1000).setScrollFactor(0,0);

        this.Attack = this.physics.add.image(0,0, 'atlas').setVisible(false).setCircle(12);
        this.Attack.setOffset(this.Attack.width/2 - this.Attack.body.width/2, this.Attack.height/2- this.Attack.body.height/2);
        this.D1 = this.physics.add.image(0,0, 'atlas').setVisible(false).setCircle(8);
        this.D1.setOffset(this.D1.width/2 - this.D1.body.width/2, this.D1.height/2- this.D1.body.height/2);
        this.D2 = this.physics.add.image(0,0, 'atlas').setVisible(false).setCircle(8);
        this.D2.setOffset(this.D2.width/2 - this.D2.body.width/2, this.D2.height/2- this.D2.body.height/2);

        this.g.fillStyle(0x883333);
        this.g.fillRect(100,100,16,16);

        this.p = new MainChar(this);
        this.p.sprite.setPosition(100,100).setVisible(false);

        this.t = this.add.text(0,0,'');

        // Pointer lock will only work after an 'engagement gesture', e.g. mousedown, keypress, etc.
        this.input.on('pointerdown', (pointer:Phaser.Input.Pointer) => {
            if(!this.input.mouse.locked)
            this.input.mouse.requestPointerLock();
            else {
                // console.log(`Buton pressed ${pointer.button}`);
                // if(pointer.button == 0)
                // this.player.LaunchAttack();
                // else
                // this.LaunchDefense();
            }
        }, this);

        this.events.on('preupdate', this.preupdate, this);

        this.events.on('debug', (t:string, reset:boolean = false) => {  if(reset) this.t .text = "";  this.t.text += t;  });
        // // When locked, you will have to use the movementX and movementY properties of the pointer
        // // (since a locked cursor's xy position does not update)
        this.input.on('pointermove', (pointer) => {

        if (this.input.mouse.locked)
        {
            this.PointerOffset.x += pointer.movementX * C.MOUSE_SENSITIVITY;
            this.PointerOffset.y += pointer.movementY * C.MOUSE_SENSITIVITY;
        }
        }, this);

    }


    preupdate(time:number, dt:number) {
        if(this.PointerOffset == null)
        return;
        this.PointerOffset.x = Phaser.Math.Clamp(this.PointerOffset.x, 0,360);
        this.PointerOffset.y = Phaser.Math.Clamp(this.PointerOffset.y, 0,270);

        this.Pointer.setPosition(this.PointerOffset.x, this.PointerOffset.y);

    }

    update() {
        this.events.emit('debug', `s: ${this.p.sprite.x}, ${this.p.sprite.y}\n`, true);
        this.events.emit('debug', `b: ${this.p.sprite.body.x}, ${this.p.sprite.body.y}\n`);
        this.events.emit('debug', `p: ${this.Pointer.x}, ${this.Pointer.y}\n`);
    }
}