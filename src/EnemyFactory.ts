import { IH } from "./IH/IH";
import { C } from "./C";
import { GameScene } from "./scenes/GameScene";
import { Entity } from "./entities/Entity";

export class EnemyFactory {
    static CreateEnemy(scene:Phaser.Scene, ih:IH, o:any):Entity {
        let gs:GameScene = scene as GameScene;
        let pos = C.RoundToTile(o.x,o.y);
        switch (o.type) {

            default:
                return new Entity(scene, ih);
                break;
        }
    }
}