import * as Phaser from 'phaser';
import { t } from '../../i18n';
import type { LocationId } from './mock-core';

type Cell = { x: number; y: number };
type ViewState = {
  locale: 'zh-CN' | 'en';
  quarter: 1 | 2 | 3 | 4;
  paused: boolean;
};
type Door = Cell & {
  id: LocationId;
  building: Phaser.Geom.Rectangle;
  label: Phaser.GameObjects.Text;
};

const tileSize = 16;
const grassIndex = 16 * 28 + 14;
const snowIndex = 19 * 28 + 14;

export class TownScene extends Phaser.Scene {
  private view: ViewState;
  private ground?: Phaser.Tilemaps.TilemapLayer;
  private collision?: Phaser.Tilemaps.TilemapLayer;
  private player?: Phaser.GameObjects.Sprite;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private doors: Door[] = [];
  private cell: Cell = { x: 16, y: 11 };
  private target?: Cell;
  private path: Cell[] = [];
  private direction = 0;
  private entered?: LocationId;
  private destination?: LocationId;
  private ready = false;
  private seasonalTiles: Phaser.Tilemaps.Tile[] = [];

  constructor(
    private spriteUrl: string,
    view: ViewState,
    private onLocation: (id: LocationId) => void,
  ) {
    super('town');
    this.view = view;
  }

  preload() {
    this.load.tilemapTiledJSON('town', '/game/town.json');
    this.load.image('tiles', '/game/assets/background-elements/tileset.png');
    this.load.spritesheet('resident', this.spriteUrl, {
      frameWidth: tileSize,
      frameHeight: tileSize,
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'town' });
    const tileset = map.addTilesetImage('town', 'tiles')!;
    this.ground = map.createLayer('ground', tileset)!;
    map.createLayer('decor', tileset)!.setDepth(1);
    this.collision = map.createLayer('collision', tileset)!;
    this.collision.setVisible(false);
    this.ground.forEachTile((tile) => {
      if (tile.index === grassIndex + 1) this.seasonalTiles.push(tile);
    });
    const objects = map.getObjectLayer('locations')!.objects;
    const spawn = objects.find((object) => object.name === 'spawn')!;
    this.cell = { x: spawn.x! / tileSize, y: spawn.y! / tileSize };
    this.player = this.add
      .sprite(
        this.cell.x * tileSize + 8,
        this.cell.y * tileSize + 8,
        'resident',
      )
      .setOrigin(0.5, 0.75)
      .setDepth(3);
    for (let column = 0; column < 4; column++) {
      this.anims.create({
        key: `walk-${column}`,
        frames: [0, 1, 2, 3].map((row) => ({
          key: 'resident',
          frame: row * 4 + column,
        })),
        frameRate: 9,
        repeat: -1,
      });
    }
    this.doors = objects
      .filter((object) => object.type === 'location')
      .map((object) => {
        const properties = object.properties as {
          name: string;
          value: number;
        }[];
        const property = (name: string) =>
          properties.find((item) => item.name === name)!.value;
        const building = new Phaser.Geom.Rectangle(
          property('buildingX'),
          property('buildingY'),
          property('buildingWidth'),
          property('buildingHeight'),
        );
        this.add
          .rectangle(object.x! + 8, object.y! + 8, 12, 5, 0xffdd78, 0.8)
          .setDepth(2);
        const label = this.add
          .text(building.centerX, building.y - 6, '', {
            fontFamily: 'Arial, "PingFang SC", sans-serif',
            fontSize: '9px',
            color: '#ffffff',
            backgroundColor: '#16324f',
            padding: { x: 3, y: 2 },
          })
          .setOrigin(0.5, 1)
          .setDepth(4);
        return {
          id: object.name as LocationId,
          x: object.x! / tileSize,
          y: object.y! / tileSize,
          building,
          label,
        };
      });
    this.keys = this.input.keyboard!.addKeys(
      'UP,DOWN,LEFT,RIGHT,W,A,S,D',
    ) as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.view.paused) return;
      const point = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const door = this.doors.find(
        (item) =>
          item.building.contains(point.x, point.y) ||
          item.label.getBounds().contains(point.x, point.y) ||
          (Math.floor(point.x / tileSize) === item.x &&
            Math.floor(point.y / tileSize) === item.y),
      );
      if (door) this.walkToLocation(door.id);
      else
        this.walkTo({
          x: Math.floor(point.x / tileSize),
          y: Math.floor(point.y / tileSize),
        });
    });
    this.cameras.main
      .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      .startFollow(this.player, true);
    this.scale.on('resize', this.resizeCamera, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.resizeCamera, this);
    });
    this.ready = true;
    this.resizeCamera();
    this.sync(this.view);
    if (this.destination) this.walkToLocation(this.destination);
  }

  private resizeCamera() {
    // Keep a readable resident on phones; the bounded camera follows the walk.
    const zoom = Math.max(
      1.5,
      Math.min(this.scale.width / 512, this.scale.height / 352),
    );
    this.cameras.main.setZoom(zoom).setRoundPixels(true);
  }

  sync(view: ViewState) {
    this.view = view;
    if (!this.ready) return;
    this.doors.forEach((door) =>
      door.label.setText(t(`game.location.${door.id}`, view.locale)),
    );
    for (const tile of this.seasonalTiles) {
      tile.index = view.quarter >= 3 ? snowIndex + 1 : grassIndex + 1;
      tile.tint = [0xd1edc5, 0xffffff, 0xdac27d, 0xeaf6ff][view.quarter - 1];
    }
    if (view.paused) this.halt();
  }

  halt() {
    this.path = [];
    this.target = undefined;
    this.player?.setPosition(
      this.cell.x * tileSize + 8,
      this.cell.y * tileSize + 8,
    );
    this.player?.anims.stop();
    this.player?.setFrame(this.direction);
    this.input.keyboard?.resetKeys();
  }

  walkToLocation(id: LocationId) {
    this.destination = id;
    if (!this.ready || this.view.paused) return;
    const door = this.doors.find((item) => item.id === id)!;
    if (this.cell.x === door.x && this.cell.y === door.y) {
      this.enter(door.id);
    } else this.walkTo(door);
  }

  private canWalk({ x, y }: Cell) {
    return (
      x >= 0 && y >= 0 && x < 32 && y < 22 && !this.collision!.hasTileAt(x, y)
    );
  }

  private walkTo(goal: Cell) {
    if (!this.canWalk(goal)) return;
    this.halt();
    const index = ({ x, y }: Cell) => y * 32 + x;
    const queue = [this.cell];
    const previous = new Map<number, Cell | undefined>([
      [index(this.cell), undefined],
    ]);
    for (let head = 0; head < queue.length; head++) {
      const cell = queue[head];
      if (cell.x === goal.x && cell.y === goal.y) {
        const path: Cell[] = [];
        let step: Cell | undefined = cell;
        while (step && previous.get(index(step))) {
          path.push(step);
          step = previous.get(index(step));
        }
        this.path = path.reverse();
        return;
      }
      for (const [dx, dy] of [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ]) {
        const next = { x: cell.x + dx, y: cell.y + dy };
        // Passing another doorway would open its menu before reaching the goal.
        const otherDoor = this.doors.some(
          (door) =>
            door.x === next.x &&
            door.y === next.y &&
            (door.x !== goal.x || door.y !== goal.y),
        );
        if (this.canWalk(next) && !otherDoor && !previous.has(index(next))) {
          previous.set(index(next), cell);
          queue.push(next);
        }
      }
    }
  }

  private enter(id: LocationId) {
    this.entered = id;
    this.view = { ...this.view, paused: true };
    this.halt();
    this.onLocation(id);
  }

  update(_time: number, delta: number) {
    if (!this.ready || this.view.paused) return;
    const player = this.player!;
    if (!this.target) {
      const keys = this.keys!;
      const dx =
        keys.LEFT.isDown || keys.A.isDown
          ? -1
          : keys.RIGHT.isDown || keys.D.isDown
            ? 1
            : 0;
      const dy = dx
        ? 0
        : keys.UP.isDown || keys.W.isDown
          ? -1
          : keys.DOWN.isDown || keys.S.isDown
            ? 1
            : 0;
      if (dx || dy) {
        this.path = [];
        const next = { x: this.cell.x + dx, y: this.cell.y + dy };
        if (this.canWalk(next)) this.target = next;
      } else this.target = this.path.shift();
      if (!this.target) {
        player.anims.stop();
        player.setFrame(this.direction);
        return;
      }
      this.direction =
        this.target.x < this.cell.x
          ? 2
          : this.target.x > this.cell.x
            ? 3
            : this.target.y < this.cell.y
              ? 1
              : 0;
      player.play(`walk-${this.direction}`, true);
    }
    const x = this.target.x * tileSize + 8;
    const y = this.target.y * tileSize + 8;
    const step = Math.min(delta, 50) * 0.09;
    player.x +=
      Math.sign(x - player.x) * Math.min(Math.abs(x - player.x), step);
    player.y +=
      Math.sign(y - player.y) * Math.min(Math.abs(y - player.y), step);
    if (player.x === x && player.y === y) {
      this.cell = this.target;
      this.target = undefined;
      const door = this.doors.find(
        (item) => item.x === this.cell.x && item.y === this.cell.y,
      );
      if (door && this.entered !== door.id) this.enter(door.id);
      else if (!door) this.entered = undefined;
    }
  }
}
