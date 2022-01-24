import { Component } from 'type/phaser';

export class Score extends Component<Phaser.GameObjects.Text> {
    private text: string;
    private x: number;
    private y: number;

    constructor(score: number, x: number, y: number) {
        super();
        this.text = `${score}`;
        this.x = x;
        this.y = y;
    }

    setScore(score: number) {
        this.text = `${score}`;
    }

    create(scene: Phaser.Scene) {
        this.gameObject = scene.add.text(this.x, this.y, this.text, { color: 'white' });
        return this;
    }

    update(): void {
        this.gameObject.setText(`${this.text}`);
    }
}
