import { Model } from "src/model";
import resources from "src/resources";
import { hud } from '@dcl/builder-hud'
import { Delay, InterpolationType, MoveTransformComponent, TriggerBoxShape, TriggerComponent } from "@dcl/ecs-scene-utils";
import { akhil } from "./NPC";


const lift = new Model(resources.models.standard.lift,
     { 
        position: new Vector3(29.21, 0.2, 65.2),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(1, 1, 1) 
    },
     'lift')
const liftTriggerDown = new Entity('liftTriggerDown')

const LIFT_SPEED = 50;

const liftDownTriggerBoxShape = new TriggerBoxShape(new Vector3(3, 1, 4), new Vector3(31.52,2,68.37))
const liftUpTriggerBoxShape = new TriggerBoxShape(new Vector3(3, 1, 4), new Vector3(23.92,2,65.20))
const liftExitTriggerBoxShape = new TriggerBoxShape( new Vector3(4.28,1.23,6.05), new Vector3(31.52,41.99,68.37))

const liftBaseEntity = new Entity('liftBase')
const liftBaseShape = new Entity('liftBase')
liftBaseShape.addComponent(new Transform({scale: new Vector3(4.28,0.2,6.05)}))
const liftBase = new BoxShape();
liftBase.withCollisions = true;
liftBaseShape.addComponent(liftBase)
liftBaseShape.setParent(liftBaseEntity)


liftTriggerDown.addComponent(new TriggerComponent(liftDownTriggerBoxShape,{
    onCameraEnter:()=>{
        const liftPosition = liftBaseEntity.getComponent(Transform).position.y
        if(liftPosition >= 40){
            liftBaseEntity.addComponent(new Delay(1000,()=>{
                liftBaseEntity.addComponent(new MoveTransformComponent(new Vector3(31.52,liftPosition,68.37), new Vector3(31.52,0.32,68.37), LIFT_SPEED,null,InterpolationType.EASEQUAD))
                akhil.addComponent(new MoveTransformComponent(new Vector3(32.92,liftPosition+0.1,66.39), new Vector3(32.92,0.4,66.39), LIFT_SPEED, null,InterpolationType.EASEQUAD))
            }))
        }else{
            liftBaseEntity.addComponent(new Delay(1000,()=>{
                liftBaseEntity.addComponent(new MoveTransformComponent(new Vector3(31.52,liftPosition,68.37), new Vector3(31.52,40.39,68.37), LIFT_SPEED, null,InterpolationType.EASEQUAD))
                akhil.addComponent(new MoveTransformComponent(new Vector3(32.92,liftPosition+0.1,66.39), new Vector3(32.92,40.5,66.39), LIFT_SPEED,null,InterpolationType.EASEQUAD))
            }))
        }
    },
    onCameraExit:()=>{
        // liftTriggerDown.addComponent(new Delay(8000,()=>{
        //     const liftPosition = liftBaseEntity.getComponent(Transform).position.y
        //     if(liftPosition >= 40){
        //         liftDownTriggerBoxShape.position = new Vector3(31.52,42.39,68.37)
        //     }else{
        //         liftDownTriggerBoxShape.position = new Vector3(31.52,2,68.37)
        //     }
        // }))
    },
    enableDebug: false
}))

const liftTriggerUp = new Entity('liftTriggerDown')


liftTriggerUp.addComponent(new TriggerComponent(liftUpTriggerBoxShape,{
    onCameraEnter:()=>{
        const liftPosition = liftBaseEntity.getComponent(Transform).position.y;
        if(liftPosition > 1){
            liftBaseEntity.getComponent(Transform).position.y = 0.32
            liftDownTriggerBoxShape.position = new Vector3(31.52,2,68.37)
        }
    },
    enableDebug: false
}))

engine.addEntity(liftTriggerDown)
engine.addEntity(liftTriggerUp)


const liftExitTrigger = new Entity('trigger leave')

liftExitTrigger.addComponent(new Transform({position: Vector3.Zero()}))

liftExitTrigger.addComponent(new TriggerComponent(liftExitTriggerBoxShape, {
    onCameraExit(){
        const liftPosition = liftBaseEntity.getComponent(Transform).position.y
            if(liftPosition === 40.39){
                liftDownTriggerBoxShape.position = new Vector3(31.52,42.39,68.37)
                liftExitTriggerBoxShape.position = new Vector3(31.52,2,68.37)
            }else if(liftPosition < 1){
                liftDownTriggerBoxShape.position = new Vector3(31.52,2.5,68.37)
                liftExitTriggerBoxShape.position = new Vector3(31.52,41.99,68.37)
            }
    },enableDebug: false
}))

engine.addEntity(liftExitTrigger)

void hud.attachToEntity(liftExitTrigger)

// -2.3,1,-3.19w
// 24.26,1.18,70.68
liftBaseEntity.addComponent(new Transform({position: new Vector3(31.52,0.32,68.37), rotation: Quaternion.Euler(0,0,0)}))
// liftBaseEntity.setParent(lift);
// LIFT TRIGGER ENTITY
// liftBaseEntity.addComponent(new OnPointerDown((e)=>{
//     const liftPosition = liftBaseEntity.getComponent(Transform).position.y
//     if(liftPosition >= 40){
//         liftBaseEntity.addComponent(new MoveTransformComponent(new Vector3(31.52,liftPosition,68.37), new Vector3(31.52,0.32,68.37), 5))
//     }else{
//         liftBaseEntity.addComponent(new MoveTransformComponent(new Vector3(31.52,liftPosition,68.37), new Vector3(31.52,40.39,68.37), 5))
//     }
// }))
engine.addEntity(liftBaseEntity)
void hud.attachToEntity(liftBaseEntity)


engine.addEntity(lift)

// const liftStand = new Model(resources.models.standard.liftSwitchStand, {},'liftStand')
// const liftSwitchRed = new Model(resources.models.standard.liftButton_red, {},'liftRed')
// const liftSwitchGreen = new Model(resources.models.standard.liftButton_green, {},'liftGreen')

// liftStand.setParent(liftBaseEntity)
// liftSwitchRed.setParent(liftBaseEntity)
// liftSwitchGreen.setParent(liftBaseEntity)
// hud.attachToEntity(liftStand)
// hud.attachToEntity(liftSwitchRed)
// hud.attachToEntity(liftSwitchGreen)


// import { Model } from "src/model";
// import resources from "src/resources";
// import { hud } from '@dcl/builder-hud'
// import { MoveTransformComponent, TriggerBoxShape, TriggerComponent } from "@dcl/ecs-scene-utils";
// import { akhil } from "./dialogData";

// const lift = new Model(resources.standard.lift,
//      { 
//         position: new Vector3(29.21, 0.2, 65.2),
//         rotation: Quaternion.Euler(0, 180, 0),
//         scale: new Vector3(1, 1, 1) 
//     },
//      'lift')

// const liftBaseEntity = new Entity('liftBase')
// const liftBase = new BoxShape();
// liftBase.withCollisions = true;
// liftBaseEntity.addComponent(liftBase)
// // -2.3,1,-3.19w
// // 24.26,1.18,70.68
// liftBaseEntity.addComponent(new Transform({position: new Vector3(31.52,0.32,68.37), rotation: Quaternion.Euler(0,0,0), scale: new Vector3(4.28,0.2,6.05)}))
// // liftBaseEntity.setParent(lift);
// liftBaseEntity.addComponent(new OnPointerDown((e)=>{
//     const liftPosition = liftBaseEntity.getComponent(Transform).position.y
//     if(liftPosition >= 40){
//         liftBaseEntity.addComponent(new MoveTransformComponent(new Vector3(31.52,liftPosition,68.37), new Vector3(31.52,0.32,68.37), 5))
//        akhil.addComponent(new MoveTransformComponent(new Vector3(31.52,40.5,68.37), new Vector3(31.52,0.4,68.37), 5))
//     }else{
//         liftBaseEntity.addComponent(new MoveTransformComponent(new Vector3(31.52,liftPosition,68.37), new Vector3(31.52,40.39,68.37), 5))
//        akhil.addComponent(new MoveTransformComponent(new Vector3(31.52,1,68.37), new Vector3(31.52,40.5,68.37), 5))
//     }
// }))
// engine.addEntity(liftBaseEntity)
// // hud.attachToEntity(liftBaseEntity)


// engine.addEntity(lift)









    //    akhil.addComponent(new MoveTransformComponent(new Vector3(31.52,40.5,68.37), new Vector3(31.52,0.4,68.37), 5))
    //    akhil.addComponent(new MoveTransformComponent(new Vector3(31.52,1,68.37), new Vector3(31.52,40.5,68.37), 5))
