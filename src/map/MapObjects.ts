import { Entity } from "../entities/Entity";

export class MapObjects {
    //What level do these map objects belong to?
    Level:string;
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

    SetEnabled(enable:boolean = true) {
        this.mapEntities.forEach(element => {
            element.SetEnabled(enable);
        });

    }
}