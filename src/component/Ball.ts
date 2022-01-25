import { Component } from 'type/phaser';
import { HEIGHT } from 'util/GameConfig';

export class Ball extends Component<Phaser.GameObjects.Rectangle> {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private dx: number;
    private dy: number;
    private color: number;
    private servingPlayer: 1 | 2 | undefined;

    constructor(
        private readonly initialX: number,
        private readonly initialY: number,
        width: number,
        height: number,
        targetDx?: number,
    ) {
        super();
        this.x = initialX;
        this.y = initialY;
        this.width = width;
        this.height = height;
        this.dx = targetDx ? targetDx : Math.floor(Math.random() * 2) === 1 ? 100 : -100;
        this.dy = targetDx ? Math.random() * 140 + 10 : Math.random() * 100 - 50;
        this.color = 0xffffff;
    }

    setServingPlayer(player: 1 | 2 | undefined) {
        this.servingPlayer = player;
    }

    setColor(color: number) {
        this.color = color;
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.dx = Math.floor(Math.random() * 2) === 1 ? 100 : -100;
        if (this.servingPlayer !== undefined) {
            this.dx = this.servingPlayer === 1 ? -100 : 100;
        }
        this.dy = Math.random() * 100 - 50;

        this.setXY();
    }

    reflect(x: number) {
        this.dx = -this.dx * 1.1;
        this.x = x;
        const dy = Math.random() * 140 + 10;
        this.dy = this.dy < 0 ? -dy : dy;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getDx() {
        return this.dx;
    }

    getDy() {
        return this.dy;
    }

    create(scene: Phaser.Scene) {
        this.gameObject = scene.add.rectangle(this.x, this.y, this.width, this.height, this.color);
        scene.physics.add.existing(this.gameObject);
        return this;
    }

    update(dt: number): void {
        this.x += this.dx * dt;
        this.y += this.dy * dt;

        if (this.y <= 0) {
            this.y = 0;
            this.dy = -this.dy;
        } else if (this.y >= HEIGHT - this.height) {
            this.y = HEIGHT - this.height;
            this.dy = -this.dy;
        }

        this.setXY();
        this.gameObject.setFillStyle(this.color);
    }

    private setXY() {
        this.gameObject.setX(this.x);
        this.gameObject.setY(this.y);
    }
}
