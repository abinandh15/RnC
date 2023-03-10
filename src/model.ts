

export class Model extends Entity {
  isGrabbed: boolean = false;
    constructor(model: GLTFShape, transform: TransformConstructorArgs, name?: string) {
      super()
      if (name) {
        this.name = name
      }
      engine.addEntity(this)
      this.addComponent(new Transform(transform))
      this.addComponent(model)
    }
  }

