import Phaser from 'phaser';

export class SceneLifeCycle extends Phaser.Scene {
    preload(scene: Phaser.Scene) {}

    init(scene: Phaser.Scene, data: object) {}

    create(scene: Phaser.Scene, data: object) {}
}

export abstract class Component<T = any> {
    protected gameObject: T;

    getComponent() {
        return this.gameObject;
    }

    abstract create(scene: Phaser.Scene): this;
    abstract update(dt: number): void;
}
