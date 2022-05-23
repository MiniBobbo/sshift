import { GameData } from "./GameData";

export class C {
    static currentLevel:string = 'Level_0';
    static previouslevel:string = 'start';
    static waypoint:string = '';

    static TILE_SIZE:number = 16;
    static GRAVITY:number = 1000;
    // static GRAVITY:number = 1000;
    static MAX_Y_SPEED:number = 500;
    static PLAYER_GROUND_SPEED:number = 100;
    static PLAYER_GROUND_ATTACK_SPEED:number = 50;
    static PLAYER_SLIDE_DRAG:number = 700;
    static PLAYER_SLIDE_SPEED:number = 300;
    static PLAYER_CLIMB_SPEED:number = 50;
    static PLAYER_AIR_SPEED:number = 100;
    static PLAYER_GROUND_ACCEL:number = 800;
    static PLAYER_AIR_ACCEL:number = 400;
    static PLAYER_GROUND_DRAG:number = 800;
    static PLAYER_AIR_DRAG:number = 400;
    static PLAYER_JUMP_STR:number = 200;
    static PLAYER_JUMP_TIME:number = 300;
    static PLAYER_ATTACK_TIME:number = 500;
    static PLAYER_LEAP_SPEED:number = 250;
    static PLAYER_LEAP_TIME:number = 300;
    static PLAYER_ROLL_SPEED:number = 75;
    static PLAYER_ROLL_TIME:number = 300;


    static PLAY_X:number = 360;
    static PLAY_Y:number = 270;

    static MOUSE_SENSITIVITY:number = .8;

    static FLAG_COUNT:number = 100;
    static gd:GameData;

    static GAME_NAME = 'InitialGame';

    static RoundToTile(x:number, y:number):{x:number, y:number} {
        let newX = 0;
        let newY = 0;
        newX = Math.floor(x/C.TILE_SIZE) * C.TILE_SIZE;
        newY = Math.floor(y/C.TILE_SIZE) * C.TILE_SIZE;
        return {x:newX, y:newY};
    }

    static GetTileFromPosition(x:number, y:number):{x:number, y:number} {
        let newX = 0;
        let newY = 0;
        newX = Math.floor(x/C.TILE_SIZE);
        newY = Math.floor(y/C.TILE_SIZE);
        return {x:newX, y:newY};

    }

    static checkFlag(flag:string):boolean {
        //@ts-ignore
        return this.gd.flags[flag];
    }
    static setFlag(flag:string, value:boolean) {
        //@ts-ignore
        this.gd.flags[flag] = value;
    }
}