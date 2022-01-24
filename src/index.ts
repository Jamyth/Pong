import Phaser from 'phaser';
import { WIDTH, HEIGHT } from 'util/GameConfig';
import { MainScene } from 'scene/MainScene';
import 'css/index.css';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: 'Pong',
    scene: [MainScene],
    physics: {
        default: 'arcade',
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: WIDTH,
        height: HEIGHT,
    },
    parent: document.getElementById('container') ?? undefined,
};

new Phaser.Game(config);
