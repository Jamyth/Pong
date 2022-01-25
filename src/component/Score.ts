import { Component } from 'type/phaser';

export class Score extends Component<Phaser.GameObjects.Text> {
    private score: number;
    private x: number;
    private y: number;

    constructor(score: number, x: number, y: number) {
        super();
        this.score = score;
        this.x = x;
        this.y = y;
    }

    getScore() {
        return this.score;
    }

    setScore(score?: number) {
        this.score = score ?? this.score + 1;
    }

    create(scene: Phaser.Scene) {
        this.gameObject = scene.add.text(this.x, this.y, this.score.toString(), { color: 'white' });
        return this;
    }

    update(): void {
        this.gameObject.setText(this.score.toString());
    }
}
