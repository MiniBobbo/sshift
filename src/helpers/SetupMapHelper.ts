import { forEachLeadingCommentRange } from "typescript";
import { C } from "../C";
import { Player } from "../entities/Player";
import { EntityInstance, LDtkMapPack } from "../map/LDtkReader";
import { MapObjects } from "../map/MapObjects";
import { GameScene } from "../scenes/GameScene";

export class SetupMapHelper {
    static CurrentCollider:Phaser.Physics.Arcade.Collider;


    static SetupMap(gs:GameScene, maps:LDtkMapPack):MapObjects {
        var mo = new MapObjects();

        gs.collideMap=[];

        maps.displayLayers.find((l:Phaser.Tilemaps.TilemapLayer) => {
            if(l.name == 'Bg')
                l.setDepth(0);
            if(l.name == 'Mg')
                l.setDepth(100);
            if(l.name == 'Fg')
                l.setDepth(200);
        });

        maps.collideLayer.setCollision([1,3]);

        gs.lights.enable();

        // gs.cameras.main.setBounds(0,-2000, maps.collideLayer.width, 2000);
        // gs.cameras.main.setBounds(0,0, maps.collideLayer.width, maps.collideLayer.height);


        this.CreateEntities(gs, maps, mo);
        this.CreatePhysics(gs,maps);

        return mo;
    }
    static CreateEntities(gs: GameScene, maps: LDtkMapPack, mo:MapObjects) {
        maps.entityLayers.entityInstances.forEach(element => {
            switch (element.__identifier) {
                case 'Text':
                        let message = element.fieldInstances[0];
                        let t = gs.add.bitmapText(element.px[0], element.px[1], '8px', message.__value as string)
                        .setMaxWidth(element.width).setDepth(150).setCenterAlign();
                        mo.mapGameObjects.push(t);
                break;
                default:
                    break;
            }
        });

    }

    static CreatePlayer(gs:GameScene, maps:LDtkMapPack) {
        let StartLocation = maps.entityLayers.entityInstances.find((i:EntityInstance) =>  i.__identifier === 'PlayerStart');
        gs.player = new Player(gs, gs.ih);
        gs.player.sprite.setPosition(StartLocation.px[0], StartLocation.px[1] + 6);
        // gs.player.sprite.alpha = 0;
        // gs.cameras.main.startFollow(gs.player.sprite);
    }

    static DestroyMap(gs:GameScene, maps:LDtkMapPack) {
        SetupMapHelper.CurrentCollider.destroy();
        maps.Destroy();
    }

    static CreatePhysics(gs:GameScene, maps:LDtkMapPack) {
        this.CurrentCollider = gs.physics.add.collider(gs.collideMap, maps.collideLayer);

        //Set tile specific things here...

        // tiles.forEach(element => {
        //     if(element.index == 50) {
        //         let dz = gs.add.zone(element.pixelX + 5, element.pixelY + 8, 7, 4);
        //         gs.physics.world.enable(dz);
        //         gs.deathZones.push(dz);
        //     }
        //     else if(element.index == 69) {
        //         let dz = gs.add.zone(element.pixelX + 8, element.pixelY + 4, 4, 7);
        //         gs.physics.world.enable(dz);
        //         gs.deathZones.push(dz);
        //     }
        //     else if(element.index == 71) {
        //         let dz = gs.add.zone(element.pixelX+2, element.pixelY + 4, 4, 7);
        //         gs.physics.world.enable(dz);
        //         gs.deathZones.push(dz);
        //     }
        //     else if(element.index == 90) {
        //         let dz = gs.add.zone(element.pixelX + 5, element.pixelY+2, 7, 4);
        //         gs.physics.world.enable(dz);
        //         gs.deathZones.push(dz);
        //     }
        //     else if(element.index == 27) {
        //         let dz = gs.add.zone(element.pixelX, element.pixelY + 5, 10,5).setOrigin(0,0);
        //         gs.physics.world.enable(dz);
        //         gs.deathZones.push(dz);
        //         gs.extinguishZones.push(dz);
        //     }
        //     else if(element.index == 7) {
        //         let dz = gs.add.zone(element.pixelX, element.pixelY + 6, 10,4).setOrigin(0,0);
        //         gs.physics.world.enable(dz);
        //         gs.extinguishZones.push(dz);
        //     }

        // });

        //Create the physics for the new map here.

        // gs.physics.add.overlap(gs.player.sprite, gs.soakZones , () => { if(gs.player.holdingLight) gs.events.emit('flameoff');});
        // gs.physics.add.overlap(gs.player.sprite, gs.dangerSprites , () => {  gs.events.emit('playerdead');});
        // gs.physics.add.overlap(gs.player.sprite, gs.deathZones , () => {  gs.events.emit('playerdead');});
        // gs.physics.add.overlap(gs.flame.collision, gs.extinguishZones , () => {  gs.events.emit('flameoff');});



    }


}