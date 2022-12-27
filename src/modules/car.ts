import { hud } from "@dcl/builder-hud";
import { Delay, InterpolationType, KeepRotatingComponent, MoveTransformComponent } from "@dcl/ecs-scene-utils";
import { getUserData } from "@decentraland/Identity";
import { getPlayerData } from "@decentraland/Players";
import { movePlayerTo } from "@decentraland/RestrictedActions";
import { Camera } from "node_modules/decentraland-ecs/dist/index";
import { final } from "src/game";
import { Model } from "src/model";
import resources from "src/resources";
import { sceneMessageBus } from "./messageBus";

let CAR_Y = -0.01;
const CAR_Offset = 0.35
const car = new Model(resources.models.standard.carBody, {position: new Vector3(24.87,CAR_Y,10.32), rotation: Quaternion.Euler(0,180,0), scale: new Vector3(1.5,1.5,1.5)}, 'car')
const positions = [new Vector3(0.65,0.29,-1.55),new Vector3(0.65,0.29,0.85), new Vector3(-0.65,0.29,-1.55),new Vector3(-0.65,0.29,0.85)]
const spareWheel = new Model(resources.models.standard.carWheelLeft, {position: new Vector3(0.15,0.49,1.35),rotation: Quaternion.Euler(0,0,270)},'sparewheel' )
spareWheel.setParent(car)


const carCollider = new Entity('carCollider')
carCollider.addComponent(resources.models.standard.carBodyCollider)
carCollider.addComponent(new Transform({}))
carCollider.setParent(car)
hud.attachToEntity(carCollider)

function carColliderUpdate(option: 'remove' | 'add'){
    if(option === 'add'){
        const carCollider = new Entity('carCollider')
        carCollider.addComponent(resources.models.standard.carBodyCollider)
        carCollider.addComponentOrReplace(new Transform({}))
        carCollider.setParent(car)
        engine.addEntity(carCollider)
    }else if(option === 'remove'){
        engine.removeEntity(carCollider)
    }    
}

hud.attachToEntity(spareWheel)
const wheels:any = []
for(let i=0; i < positions.length; i++){
    let wheel;
    if(i < 2){
        wheel = new Model(resources.models.standard.carWheelRight, {position: positions[i]}, `Wheel${i+1}`)
    }else{
        wheel = new Model(resources.models.standard.carWheelLeft, {position: positions[i]}, `Wheel${i+1}`)
    }
    wheels.push(wheel)
    wheel.setParent(car)
}
// hud.attachToEntity(wheel)
const trunk = new Model(resources.models.standard.carTrunk, {position: new Vector3(0,0.856,1.314)}, 'trunk')
trunk.addComponent(new Animator())
trunk.getComponent(Animator).getClip('open_boot').looping = false
trunk.getComponent(Animator).getClip('close_boot').looping = false
sceneMessageBus.on('add_open_trunk',()=>{
        trunk.addComponent(new OnPointerDown((e)=>{
            trunk.getComponent(Animator).getClip('open_boot').play();
            spareWheel.addComponent(new OnPointerDown(()=>{
                
                trunk.getComponent(Animator).getClip('close_boot').play()
                
                carFixed()
                engine.removeEntity(spareWheel)
            },{
                button: ActionButton.PRIMARY,
                hoverText: 'Fix flat tire'
            }))
            },{
                button: ActionButton.SECONDARY,
                hoverText: 'Open Trunk'
            }))
})
trunk.setParent(car)
hud.attachToEntity(car)
hud.attachToEntity(trunk)

function startCar(){
    car.addComponent(new MoveTransformComponent(new Vector3(24.87,CAR_Y,10.32), new Vector3(24.87,CAR_Y,34.5), 42,()=>{
    car.addComponentOrReplace(new Transform({position: new Vector3(24.87,CAR_Y,34.5), rotation: Quaternion.Euler(359.001,180.052,357), scale: new Vector3(1.5,1.5,1.5)}))

    car.addComponent(new Delay(2000,()=>{
        movePlayerTo({x:23, y: 1, z:34.5})     
        CAR_Y -= CAR_Offset 
        car.getComponent(Transform).position.y = CAR_Y   
    }))
    engine.addEntity(carCollider)        
    sceneMessageBus.emit('add_open_trunk',null)    
    },InterpolationType.EASEINSINE))
    wheels.forEach(wheel=>{
        wheel.addComponent(new KeepRotatingComponent(Quaternion.Euler(-90, 0, 0)))
        wheel.addComponent(new Delay(20000,()=>{
            wheel.getComponent(KeepRotatingComponent).stop()
        }))
    })
    
}

function carFixed(){
    carColliderUpdate('remove')
    final.getComponent(AudioSource).playOnce()
    car.addComponentOrReplace(new Transform({position: new Vector3(24.87,CAR_Y,34.5), rotation: Quaternion.Euler(0,180,0), scale: new Vector3(1.5,1.5,1.5)}))
    CAR_Y += CAR_Offset
    car.addComponent(new Delay(2000,()=>{
        movePlayerTo({x:25.52, y: 1, z:35})
        carColliderUpdate('add')
        car.addComponent(new MoveTransformComponent(new Vector3(24.87,CAR_Y,34.5), new Vector3(24.87,CAR_Y,55), 20,()=>{
            CAR_Y -= CAR_Offset 
            car.getComponent(Transform).position.y = CAR_Y  
            movePlayerTo({x:22, y: 1, z:55})
        }))
    }))

}

const carModArea = new Entity('mod')
carModArea.addComponent(
    new CameraModeArea({
        area: { box: new Vector3(1.6, 4, 2) },
        cameraMode: CameraMode.FirstPerson,
    })
)

carModArea.setParent(car)
export const tramScript = new Entity()
tramScript.addComponent(new AudioSource(new AudioClip('sounds/neha_script/tram_walkie.mp3')))
tramScript.getComponent(AudioSource).volume = 0.5;
tramScript.addComponent(new Transform())
engine.addEntity(tramScript)
tramScript.setParent(Attachable.AVATAR)

sceneMessageBus.on('get_in_car',()=>{
    tramScript.getComponent(AudioSource).playOnce();

    // movePlayerTo({x:24.36, y:-1,z:10.8})
    movePlayerTo({x:25.52, y:-1,z:10.8})
    carColliderUpdate('add')
    sceneMessageBus.emit('hide_neha', null)
    const nehaSitting = new Model(resources.models.standard.nehaSitting, {position: new Vector3(0.4,0,-0.28), rotation: Quaternion.Euler(340,180,0), scale: new Vector3(0.8,0.8,0.8)},'neha')
    nehaSitting.setParent(car)
    CAR_Y += CAR_Offset
    car.getComponent(Transform).position.y = CAR_Y
    const playerCollider = new Model(resources.models.standard.playerCollider,{position: new Vector3(0,0.1,0)},'player')
    playerCollider.setParent(car)
    hud.attachToEntity(playerCollider)
    startCar()
})

const playerCollider = new Model(resources.models.standard.playerCollider,{position: new Vector3(0,0.1,0)},'player')
playerCollider.setParent(car)
hud.attachToEntity(playerCollider)


// sceneMessageBus.emit('get_in_car',null)

