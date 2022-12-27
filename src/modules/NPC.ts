import { hud } from '@dcl/builder-hud'
import { Delay } from '@dcl/ecs-scene-utils'
import { Dialog, NPC} from '@dcl/npc-scene-utils'
import { movePlayerTo, PredefinedEmote, triggerEmote } from '@decentraland/RestrictedActions'
import { collider} from 'src/game'
import { GAME_STATE } from 'src/gameState'
import { Model } from 'src/model'
import resources from 'src/resources'
import { sceneMessageBus } from './messageBus'
import { CreateSound } from './sound'

const Z_OFFSET = 1.5
const GROUND_HEIGHT = 0

const umbrella1 = new Model(resources.models.standard.umbrela, {}, 'umbrella1')
umbrella1.addComponent(new Animator())
umbrella1.getComponent(Animator).addClip(new AnimationState('umbrela'))
umbrella1.getComponent(Animator).addClip(new AnimationState('idle'))
umbrella1.getComponent(Animator).getClip('umbrela').looping = false;
umbrella1.getComponent(Animator).getClip('idle').play()

const umbrella = new Model(resources.models.standard.umbrela, {position: new Vector3(0,0,0), rotation: Quaternion.Euler(15,345,90), scale: new Vector3(1,1,1)})
umbrella.addComponent(new Animator().addClip(new AnimationState('idle')))
umbrella.getComponent(Animator).getClip('idle').play()
umbrella.getComponent(Animator).getClip('umbrela').looping = false
hud.attachToEntity(umbrella)

umbrella.addComponent(new OnPointerDown(()=>{
  const transform = umbrella.getComponent(Transform)
  if (!umbrella.isGrabbed) {
    umbrella.isGrabbed = true
    // Calculates the rock's position relative to the camera
    transform.position = Vector3.Zero()
    transform.position.y -= 0.5
    transform.rotation = Quaternion.Zero()
    umbrella.setParent(Attachable.AVATAR)
    umbrella.getComponent(Animator).getClip('umbrela').play()
    GAME_STATE.umbrellaPickedUp = true
    umbrella.addComponent(new Delay(5000,()=>{
      soumya.activate();
    }))
  } else {
    umbrella.isGrabbed = false
    // Calculate rock's ground position
    umbrella.setParent(null) // Remove parent
    const forwardVector: Vector3 = Vector3.Forward()
      .scale(Z_OFFSET)
      .rotate(Camera.instance.rotation)
    transform.position = Camera.instance.position.clone().add(forwardVector)
    transform.lookAt(Camera.instance.position)
    transform.rotation.x = 0
    transform.rotation.z = 0
    transform.position.y = GROUND_HEIGHT
}
},
{
  button: ActionButton.PRIMARY,
  hoverText: 'Pick Up / Put Down',
  distance: 5
}))

//adding soumya
export const soumya = new NPC(
  {
    position: new Vector3(6,0,10.98),
    scale: new Vector3(1.2, 1.2, 1.2),
    rotation: Quaternion.Euler(0, 180, 0)
  },
  resources.models.robots.soumya,
  () => {    
    // animations
    
    soumya.playAnimation('wave',false)
    // sound

    if(!GAME_STATE.soumyaWaveAction && !GAME_STATE.umbrellaPickedUp){
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/1.mp3')))
      GAME_STATE.soumyaWaveAction = true
      triggerEmote({predefined: PredefinedEmote.WAVE})
      soumya.addComponent(new Delay(2000,()=>{
        soumya.getComponent(AudioSource).playOnce()
        soumya.talkBubble(soumyaDialog)
        // soumya.components.engine.pointerDown.hoverText = "TALK"
        soumya.getComponent(OnPointerDown).hoverText = "TALK"
        log(soumya.components)
        log(soumya)
        soumya.changeIdleAnim('idle', true)
        soumya.playAnimation('talk',false)
      }))
    }else if(GAME_STATE.umbrellaPickedUp){      
      soumya.changeIdleAnim('idle', true)
      soumya.getComponent(AudioSource).playOnce()   
      soumya.talkBubble(soumyaDialog, 'umbrella')
    }
    // dialog UI
  },
  {
    faceUser: true,
    idleAnim: 'raisehands',
    onlyClickTrigger: true,
    hoverText: 'Click to wave back',
    coolDownDuration: 10,
    portrait: {
      path: 'images/portraits/soumya.png',
      height: 256,
      width: 256,
      section: {
        sourceHeight: 512,
        sourceWidth: 512
      }
    },
    onWalkAway: () => {
      soumya.playAnimation('wave', true, 2)
      soumya.changeIdleAnim('wave', true)
    }
    
  }
)
const soumyaTypeSpeed = 20
export const soumyaDialog: Dialog[] = [
  {
    text: "THANK GOD YOU WAVED BACK! I was feeling a little silly here waving. (Ha ha!)",
    typeSpeed: soumyaTypeSpeed,
    audio: 'sounds/soumya_script/1.mp3',
    triggeredByNext() {
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/2.mp3')))
      soumya.getComponent(AudioSource).playOnce()   
      soumya.playAnimation('talk',false)

    },
  },
  {
    text: "Hello and welcome to the world of the fearless.",
    typeSpeed: soumyaTypeSpeed,
    audio: 'sounds/soumya_script/2.mp3',
    triggeredByNext() {
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/3.mp3')))
      soumya.getComponent(AudioSource).playOnce()        
    },
  },
  {
    text: "That’s right! Because here we fearlessly take on, recognize and mitigate risks that come with technology and transformation, while becoming the best Unilever ever.",
    audio: 'sounds/soumya_script/3.mp3',
    typeSpeed: soumyaTypeSpeed,
    triggeredByNext() {
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/4.mp3')))
      soumya.getComponent(AudioSource).playOnce()        
    },
  },
  {
    text: "That’s right! Out here, we’ve taken industry-leading Risk Frameworks, contextualised, and activated them for the Unilever IT Risk framework at our Risk Control Centre.",
    audio: 'sounds/soumya_script/4.mp3',    
    typeSpeed: soumyaTypeSpeed,
    triggeredByNext() {
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/5.mp3')))
      soumya.getComponent(AudioSource).playOnce()        
    },
  },  
  {
    text: "Over 2000 Unilever IT personnel have been trained to understand, identify, and mitigate over 600 IT risks over 7 key IT Risk domains.",
    audio: 'sounds/soumya_script/5.mp3',    
    typeSpeed: soumyaTypeSpeed,
    triggeredByNext() {
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/6.mp3')))
      soumya.getComponent(AudioSource).playOnce()        
    },
  },  
  {
    text: "They now have the confidence and awareness to take the necessary risks, and also put in place proactive measures that help in leveraging the Risk Intelligence they need.",
    audio: 'sounds/soumya_script/6.mp3',    
    typeSpeed: soumyaTypeSpeed,
    triggeredByNext() {
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/7.mp3')))
      soumya.getComponent(AudioSource).playOnce()  
    },
  },    
  {
    text: "So, be it building the Cloud Controls Matrix to de-risk our Cloud Transformation journey or driving IT Priority Systems to be ‘compliant by design’, this is where it’s all happening!",
    audio: 'sounds/soumya_script/7.mp3',    
    typeSpeed: soumyaTypeSpeed,
    triggeredByNext() {
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/8.mp3')))
      soumya.getComponent(AudioSource).playOnce()     
      umbrella.addComponentOrReplace(new Transform({position: new Vector3(4.82,1.3,9), rotation: Quaternion.Euler(15,345,90), scale: new Vector3(1,1,1)}))

    },
  },
  {
    text: "Do you see that umbrella? Pick it up to proceed.",
    audio: 'sounds/soumya_script/8.mp3',
    isEndOfDialog: true,
    triggeredByNext() {
        umbrella1.setParent(soumya)        
        soumya.playAnimation('umbrela',true)
        umbrella1.getComponent(Animator).getClip('idle').stop();

        umbrella1.getComponent(Animator).getClip('umbrela').play(false);
        
        soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/9.mp3')))        

    },
  },    
  {
    name: 'umbrella',
    text: "Take this before you take the “risk” of going through this door.",
    audio: 'sounds/soumya_script/9.mp3',
    triggeredByNext() {
      soumya.addComponentOrReplace(new AudioSource(new AudioClip('sounds/soumya_script/10.mp3')))
      soumya.getComponent(AudioSource).playOnce()        
      sceneMessageBus.emit('make_it_rain',null)            
    },
  },   
  {
    text: "Relax! There’s no fire breathing monster on the other side. But you know they say it’s good to hope for the best but prepare for the worst! Ciao... ",
    audio: 'sounds/soumya_script/10.mp3',
    typeSpeed: soumyaTypeSpeed,
    isEndOfDialog: true,
    triggeredByNext() {
        engine.removeEntity(collider)
    },
  }
]


// NEHA NPC
sceneMessageBus.on('hide_neha',()=>{
  engine.removeEntity(neha)
})

export const neha = new NPC(
  {
    position: new Vector3(27.6,0.1,11.8),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 270, 0)
  },
  resources.models.robots.neha,
  () => {
    // animations
    neha.playAnimation('wave', true, 2)

    // dialog UI

    if (GAME_STATE.tramStarted) {
      if(GAME_STATE.rockPickedUp){
        neha.talk(NehaDialog, 'rockmoved')
        neha.dialog.closeDialogWindow()
      }else{
        neha.talk(NehaDialog, 'tramstart')
        neha.dialog.closeDialogWindow()
      }
    } else {
      neha.talk(NehaDialog)
    }
  },
  {
    faceUser: true,
    continueOnWalkAway: true,
    onlyClickTrigger: true,
    portrait: {
      path: 'images/portraits/neha.png',
      height: 256,
      width: 256,
      section: {
        sourceHeight: 512,
        sourceWidth: 512
      }
    },
    onWalkAway: () => {
      neha.playAnimation('wave', true, 2)
    }
  }
)



export const NehaDialog: Dialog[] = [
  {
    text: 'Hi there,  I’m Neha. Why don’t you drop that umbrella now?',
    audio: 'sounds/neha_script/first.mp3',
    triggeredByNext() { 
      umbrella.setParent(null)      
    },
  },
  {
    text: "See that tram there? Hop in and journey down the road, to the tallest building.",
    audio: "sounds/neha_script/1.mp3",
    timeOn: 1,
    triggeredByNext() {
    },
  },
  {
    text: "Look for me inside the Tram and I’ll talk to you on the radio while you travel. Ready to get your mind blown?",
    audio: "sounds/neha_script/2.mp3",
    isEndOfDialog: true,
    timeOn: 5,
    triggeredByNext() {
        sceneMessageBus.emit('get_in_car',null)
    },
  },
  {
    name: 'tramstart',
    text: "It’s Need for Speed time, so put the pedal to the metal and let’s vroom into the world of Key Financial Applications and Systems.",
    // audio: "sounds/neha_script/3.mp3"
  },
  {
    text: "It’s a bumpy road ahead, so its safe to stay away from the doors. You know? That’s just what we do at IT to ensure Unilever’s financial reporting accuracy.No, we don’t race cars, Ha Ha! What I mean is that we analyze the risks and bumps on the road first across all KFASes in Unilever, map the IT General Controls that apply.",
    // audio: "sounds/neha_script/4.mp3"

  },
  {
    text: "And then enable the IT platforms to design and operate them effectively... Woahh hold on! looks like a roadblock! I might need your help here. Exit the tram and clear the roadblock to move forward.",
    // audio: "sounds/neha_script/5.mp3"

  },
  {
    text: " YOU DID IT! HAHA! Without year-round Controls Sustenance, we not only make sure to quick fix the gaps as soon as we find them, but also conduct a root cause analysis and drive structural solutions so that they don’t recur.   ",
    isEndOfDialog: true,
    // audio: "sounds/neha_script/6.mp3"
  },
  {
    text: "Wanna leave and go explore?",
    isEndOfDialog: true,
    triggeredByNext: () => {
      neha.playAnimation('idle', true, 2)
    }
  },
  {
    name: 'rockmoved',
    text: "C’mon, let’s get back into the tram.",
    // audio: "sounds/neha_script/7.mp3"
  },
  {
    text: "We are Unilever IT’s face to the SOX Auditors. I wonder what they have to say after all the Audit Automation we’ve done? Hmmm…",
    // audio: "sounds/neha_script/8.mp3"

  },

  {
    text: "Well, here we are. Hope you enjoyed the challenge. But we still have a long way to go... Head to the elevator. Akhil, our (Designation here) awaits you outside.",
    // audio: "sounds/neha_script/9.mp3",

    triggeredByNext: () => {
      neha.playAnimation('walk', true, 2)
    },
    isEndOfDialog: true
  },

]


//adding Akhil
const akhilLift = CreateSound(new AudioClip('sounds/akhil_script/lift1.mp3'))
// akhilLift.setParent(Attachable.AVATAR)
export const akhil = new NPC(
  {
    position: new Vector3(20, 0.1, 58.60),
    scale: new Vector3(1.1, 1.1, 1.1),
    rotation: Quaternion.Euler(0, 0, 0)
  },
  resources.models.robots.akhil,
  () => {
    // animations
    akhil.playAnimation('wave', true, 2)

    // dialog UI
    if(!GAME_STATE.akhilDialogueComplete){
      if(GAME_STATE.reachedElevator ){
        akhilLift.getComponent(AudioSource).playOnce();
        akhil.talkBubble(AkhilDialog, 'lift')
      }else{
        akhil.talk(AkhilDialog)
      }
    }

  },
  {
    faceUser: true,
    walkingAnim: 'walk',
    walkingSpeed: 0.5,
    coolDownDuration: 1,
    portrait: {
      path: 'images/portraits/akhil.png',
      height: 256,
      width: 256,
      section: {
        sourceHeight: 512,
        sourceWidth: 512
      }
    },
    onWalkAway: () => {
      akhil.playAnimation('wave', true, 2)
    }
  }
)


export const AkhilDialog: Dialog[] = [
  {
    text: "Hey! "
  },
  {

    text: "Welcome to the warp speed elevator. It’s time to be fast, but ahem… let’s not be furious. Get into the elevator and let’s get going.",
    audio: 'sounds/akhil_script/1.mp3',
    triggeredByNext: async () => {
      akhil.inCooldown = true;
      akhil.playAnimation('wave', true, 2)
      akhil.followPath({
        path: [new Vector3(20, 0, 58.60), new Vector3(25.63, 0.4, 67.90), new Vector3(32.92, 0.4, 66.39)],
        totalDuration: 4,
        loop: false,
        startingPoint: 0,
        onFinishCallback: () => {
          GAME_STATE.reachedElevator = true;

          akhil.playAnimation('idle')
          akhil.inCooldown = false;
        }
      })
    },
    isEndOfDialog: true,
  },
  {
    name:"lift",
    text: "You know what? Just like this fast elevator, the Global Access Controls Framework needs to work just as fast for IT, like it does for Business.",
    typeSpeed: 25,
    audio:"sounds/akhil_script/lift2.mp3",
    triggeredByNext() {
        akhilLift.removeComponent(AudioSource)
        akhilLift.addComponent(new AudioSource(new AudioClip('sounds/akhil_script/lift2.mp3')))
        akhilLift.getComponent(AudioSource).playOnce()
    },
  },
  {
    text: "We have centralized the Access Operations for almost all the KFAS under CSC, and ensure the Controls are always embedded.",
    typeSpeed: 25,
    triggeredByNext() {
        akhilLift.removeComponent(AudioSource)
        akhilLift.addComponent(new AudioSource(new AudioClip('sounds/akhil_script/lift3.mp3')))
        akhilLift.getComponent(AudioSource).playOnce()
    },
  },
  {
    text: "Agility and automation are our principles.",
    typeSpeed: 40,    
    triggeredByNext() {
      akhilLift.removeComponent(AudioSource)
      akhilLift.addComponent(new AudioSource(new AudioClip('sounds/akhil_script/lift4.mp3')))
      akhilLift.getComponent(AudioSource).playOnce()
    },

  },
  {
    text: "And we’ve made sure nobody needs to wait to get their access provisioned, modified or revoked, if they follow the process.",
    typeSpeed: 25,
    triggeredByNext() {
        akhilLift.removeComponent(AudioSource)
        akhilLift.addComponent(new AudioSource(new AudioClip('sounds/akhil_script/lift5.mp3')))
        akhilLift.getComponent(AudioSource).playOnce()
    },
  },
  {
    text: "I guess I don’t need to tell you what the SOX Auditors have had to say about how we’ve turned it around with XX% automation leading to YY% reduction in deficiencies. ",
    typeSpeed: 25,
    triggeredByNext() {
        akhilLift.removeComponent(AudioSource)
        akhilLift.addComponent(new AudioSource(new AudioClip('sounds/akhil_script/lift6.mp3')))
        akhilLift.getComponent(AudioSource).playOnce()
    },
  },
  {
    text: "And now finally, it’s time to meet the boss!",
    typeSpeed: 40,
    triggeredByNext() {
        akhilLift.removeComponent(AudioSource)
        akhilLift.addComponent(new AudioSource(new AudioClip('sounds/akhil_script/lift7.mp3')))
        akhilLift.getComponent(AudioSource).playOnce()
    },
  },
  {
    text: "Hope you remember everything we’ve told you so far for what’s coming next! Pssst It’s a QUIZ! (whispers)",
    typeSpeed: 30,
    triggeredByNext() {
      akhil.endInteraction()
      GAME_STATE.akhilDialogueComplete = true;
      minakshi.activate()
    },
  }
]

//adding minakshi
export const minakshi = new NPC(
  {
    position: new Vector3(30.51, 40.5, 73.78),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0)
  },
  resources.models.robots.minakshi,
  () => {
    // animations
    minakshi.playAnimation('wave', true, 2)

    // sound
    minakshi.addComponentOrReplace(new AudioSource(resources.sounds.neha))
    minakshi.getComponent(AudioSource).playOnce()

    // dialog UI
    if(GAME_STATE.akhilDialogueComplete){
      minakshi.talk(minakshiDialog)
    }
  },
  {
    faceUser: true,
    portrait: {
      path: 'images/portraits/minakshi.png',
      height: 256,
      width: 256,
      section: {
        sourceHeight: 512,
        sourceWidth: 512
      }
    },
    onWalkAway: () => {
      minakshi.playAnimation('wave', true, 2)
    }
  }
)

export const minakshiDialog: Dialog[] = [
  {
    text: "Hi, I’m Meenakshi. Hope you had fun learning about what we do at R&C.",
    audio: 'sounds/minakshi_script/1.mp3'
  },
  {
    text: "Come, time to get a bird’s eye view of Risk and Controls...",
    audio: 'sounds/minakshi_script/2.mp3'
  },
  {
    text: "let’s go for a spin and see how much you’ve learned today... ",
    audio: 'sounds/minakshi_script/3.mp3'
  },
  {
    text: "You see that helicopter over there, click on it and go for the ride.",
    audio: 'sounds/minakshi_script/4.mp3',
    isEndOfDialog: true
  },
  {
    name: 'end',
    text: "Enjoyed the ride? Thankfully, there’s no risks in experiencing it again. So feel free to start over or pass this experience on to your colleagues. Thanks for your time today, hope we made it worth it.",
    audio: 'sounds/minakshi_script/5.mp3',
    isEndOfDialog: true,
    triggeredByNext() {
      movePlayerTo(new Vector3(5.58,0.88,7.21))
    },
  },

]
