import { hud } from "@dcl/builder-hud";
import { Delay, FollowCurvedPathComponent, InterpolationType, KeepRotatingComponent, MoveTransformComponent, RotateTransformComponent } from "@dcl/ecs-scene-utils";
import { movePlayerTo } from "@decentraland/RestrictedActions";
import { Model } from "src/model";
import resources from "src/resources";
import { minakshi } from "./NPC";
import { CreateSound } from "./sound";

const helicopter = new Model(resources.models.standard.helicopterBase,
                            {
                              position: new Vector3(22.12,42.17,71.43),
                              rotation: Quaternion.Euler(0,0,0),
                              scale: new Vector3(1.2,1.2,1.2)
                            }, 'helicopter')

const helicopterMainRotor = new Model(resources.models.standard.helicopterMainRotor,{},'mainRotor')
helicopterMainRotor.addComponent(new KeepRotatingComponent(Quaternion.Euler(0, -90, 0)))

helicopter.addComponent(new Animator())
helicopter.getComponent(Animator).getClip('Blank').looping = false
helicopter.getComponent(Animator).getClip('helicopter_path').looping = false
helicopter.getComponent(Animator).getClip('Blank').play();

helicopterMainRotor.setParent(helicopter)
hud.attachToEntity(helicopter)


// TO VISUALIZE KEYFRAMES
// for(let i=0; i< 5; i++){
//   const model = new Model(resources.models.standard.helicopterBase, {position: new Vector3(22.12,42.17,71.43)}, `point${i+1}`)
//   hud.attachToEntity(model)
// }


// const heliPoints = [
//  {position: new Vector3(22.12,60.17,71.43), rotation: Quaternion.Euler(0,0,0), scale: new Vector3(1,1,1)},
//  {position: new Vector3(14.12,60.17,60.43), rotation: Quaternion.Euler(0,315,0), scale: new Vector3(1,1,1)},
//  {position: new Vector3(13.12,60.17,46.43), rotation: Quaternion.Euler(0,270,0), scale: new Vector3(1,1,1)},
//  {position: new Vector3(24.12,60.17,31.43), rotation: Quaternion.Euler(0,180,0), scale: new Vector3(1,1,1)},
//  {position: new Vector3(25.12,55.4,38.43), rotation: Quaternion.Euler(0,180,0), scale: new Vector3(1,1,1)},
//  {position: new Vector3(25.12,1.37,38.43), rotation: Quaternion.Euler(0,180,0), scale: new Vector3(1,1,1)},
// ]

const helicopterCollider = new Entity('helicopterCollider')
helicopterCollider.addComponent(resources.models.standard.helicopterCollider)
helicopterCollider.addComponent(new Transform({position: new Vector3(0,-0.3,0)}))
helicopterCollider.setParent(helicopter)
engine.addEntity(helicopterCollider)

function helicopterColliderUpdate(option: 'remove' | 'add'){
    if(option === 'add'){
        const helicopterCollider = new Entity('helicopterCollider')
        helicopterCollider.addComponent(resources.models.standard.helicopterCollider)
        helicopterCollider.addComponentOrReplace(new Transform({}))
        helicopterCollider.setParent(helicopter)
        engine.addEntity(helicopterCollider)
    }else if(option === 'remove'){
        engine.removeEntity(helicopterCollider)
    }    
}

helicopter.addComponent(new CameraModeArea({
  area:{box: new Vector3(1.7,1.7,8)},
  cameraMode: CameraMode.FirstPerson
}))

const playerColliderHeli = new Model(resources.models.standard.playerColliderHeli,{position: new Vector3(0,0.2,-1.7), rotation: Quaternion.Euler(0,0,0), scale: new Vector3(0.99,1.13,0.9)},'player12')
playerColliderHeli.setParent(helicopter)
hud.attachToEntity(playerColliderHeli)

// Rotate entity
hud.attachToEntity(helicopterCollider)
helicopter.addComponent(new OnPointerDown(()=>{   
  helicopterMainRotor.addComponentOrReplace(new KeepRotatingComponent(Quaternion.Euler(0, -180, 0)))
  movePlayerTo(new Vector3(22.48,42,68.81))
  const helicopterSound = CreateSound(new AudioClip('sounds/helicopter_loop.mp3'))
  helicopterSound.getComponent(AudioSource).volume = 0.5;
  helicopterSound.getComponent(AudioSource).loop = true;
  engine.removeEntity(minakshi)
  helicopterSound.getComponent(AudioSource).playing = true
  const minakshiSitting = new Model(resources.models.standard.minakshiSitting,{position: new Vector3(-0.4,-0.8,-2), rotation: Quaternion.Euler(335,180,0), scale: new Vector3(0.889,0.889,0.889)},'minakshi_heli')
    minakshiSitting.setParent(helicopter)
    hud.attachToEntity(minakshiSitting)
    const takeOff = [new Vector3(22.12,42.17,71.43),new Vector3(14.12,60.17,60.43)]
    const rotation = [
    new Vector3(14.12,60.17,60.43),
    new Vector3(13.12,60.17,46.43),
    new Vector3(24.12,60.17,31.43),
    new Vector3(25.12,15.17,10),
    new Vector3(25.12,15.17,28),
    new Vector3(25.12,15.17,38.43)
    ]
    const land = [new Vector3(25.12,15.17,38.43),
      new Vector3(25.12,1.37,38.43)]

    helicopter.addComponent(new MoveTransformComponent(takeOff[0], takeOff[1], 5, ()=>{
      helicopter.addComponent(new RotateTransformComponent(Quaternion.Euler(0, 0, 0),Quaternion.Euler(-15, -180, 0),15))
      helicopter.addComponentOrReplace(new FollowCurvedPathComponent(rotation, 20,200,false,false, ()=>{
          helicopter.addComponentOrReplace(
            new RotateTransformComponent(
                Quaternion.Euler(-15, -180, 0),
                Quaternion.Euler(0, -180, 0),
                5,()=>{},InterpolationType.EASEQUAD))

          helicopter.addComponent(new MoveTransformComponent(land[0], land[1], 10,()=>{
            helicopterSound.getComponent(AudioSource).playing = false
            helicopterMainRotor.addComponentOrReplace(new KeepRotatingComponent(Quaternion.Euler(0, -90, 0)))

          const minakshiScript = CreateSound(new AudioClip('sounds/minakshi_script/5.mp3'))
          minakshiScript.getComponent(AudioSource).volume = 0.5;
          minakshiScript.getComponent(AudioSource).playOnce()
          helicopter.addComponent(new Delay(20000,()=>{
               movePlayerTo(new Vector3(5.58,0.88,7.21)) 
              const collider = new Entity('collider')
              const plane = new PlaneShape()
              const transparentMaterial = new Material()
              // transparentMaterial.albedoColor = Color4.Black()
              transparentMaterial.albedoColor = Color4.FromHexString('00FFFFFF')
              transparentMaterial.transparencyMode = 2
              collider.addComponent(new Transform({position: new Vector3(11,1.2,9.5), rotation: Quaternion.Euler(0,270,0), scale: new Vector3(9,2.5,1)}))
              collider.addComponent(plane)
              collider.addComponent(transparentMaterial)        
              engine.addEntity(collider)           
          }))
        },InterpolationType.EASEQUAD))
      }))
    },InterpolationType.EASEINQUAD))
},
{
  button: ActionButton.SECONDARY,
  hoverText: 'Get in',
  distance: 6
}))

