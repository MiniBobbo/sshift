import { forEachLeadingCommentRange, getJSDocTags } from "typescript";
import { C } from "../C";
import { Player } from "../entities/Player";
import { Shooter } from "../entities/Shooter";
import { EntityInstance, LDtkMapPack } from "../map/LDtkReader";
import { MapObjects } from "../map/MapObjects";
import { GameScene } from "../scenes/GameScene";

export class SetupMapHelper {
    static CurrentCollider:Phaser.Physics.Arcade.Collider;


    static SetupMap(gs:GameScene, maps:LDtkMapPack):MapObjects {
        var mo = new MapObjects();
        mo.Level = maps.level.identifier;

        maps.displayLayers.find((l:Phaser.Tilemaps.TilemapLayer) => {
            if(l.name == 'Bg')
                l.setDepth(0);
            if(l.name == 'Mg')
                l.setDepth(100);
            if(l.name == 'Fg')
                l.setDepth(200);
        });

        maps.collideLayer.setCollision([1,3]);

        this.CreateEntities(gs, maps, mo);
        this.CreatePhysics(gs,maps);

        return mo;
    }
    static CreateEntities(gs: GameScene, maps: LDtkMapPack, mo:MapObjects) {
        maps.entityLayers.entityInstances.forEach(element => {
            //Map Game Objects are display objects without the attached Entity object while the mapEntities are just for Entities 
            //It's obvious now, but I've had to look it up twice, so I figured I'd write it down. 
            switch (element.__identifier) {
                case 'Text':
                        let message = element.fieldInstances[0];
                        let t = gs.add.bitmapText(element.px[0], element.px[1], '8px', message.__value as string)
                        .setMaxWidth(element.width).setDepth(150).setCenterAlign();
                        mo.mapGameObjects.push(t);
                break;
                case 'Enemy':
                        let type = element.fieldInstances[0];
                        switch (type.__value) {
                            case 'Shooter':
                                    let b = new Shooter(gs);
                                    b.sprite.setPosition(element.px[0], element.px[1]);
                                    mo.mapEntities.push(b);
                                break;
                        
                            default:
                                break;
                        }
                default:
                    break;
            }
        });

    }

    static CreatePlayer(gs:GameScene, maps:LDtkMapPack) {
        let StartLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'PlayerStart');
        gs.player = new Player(gs);
        gs.player.sprite.setPosition(StartLocation.px[0], StartLocation.px[1] + 6);
    }

    static DestroyMap(gs:GameScene, maps:LDtkMapPack) {
        maps.Destroy();
    }

    static CreatePhysics(gs:GameScene, maps:LDtkMapPack) {
        //Set tile specific things here...
        maps.collideLayer.forEachTile(tile => {
            if (tile.index === 2)
            {
                tile.collideLeft = false;
                tile.collideRight = false;
                tile.collideDown = false;
            }
            });
    }
}