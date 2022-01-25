// import Phaser from 'phaser';
import { SceneLifeCycle } from 'type/phaser';
import { HEIGHT, WIDTH } from 'util/GameConfig';
import { Paddle } from 'component/Paddle';
import { Ball } from 'component/Ball';
import { Score } from 'component/Score';

export class MainScene extends SceneLifeCycle {
    private readonly PADDLE_SPEED = 200;
    private readonly BALL_AMOUNT = 3;
    private readonly BALL_GENERATE_POSS = 25;
    private readonly WINNING_CONDITION = 10;

    private player1: Paddle;
    private player2: Paddle;
    private ball: Ball;
    private balls: Ball[];
    private player1Score: Score;
    private player2Score: Score;
    private winnerText: Phaser.GameObjects.Text | null;

    private WKey: Phaser.Input.Keyboard.Key;
    private SKey: Phaser.Input.Keyboard.Key;
    private UpKey: Phaser.Input.Keyboard.Key;
    private DownKey: Phaser.Input.Keyboard.Key;
    private EnterKey: Phaser.Input.Keyboard.Key;
    private SpaceKey: Phaser.Input.Keyboard.Key;

    private gameState: 'start' | 'play' | 'finish';

    init(scene: Phaser.Scene, data: object): void {
        this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.UpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.DownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.EnterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, false);

        this.balls = [];

        this.winnerText = null;

        this.gameState = 'start';
    }

    create(scene: Phaser.Scene, data: object): void {
        this.add.text(0, 20, 'Iamyth Pong', {
            align: 'center',
            color: 'white',
            fixedWidth: WIDTH,
        });

        this.player1Score = new Score(0, WIDTH / 2 - 50, HEIGHT / 3).create(this);
        this.player2Score = new Score(0, WIDTH / 2 + 30, HEIGHT / 3).create(this);

        this.player1 = new Paddle(10, 30, 5, 40).create(this);
        this.player2 = new Paddle(WIDTH - 10, HEIGHT - 50, 5, 40).create(this);

        this.ball = new Ball(WIDTH / 2 - 2, HEIGHT / 2 - 2, 4, 4).create(this);

        this.EnterKey.on('down', this.onEnterOrSpacePressed.bind(this));
        this.SpaceKey.on('down', this.onEnterOrSpacePressed.bind(this));
    }

    update(time: number, delta: number): void {
        const _delta = delta / 1000;

        this.handleKeyboardInput();

        if (this.gameState === 'play') {
            this.physics.collide(this.ball.getComponent(), this.player1.getComponent(), () => {
                this.ball.reflect(this.player1.getX() + this.player1.getWidth());
                this.removeBalls();
                this.generateBalls(this.BALL_AMOUNT);
            });
            this.physics.collide(this.ball.getComponent(), this.player2.getComponent(), () => {
                this.ball.reflect(this.player2.getX() - this.ball.getWidth());
                this.removeBalls();
                this.generateBalls(this.BALL_AMOUNT);
            });

            if (this.ball.getX() < 0) {
                this.ball.setServingPlayer(2);
                this.ball.reset();
                this.player2Score.setScore();
                this.player2Score.update();
                this.gameState = this.player2Score.getScore() === this.WINNING_CONDITION ? 'finish' : 'start';
                this.removeBalls();
            } else if (this.ball.getX() > WIDTH) {
                this.ball.setServingPlayer(1);
                this.ball.reset();
                this.player1Score.setScore();
                this.player1Score.update();
                this.gameState = this.player1Score.getScore() === this.WINNING_CONDITION ? 'finish' : 'start';
                this.removeBalls();
            }

            this.ball.update(_delta);
            this.balls.forEach((_) => _.update(_delta));
        }

        if (this.gameState === 'finish' && this.winnerText === null) {
            const winner = this.player1Score.getScore() === this.WINNING_CONDITION ? 'Player 1' : 'Player 2';
            this.winnerText = this.add.text(0, this.scale.height / 2 + 5, `${winner} has won !`, {
                align: 'center',
                color: 'white',
                fixedWidth: WIDTH,
            });
        }

        this.player1.update(_delta);
        this.player2.update(_delta);
    }

    private handleKeyboardInput() {
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
    }

    private onEnterOrSpacePressed() {
        if (this.gameState === 'start') {
            this.gameState = 'play';
        } else {
            if (this.gameState === 'finish') {
                this.player1Score.setScore(0);
                this.player2Score.setScore(0);
                this.player1Score.update();
                this.player2Score.update();
            } else {
                this.ball.reset();
                this.removeBalls();
            }
            this.gameState = 'start';
            this.ball.setServingPlayer(undefined);
            this.winnerText?.destroy();
            this.winnerText = null;
        }
    }

    private generateBalls(amount: number) {
        const random = Math.floor(Math.random() * 100);

        if (random > this.BALL_GENERATE_POSS) {
            return;
        }

        for (let i = 0; i < amount; i++) {
            const ball = new Ball(
                this.ball.getX(),
                this.ball.getY(),
                this.ball.getWidth(),
                this.ball.getHeight(),
                this.ball.getDx(),
            ).create(this);
            ball.setColor(0xeaeaea);
            this.balls.push(ball);
        }
    }

    private removeBalls() {
        this.balls.forEach((ball) => {
            ball.getComponent().destroy(true);
        });
        this.balls = [];
    }
}
