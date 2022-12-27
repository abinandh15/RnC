export default {
    sounds: {
      neha: new AudioClip('sounds/alice.mp3'),
      minakshi: new AudioClip('sounds/bob.mp3'),
    },
    models: {
      standard:{
        lift: new GLTFShape('models/lift_animated_test1.glb'),
        umbrela: new GLTFShape('models/Umbrela2.glb'),
        carBodyCollider: new GLTFShape('models/car/car_base_collider.glb'),
        carBody: new GLTFShape('models/car/car_base_white.glb'),
        carWheelLeft: new GLTFShape('models/car/wheel_left_white.glb'),
        carWheelRight: new GLTFShape('models/car/wheel_right_white.glb'),
        carTrunk: new GLTFShape('models/car/car_trunk_white.glb'),
        // carBody: new GLTFShape('models/car/car_base.glb'),
        // carWheelLeft: new GLTFShape('models/car/wheel_left.glb'),
        // carWheelRight: new GLTFShape('models/car/wheel_right.glb'),
        // carTrunk: new GLTFShape('models/car/car_trunk.glb'),
        roadSpikes: new GLTFShape('models/road_spikes.glb'),
        nehaSitting: new GLTFShape('models/robots/neha_sitting.glb'),
        minakshiSitting: new GLTFShape('models/helicopter/minakshi_sitting.glb'),
        playerCollider: new GLTFShape('models/car/player_collider.glb'),
        playerColliderHeli: new GLTFShape('models/helicopter/player_collider_helicopter.glb'),
        helicopterBase: new GLTFShape('models/helicopter/helicopter_base.glb'),
        helicopterMainRotor: new GLTFShape('models/helicopter/helicopter_main_rotor.glb'),
        helicopterTailRotor: new GLTFShape('models/helicopter/helicopter_tail_rotor.glb'),
        helicopterCollider: new GLTFShape('models/helicopter/helicopter_collider.glb'),
        // liftSwitchStand: new GLTFShape('models/lift_button_stand.glb'),
        // liftButton_red: new GLTFShape('models/lift_button_button_red.glb'),
        // liftButton_green: new GLTFShape('models/lift_button_button_green.glb'),
      },
      robots: {
        neha: 'models/robots/Neha.glb',
        minakshi: 'models/robots/Minakshi.glb',
        akhil:'models/robots/Akhil.glb',
        soumya: 'models/robots/soumya.glb'
      }
    },
    locations: {
      Topfloor: new Vector3(27.07, 41.67, 67.32)
    },
    textures: {
    //   blank: new Texture('images/ui/blank.png'),
    //   buttonE: new Texture('images/ui/buttonE.png'),
    //   buttonF: new Texture('images/ui/buttonF.png'),
    //   leftClickIcon: new Texture('images/ui/leftClickIcon.png'),
    //   textPanel: new Texture('images/ui/textPanel.png')
    }
  }