
import resources from './resources'
import { hud } from '@dcl/builder-hud'
import { Delay, TriggerBoxShape, TriggerComponent } from '@dcl/ecs-scene-utils'
import { neha } from './modules/NPC'
import { Model } from './model'
import { GAME_STATE } from './gameState'
import { sceneMessageBus } from './modules/messageBus'
import { CheckWeather, CurrentWeather, LightningSystem } from './modules/weather'
import { FallSystem, SpawnSystem } from './modules/precipitation'
import { RotateSystem } from './modules/flakeRotation'
import { CreateSound } from './modules/sound'

export const multiplex = new Model(new GLTFShape("models/BaseLayout_updated.glb"),{
  position: new Vector3(0, -0.5, 0),
  scale: new Vector3(1, 1, 1),
  rotation: Quaternion.Euler(0,180,0)
})
// multiplex.setParent(_scene)

export const trees = new Model(new GLTFShape("models/trees_updated.glb"),{
  position: new Vector3(0, 0, 0),
  scale: new Vector3(1, 1, 1),
})
trees.setParent(multiplex)

// Rock
// Configuration
const Z_OFFSET = 1.5
const GROUND_HEIGHT = 0

const roadSpikes = new Model(resources.models.standard.roadSpikes, {scale:new Vector3(2,2,2),position: new Vector3(23.65,0.2,37.41)},'rock')
hud.attachToEntity(roadSpikes)

// Sounds
export const pickUpSound = CreateSound(new AudioClip('sounds/pickUp.mp3'))
pickUpSound.setParent(Attachable.AVATAR)

export const putDownSound = CreateSound(new AudioClip('sounds/putDown.mp3'))
putDownSound.setParent(Attachable.AVATAR)

export const wellDone = CreateSound(new AudioClip('sounds/neha_script/flat_tyre_walkie.mp3'))
wellDone.getComponent(AudioSource).volume = 0.5;
// wellDone.setParent(Attachable.AVATAR)

export const final = CreateSound(new AudioClip('sounds/neha_script/final_walkie.mp3'))
final.getComponent(AudioSource).volume = 0.5;
// final.setParent(Attachable.AVATAR)

roadSpikes.addComponent(new OnPointerDown( (e) => {
  const transform = roadSpikes.getComponent(Transform)
  if (!roadSpikes.isGrabbed) {
    roadSpikes.isGrabbed = true
    pickUpSound.getComponent(AudioSource).playOnce()
    // Calculates the roadSpikes's position relative to the camera
    transform.position = Vector3.Zero()
    transform.rotation = Quaternion.Zero()
    transform.position.z += Z_OFFSET
    roadSpikes.setParent(Attachable.AVATAR)
    wellDone.getComponent(AudioSource).playOnce()
  } else {
    roadSpikes.isGrabbed = false
    putDownSound.getComponent(AudioSource).playOnce()

    // Calculate rock's ground position
    roadSpikes.setParent(null) // Remove parent
    const forwardVector: Vector3 = Vector3.Forward()
      .scale(Z_OFFSET)
      .rotate(Camera.instance.rotation)
    transform.position = Camera.instance.position.clone().add(forwardVector)
    transform.lookAt(Camera.instance.position)
    transform.rotation.x = 0
    transform.rotation.z = 0
    transform.position.y = GROUND_HEIGHT + 0.2
    GAME_STATE.rockPickedUp = true;
  }
},
{
  button: ActionButton.PRIMARY,
  hoverText: 'Pick Up / Put Down',
  distance: 5
}))


let bellSound = new AudioClip('sounds/train-bell.mp3')


const triggerEntity = new Entity();
triggerEntity.addComponent(new AudioSource(bellSound))
triggerEntity.addComponent(new Transform({position:new Vector3(24,2,9.5),scale:new Vector3(2,1,2)}))
triggerEntity.addComponent(new TriggerComponent(new TriggerBoxShape(new Vector3(4,2,2)),{
  onCameraEnter() {
     triggerEntity.addComponent(new Delay(2000,()=>{
      triggerEntity.getComponent(AudioSource).playOnce()
      GAME_STATE.tramStarted = true;
      // neha.activate() 
     }))
  },
  onCameraExit() {
      engine.removeEntity(triggerEntity)
  }
}))


const rockTrigger = new Entity('rockTrigger')
rockTrigger.addComponent(new AudioSource(bellSound))
rockTrigger.addComponent(new Transform({position:new Vector3(22.6,2,33),scale:new Vector3(2,1,2)}))
rockTrigger.addComponent(new TriggerComponent(new TriggerBoxShape(new Vector3(4,2,2)),{
  onCameraEnter() {     
    rockTrigger.getComponent(AudioSource).playOnce()
  },
  onCameraExit() {
      engine.removeEntity(rockTrigger)
  },
}))

engine.addEntity(rockTrigger)

// dummy Collider

export const collider = new Entity('collider')
const plane = new PlaneShape()
const transparentMaterial = new Material()
// transparentMaterial.albedoColor = Color4.Black()
transparentMaterial.albedoColor = Color4.FromHexString('00FFFFFF')
transparentMaterial.transparencyMode = 2
collider.addComponent(new Transform({position: new Vector3(11,1.2,9.5), rotation: Quaternion.Euler(0,270,0), scale: new Vector3(9,2.5,1)}))
collider.addComponent(plane)
collider.addComponent(transparentMaterial)

// engine.addEntity(collider)
hud.attachToEntity(collider)

const weatherObject = new CurrentWeather()

// ADD CLOUDS

const clouds = new Entity('cloud')
clouds.addComponent(
  new Transform({
    position: new Vector3(16, 10, 8),
    scale: new Vector3(4, 4, 6),
    rotation: Quaternion.Euler(0,270,0)
  })
)
engine.addEntity(clouds)

hud.attachToEntity(clouds)
weatherObject.clouds = clouds

const rainSound = new AudioSource(new AudioClip('sounds/heavy_rain.mp3'))
clouds.addComponent(rainSound)

const lightningModels: GLTFShape[] = []
for (let i = 1; i < 6; i++) {
  const modelPath = 'models/ln' + i + '.gltf'
  const lnModel = new GLTFShape(modelPath)
  lightningModels.push(lnModel)
}

// ADD LIGHTNING ENTITY

const lightning = new Entity()
lightning.addComponent(new Transform())
lightning.getComponent(Transform).position.set(16, 10, 8)
lightning.getComponent(Transform).scale.setAll(5)
engine.addEntity(lightning)
// ADD SYSTEMS
const checkWeatherSystem = new CheckWeather(weatherObject)
const fallSystem = new FallSystem()
const rotateSystem = new RotateSystem()
const spawnSystem = new SpawnSystem(weatherObject)
const lightningSystem = new LightningSystem(weatherObject, lightning, lightningModels)
// sceneMessageBus.on('make_it_rain', ()=>{
//   engine.addSystem(checkWeatherSystem)
//   engine.addSystem(fallSystem)
//   engine.addSystem(rotateSystem)
//   engine.addSystem(spawnSystem)
//   engine.addSystem(lightningSystem)
// })

// sceneMessageBus.emit('make_it_rain', null)
// sceneMessageBus.on('stop_rain', ()=>{
//   engine.removeEntity(lightning)
//   engine.removeEntity(clouds)
//   engine.removeComponentGroup(drops)
//   engine.removeSystem(checkWeatherSystem)
//   engine.removeSystem(fallSystem)
//   engine.removeSystem(rotateSystem)
//   engine.removeSystem(spawnSystem)
//   engine.removeSystem(lightningSystem)
// })

// sceneMessageBus.emit('make_it_rain', null)