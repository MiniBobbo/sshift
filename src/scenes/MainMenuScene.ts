import Phaser from "phaser";
import { C } from "../C";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;

    create() {
        if(C.gd == null) {
            C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));

        }

        this.Title = this.add.text(120,30, 'GAME TITLE').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);

        this.StartButton = this.CreateButton('Start Game', this.StartGame).setPosition(30,50);
        this.EraseButton = this.CreateButton('Erase Saved Data', this.EraseSaves).setPosition(200,200);

    }

    StartGame(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Start Button pressed');
        this.input.removeAllListeners();
        this.cameras.main.fadeOut(1000, 0,0,0);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ this.scene.start('game');})
    }

    EraseSaves(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Erase Saved Data Button Pressed');
        localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
    }

    update(time:number, dt:number) {

    }

    CreateButton(text:string, callback:any):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.text(0,0,text).setInteractive();
        t.on('pointerdown', callback, this);
        c.add(t);
        return c;
    }
}