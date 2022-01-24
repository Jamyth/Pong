// import Phaser from 'phaser';
import { SceneLifeCycle } from 'type/phaser';
import { HEIGHT, WIDTH } from 'util/GameConfig';
import { Paddle } from 'component/Paddle';
import { Ball } from 'component/Ball';
import { Score } from 'component/Score';

export class MainScene extends SceneLifeCycle {
    private readonly PADDLE_SPEED = 200;
    private player1Score: number;
    private player2Score: number;

    private player1: Paddle;
    private player2: Paddle;
    private ball: Ball;
    private balls: Ball[];
    private player1ScoreText: Score;
    private player2ScoreText: Score;

    private WKey: Phaser.Input.Keyboard.Key;
    private SKey: Phaser.Input.Keyboard.Key;
    private UpKey: Phaser.Input.Keyboard.Key;
    private DownKey: Phaser.Input.Keyboard.Key;
    private EnterKey: Phaser.Input.Keyboard.Key;

    private gameState: 'start' | 'play';

    init(scene: Phaser.Scene, data: object): void {
        this.player1Score = 0;
        this.player2Score = 0;

        this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.UpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.DownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.EnterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.balls = [];

        this.gameState = 'start';
    }

    create(scene: Phaser.Scene, data: object): void {
        this.add.text(0, 20, 'Hello Pong', {
            align: 'center',
            color: 'white',
            fixedWidth: WIDTH,
        });

        this.player1ScoreText = new Score(this.player1Score, WIDTH / 2 - 50, HEIGHT / 3).create(this);
        this.player2ScoreText = new Score(this.player2Score, WIDTH / 2 + 30, HEIGHT / 3).create(this);

        this.player1 = new Paddle(10, 30, 5, 40).create(this);
        this.player2 = new Paddle(WIDTH - 10, HEIGHT - 50, 5, 40).create(this);

        this.ball = new Ball(WIDTH / 2 - 2, HEIGHT / 2 - 2, 4, 4).create(this);

        this.EnterKey.on('down', () => {
            if (this.gameState === 'start') {
                this.gameState = 'play';
            } else {
                this.gameState = 'start';
                this.ball.reset();
                this.removeBalls();
            }
        });
    }

    update(time: number, delta: number): void {
        const _delta = delta / 1000;
        if (this.WKey.isDown) {
            this.player1.setDy(-this.PADDLE_SPEED);
        } else if (this.SKey.isDown) {
            this.player1.setDy(this.PADDLE_SPEED);
        } else {
            this.player1.setDy(0);
        }

        if (this.UpKey.isDown) {
            this.player2.setDy(-this.PADDLE_SPEED);
        } else if (this.DownKey.isDown) {
            this.player2.setDy(this.PADDLE_SPEED);
        } else {
            this.player2.setDy(0);
        }

        this.player1.update(_delta);
        this.player2.update(_delta);

        if (this.gameState === 'play') {
            this.physics.collide(this.ball.getComponent(), this.player1.getComponent(), () => {
                this.ball.reflect(this.player1.getX() + this.player1.getWidth());
                this.removeBalls();
                this.generateBalls(10);
            });
            this.physics.collide(this.ball.getComponent(), this.player2.getComponent(), () => {
                this.ball.reflect(this.player2.getX() - this.ball.getWidth());
                this.removeBalls();
                this.generateBalls(10);
            });

            if (this.ball.getX() < 0) {
                this.player2Score += 1;
                this.ball.reset();
                this.gameState = 'start';
                this.player2ScoreText.setScore(this.player2Score);
                this.player2ScoreText.update();
                this.removeBalls();
            } else if (this.ball.getX() > WIDTH) {
                this.player1Score += 1;
                this.ball.reset();
                this.gameState = 'start';
                this.player1ScoreText.setScore(this.player1Score);
                this.player1ScoreText.update();
                this.removeBalls();
            }

            this.ball.update(_delta);
            this.balls.forEach((_) => _.update(_delta));
        }
    }

    private generateBalls(amount: number) {
        const random = Math.floor(Math.random() * 100);

        if (random > 50) {
            return;
        }

        for (let i = 0; i < amount; i++) {
            this.balls.push(
                new Ball(
                    this.ball.getX(),
                    this.ball.getY(),
                    this.ball.getWidth(),
                    this.ball.getHeight(),
                    this.ball.getDx(),
                ).create(this),
            );
        }
    }

    private removeBalls() {
        this.balls.forEach((ball) => {
            ball.getComponent().destroy(true);
        });
    }
}
