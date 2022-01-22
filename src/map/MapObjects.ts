import { Entity } from "../entities/Entity";

export class MapObjects {
    mapEntities:Array<Entity>;
    mapGameObjects:Array<Phaser.GameObjects.GameObject>;

    constructor() {
        this.mapEntities = [];
        this.mapGameObjects = [];
    }

    Destroy() {
        this.mapEntities.forEach(element => {
            element.dispose();
        });
        this.mapGameObjects.forEach(element => {
            element.destroy();
        });
    }
}