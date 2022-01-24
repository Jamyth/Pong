import type Phaser from 'phaser';
import { Component } from 'type/phaser';
import { HEIGHT } from 'util/GameConfig';

export class Paddle extends Component<Phaser.GameObjects.Rectangle> {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private dy = 0;

    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    setDy(dy: number) {
        this.dy = dy;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    create(scene: Phaser.Scene) {
        this.gameObject = scene.add.rectangle(this.x, this.y, this.width, this.height, 0xffffff);
        scene.physics.add.existing(this.gameObject);
        return this;
    }

    update(dt: number) {
        if (this.dy < 0) {
            this.y = Math.max(this.height / 2, this.y + this.dy * dt);
        } else {
            this.y = Math.min(HEIGHT - this.height / 2, this.y + this.dy * dt);
        }
        this.gameObject.setY(this.y);
    }
}
