import { IFSM } from "./FSM";
import { FSMModule } from "./FSMModule";
import { Entity } from "../entities/Entity";

export class StunFSM extends FSMModule {
    parent!:IFSM;
    stunTime!:number;
    returnFSM!:string;
    e:Entity;
    oldDrag!:number;
    constructor(parent:IFSM) {
        super(parent);
        this.e = parent as Entity;
    }

    moduleStart(args:{stunTime:number, returnFSM:string, stunDir?:{x:number, y:number}}) {
        this.stunTime = args.stunTime;
        this.returnFSM = args.returnFSM;
        // this.oldDrag = this.e.sprite.
        if(args.stunDir != null)
            this.e.sprite.setVelocity(args.stunDir.x, args.stunDir.y);
        this.e.PlayAnimation('stun');

    }

    moduleEnd(args?:any) {
        this.stunTime = 0;
    }

    update(dt:number) {
        
        this.stunTime -= dt;
        if(this.stunTime <= 0)
            this.parent.changeFSM(this.returnFSM);
    }





}