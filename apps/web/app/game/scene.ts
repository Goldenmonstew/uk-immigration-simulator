import * as Phaser from 'phaser';
import { t } from '../../i18n';
import {
  items,
  mailbox,
  npcAt,
  npcs,
  places,
  type GameState,
  type PlaceId,
  type Outcome,
} from '@uk-immigration/game';
import { cropIds, spritePath, visibleResidents, homeSpot } from './session';
type Cell = { x: number; y: number };
export type Interaction =
  | { kind: 'place'; id: PlaceId }
  | { kind: 'npc'; id: string }
  | { kind: 'plot'; id: number }
  | { kind: 'home'; id: 'bed' | 'kitchen' | 'desk' | 'mailbox' | 'exit' };
export type SceneFeedback = {
  token: number;
  outcome?: Outcome;
  hearts?: Record<string, { before: number; after: number }>;
  promotion?: boolean;
};
export type SceneView = {
  state: GameState;
  locale: 'zh-CN' | 'en';
  paused: boolean;
  interior: boolean;
  feedback?: SceneFeedback;
  focusNpc?: string;
};
type Spot = Cell & {
  interaction: Interaction;
  bounds: Phaser.Geom.Rectangle;
  label: Phaser.GameObjects.Text;
};
type Walker = {
  sprite: Phaser.GameObjects.Sprite;
  cell: Cell;
  path: Cell[];
  target?: Cell;
  at: string;
  hide: boolean;
};
const size = 16;
const distance = (a: Cell, b: Cell) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export class TownScene extends Phaser.Scene {
  private view: SceneView;
  private map?: Phaser.Tilemaps.Tilemap;
  private collision?: Phaser.Tilemaps.TilemapLayer;
  private player?: Phaser.GameObjects.Sprite;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private cell: Cell = { x: 4, y: 5 };
  private target?: Cell;
  private path: Cell[] = [];
  private direction = 0;
  private spots: Spot[] = [];
  private anchors = new Map<string, Cell>();
  private residents = new Map<string, Walker>();
  private cropSprites: Phaser.GameObjects.Sprite[] = [];
  private lampLights: Phaser.GameObjects.Graphics[] = [];
  private sky?: Phaser.GameObjects.Graphics;
  private rain?: Phaser.GameObjects.Graphics;
  private postBadge?: Phaser.GameObjects.Text;
  private destination?: PlaceId;
  private queued?: Interaction;
  private entered?: string;
  private nearby?: Interaction;
  private ready = false;
  private feedbackToken?: number;
  private focusNpc?: string;
  private windows?: Phaser.GameObjects.Graphics;
  private celebration?: Phaser.GameObjects.Graphics;
  private transients = new Set<Phaser.GameObjects.GameObject>();
  private dayNumber: number;
  private worldObjects: Phaser.GameObjects.GameObject[] = [];
  constructor(
    view: SceneView,
    private onInteract: (i: Interaction) => void,
    private onNearby: (i?: Interaction) => void,
    private onReady: () => void,
    private onStep: () => void,
  ) {
    super('town');
    this.view = view;
    this.dayNumber = view.state.dayNumber;
    this.feedbackToken = view.feedback?.token;
  }
  preload() {
    this.load.tilemapTiledJSON('town', '/game/town.json');
    this.load.tilemapTiledJSON('home', '/game/home.json');
    this.load.image('town-tiles', '/game/assets/modern-city/tiles.png');
    this.load.image('home-tiles', '/game/assets/indoor/tiles.png');
    this.load.image('item-fallback', '/game/assets/indoor/item.png');
    for (const id of [this.view.state.characterId, ...npcs.map((n) => n.id)])
      this.load.spritesheet(id, spritePath(id), {
        frameWidth: 16,
        frameHeight: 16,
      });
    for (const crop of cropIds)
      this.load.spritesheet(`crop-${crop}`, `/game/assets/crops/${crop}.png`, {
        frameWidth: 16,
        frameHeight: 16,
      });
    this.load.spritesheet(
      'heart',
      '/game/assets/ninja-adventure/hud/heart.png',
      { frameWidth: 16, frameHeight: 16 },
    );
    this.load.spritesheet('spark', '/game/assets/ninja-adventure/fx/1.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }
  create() {
    for (const id of [this.view.state.characterId, ...npcs.map((n) => n.id)])
      for (let d = 0; d < 4; d++)
        if (!this.anims.exists(`${id}-${d}`))
          this.anims.create({
            key: `${id}-${d}`,
            frames: [0, 1, 2, 1].map((r) => ({ key: id, frame: r * 4 + d })),
            frameRate: 8,
            repeat: -1,
          });
    this.keys = this.input.keyboard!.addKeys(
      'UP,DOWN,LEFT,RIGHT,W,A,S,D,E,SPACE',
    ) as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.view.paused) return;
      const point = this.cameras.main.getWorldPoint(p.x, p.y);
      const cell = {
        x: Math.floor(point.x / size),
        y: Math.floor(point.y / size),
      };
      const npc = [...this.residents].find(
        ([, n]) =>
          n.sprite.visible && n.sprite.getBounds().contains(point.x, point.y),
      );
      if (npc) {
        this.queued = { kind: 'npc', id: npc[0] };
        this.walkTo(npc[1].cell);
        return;
      }
      const spot = this.spots.find(
        (s) =>
          s.bounds.contains(point.x, point.y) ||
          s.label.getBounds().contains(point.x, point.y) ||
          distance(s, cell) === 0,
      );
      this.destination = undefined;
      if (spot) {
        this.queued = spot.interaction;
        this.walkTo(spot);
      } else {
        this.queued = undefined;
        this.walkTo(cell);
      }
    });
    this.scale.on('resize', this.resizeCamera, this);
    this.events.once('shutdown', () =>
      this.scale.off('resize', this.resizeCamera, this),
    );
    this.ready = true;
    this.loadWorld();
    this.onReady();
  }
  private own<T extends Phaser.GameObjects.GameObject>(object: T): T {
    this.worldObjects.push(object);
    return object;
  }
  private loadWorld(fromHome = false) {
    this.halt();
    this.onNearby(undefined);
    this.nearby = undefined;
    this.entered = undefined;
    this.spots = [];
    this.anchors.clear();
    this.residents.clear();
    this.cropSprites = [];
    this.lampLights = [];
    this.windows = undefined;
    this.celebration = undefined;
    this.focusNpc = undefined;
    for (const o of this.transients) o.destroy();
    this.transients.clear();
    for (const o of this.worldObjects) o.destroy();
    this.worldObjects = [];
    this.map?.destroy();
    const key = this.view.interior ? 'home' : 'town';
    const map = this.make.tilemap({ key });
    this.map = map;
    const tileset = map.addTilesetImage(key, `${key}-tiles`)!;
    map.createLayer('ground', tileset)!;
    map.createLayer('decor', tileset)!.setDepth(1);
    this.collision = map.createLayer('collision', tileset)!;
    this.collision.setVisible(false);
    const spawn = map.getObjectLayer('spawn')!.objects[0];
    this.cell = { x: spawn.x! / size, y: spawn.y! / size };
    if (fromHome && !this.view.interior) this.cell = { x: 5, y: 12 };
    this.player = this.own(
      this.add
        .sprite(
          this.cell.x * size + 8,
          this.cell.y * size + 10,
          this.view.state.characterId,
        )
        .setOrigin(0.5, 0.8)
        .setDepth(100),
    );
    for (const obj of map.getObjectLayer('places')!.objects) {
      const cell = { x: obj.x! / size, y: obj.y! / size };
      const props = (name: string) =>
        obj.properties?.find(
          (p: { name: string; value: number }) => p.name === name,
        )?.value as number | undefined;
      const interaction: Interaction = this.view.interior
        ? {
            kind: 'home',
            id: obj.name as Extract<Interaction, { kind: 'home' }>['id'],
          }
        : { kind: 'place', id: obj.name as PlaceId };
      const bounds = new Phaser.Geom.Rectangle(
        props('buildingX') ?? obj.x!,
        props('buildingY') ?? obj.y!,
        props('buildingWidth') ?? 16,
        props('buildingHeight') ?? 16,
      );
      const label = this.own(
        this.add
          .text(bounds.centerX, bounds.y - 3, '', {
            fontFamily: 'Arial, "PingFang SC", sans-serif',
            fontSize: '8px',
            color: '#fff7df',
            backgroundColor: '#294a49',
            padding: { x: 3, y: 2 },
          })
          .setOrigin(0.5, 1)
          .setDepth(1000),
      );
      this.spots.push({ ...cell, interaction, bounds, label });
      this.anchors.set(obj.name, cell);
      this.own(
        this.add
          .rectangle(cell.x * size + 8, cell.y * size + 13, 9, 2, 0xf4d98d, 0.8)
          .setDepth(2),
      );
    }
    if (!this.view.interior) {
      for (const a of map.getObjectLayer('anchors')!.objects)
        this.anchors.set(a.name, { x: a.x! / size, y: a.y! / size });
      for (const p of map.getObjectLayer('plots')!.objects) {
        const cell = { x: p.x! / size, y: p.y! / size };
        const sprite = this.own(
          this.add
            .sprite(p.x! + 8, p.y! + 8, 'crop-potato', 0)
            .setDepth(2)
            .setVisible(false),
        );
        this.cropSprites[Number(p.name)] = sprite;
        const label = this.own(
          this.add.text(p.x! + 8, p.y! + 8, '', { fontSize: '8px' }),
        );
        this.spots.push({
          ...cell,
          interaction: { kind: 'plot', id: Number(p.name) },
          bounds: new Phaser.Geom.Rectangle(p.x!, p.y!, 16, 16),
          label,
        });
      }
      for (const lamp of map.getObjectLayer('lamps')!.objects) {
        const g = this.own(this.add.graphics().setDepth(1550));
        for (let r = 30; r > 0; r -= 5)
          g.fillStyle(0xffd88b, 0.075).fillCircle(lamp.x! + 8, lamp.y! - 4, r);
        this.lampLights.push(g);
      }
      this.windows = this.own(this.add.graphics().setDepth(1550));
      map.getLayer('decor')!.tilemapLayer.forEachTile((tile) => {
        if ([17, 20, 22].includes(tile.index)) {
          this.windows!.fillStyle(0xffd889, 0.85).fillRect(
            tile.pixelX + 5,
            tile.pixelY + 5,
            6,
            7,
          );
          this.windows!.fillStyle(0xffd889, 0.08).fillCircle(
            tile.pixelX + 8,
            tile.pixelY + 8,
            13,
          );
        }
      });
      this.decorateFestival();
    }
    this.sky = this.own(this.add.graphics().setScrollFactor(0).setDepth(1500));
    this.rain = this.own(this.add.graphics().setScrollFactor(0).setDepth(1600));
    this.postBadge = this.own(
      this.add
        .text(
          this.view.interior ? 14 * 16 : 5 * 16,
          this.view.interior ? 8 * 16 : 10 * 16,
          '',
          {
            fontSize: '9px',
            color: '#fff',
            backgroundColor: '#9e3d35',
            padding: { x: 2, y: 1 },
          },
        )
        .setDepth(1200),
    );
    this.cameras.main
      .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
      .startFollow(this.player, true, 0.15, 0.15);
    this.resizeCamera();
    this.sync(this.view);
    if (this.destination && !this.view.interior)
      this.walkToLocation(this.destination);
  }
  private resizeCamera() {
    if (!this.map) return;
    this.cameras.main.setZoom(
      this.view.interior
        ? Math.min(
            3,
            this.scale.width / (18 * size),
            this.scale.height / (13 * size),
          )
        : this.scale.width < 600
          ? 2
          : 2.5,
    );
    this.paintLight();
  }
  sync(view: SceneView) {
    const wasPaused = this.view.paused;
    const swap = this.view.interior !== view.interior;
    const nextDay = this.dayNumber !== view.state.dayNumber;
    this.view = view;
    this.dayNumber = view.state.dayNumber;
    if (!this.ready) return;
    if (swap || nextDay) {
      if (nextDay) this.destination = undefined;
      this.loadWorld(swap);
      return;
    }
    if (view.paused) this.halt();
    else if (wasPaused && this.destination)
      this.walkToLocation(this.destination);
    for (const spot of this.spots) {
      if (spot.interaction.kind === 'place') {
        const p = places.find(
          (p) => p.id === (spot.interaction as { id: PlaceId }).id,
        )!;
        spot.label.setText(view.locale === 'en' ? p.name.en : p.name.zhCN);
      } else if (spot.interaction.kind === 'home') {
        spot.label.setText(
          t(
            spot.interaction.id === 'exit'
              ? 'game.exitHome'
              : `game.${spot.interaction.id}`,
            view.locale,
          ),
        );
      }
    }
    this.postBadge
      ?.setText(
        mailbox(view.state).length ? `✉ ${mailbox(view.state).length}` : '',
      )
      .setVisible(mailbox(view.state).length > 0);
    this.cropSprites.forEach((sprite, i) => {
      const p = view.state.plots[i],
        crop = items.find((it) => it.id === p?.seed)?.grows?.crop;
      sprite.setVisible(!!crop);
      if (crop) {
        const grows = items.find((it) => it.id === p.seed)!.grows!;
        sprite.setTexture(
          cropIds.includes(crop) ? `crop-${crop}` : 'item-fallback',
          cropIds.includes(crop)
            ? Math.min(4, Math.floor((p.growth / grows.days) * 4))
            : 0,
        );
      }
    });
    this.syncResidents();
    const focus = view.focusNpc
      ? this.residents.get(view.focusNpc)?.sprite
      : undefined;
    if (this.focusNpc !== view.focusNpc) {
      this.focusNpc = view.focusNpc;
      this.cameras.main.startFollow(
        focus?.visible ? focus : this.player!,
        true,
        0.15,
        0.15,
      );
    }
    this.paintLight();
    if (view.feedback && view.feedback.token !== this.feedbackToken) {
      this.feedbackToken = view.feedback.token;
      this.feedback(view.feedback);
    }
  }
  private syncResidents() {
    const residents = visibleResidents(this.view.state, this.view.interior);
    for (const [id, n] of this.residents) {
      if (!residents.some((npc) => npc.id === id)) {
        n.sprite.destroy();
        this.residents.delete(id);
      }
    }
    residents.forEach((person, index) => {
      const at = npcAt(this.view.state, person.id);
      const target = this.view.interior
        ? homeSpot(index)
        : this.anchors.get(at)!;
      const hide =
        !this.view.interior &&
        this.view.focusNpc !== person.id &&
        places.some((p) => p.id === at && p.kind === 'building');
      const npc = this.residents.get(person.id);
      if (!npc) {
        const sprite = this.own(
          this.add
            .sprite(target.x * size + 8, target.y * size + 10, person.id)
            .setOrigin(0.5, 0.8)
            .setDepth(10 + target.y * size)
            .setVisible(!hide),
        );
        this.residents.set(person.id, {
          sprite,
          cell: { ...target },
          path: [],
          at,
          hide,
        });
      } else if (npc.at !== at || npc.hide !== hide) {
        npc.at = at;
        npc.hide = hide;
        npc.sprite.setVisible(true);
        npc.path = this.findPath(npc.target ?? npc.cell, target);
        if (!npc.path.length && !npc.target && hide)
          npc.sprite.setVisible(false);
      }
    });
  }
  private decorateFestival() {
    const festival = this.view.state.day.festival;
    this.celebration = undefined;
    if (!festival) return;
    const g = this.own(this.add.graphics().setDepth(530));
    const colors =
      festival === 'christmas-market'
        ? [0xd44b43, 0x418660, 0xffd778]
        : [0xd85d4a, 0xf4c86c, 0x62a6ac];
    for (const x of [500, 572]) {
      g.fillStyle(0x865d3b).fillRect(x - 13, 493, 26, 16);
      g.fillStyle(colors[0]).fillRect(x - 16, 480, 32, 10);
      g.fillStyle(0xffedc2)
        .fillRect(x - 12, 481, 5, 9)
        .fillRect(x, 481, 5, 9)
        .fillRect(x + 11, 481, 4, 9);
      g.fillStyle(0xd69c58)
        .fillRect(x - 15, 507, 3, 12)
        .fillRect(x + 12, 507, 3, 12);
    }
    g.lineStyle(1, 0x604f3b).lineBetween(486, 464, 600, 464);
    for (let i = 0; i < 10; i++) {
      const x = 489 + i * 11;
      g.fillStyle(colors[i % colors.length]).fillTriangle(
        x,
        465,
        x + 8,
        465,
        x + 4,
        474,
      );
      if (festival === 'lunar-new-year') {
        g.fillStyle(0xc73e35).fillRoundedRect(x, 475, 7, 9, 2);
        g.lineStyle(1, 0xffd26d).lineBetween(x + 3, 484, x + 3, 489);
      }
      if (festival === 'christmas-market') {
        g.fillStyle(colors[i % 3], 0.15).fillCircle(x + 4, 469, 8);
        g.fillStyle(0xfff3b3).fillCircle(x + 4, 469, 2);
      }
    }
    if (festival === 'bonfire-night') {
      g.lineStyle(4, 0x604333)
        .lineBetween(558, 545, 575, 552)
        .lineBetween(558, 552, 575, 545);
      this.celebration = this.own(this.add.graphics().setDepth(1560));
    }
  }
  private paintLight() {
    if (!this.sky) return;
    const minute = this.view.state.day.minute,
      weather = this.view.state.day.weather;
    this.sky.clear();
    const w = this.scale.width / this.cameras.main.zoom,
      h = this.scale.height / this.cameras.main.zoom;
    // Scroll-factor zero still uses the camera's centred zoom transform.
    this.sky.setPosition(
      (this.scale.width - w) / 2,
      (this.scale.height - h) / 2,
    );
    this.rain?.setPosition(
      (this.scale.width - w) / 2,
      (this.scale.height - h) / 2,
    );
    if (!this.view.interior) {
      const color =
        minute >= 1260 ? 0x162750 : minute >= 1080 ? 0xdc9651 : 0x2c415b;
      const alpha =
        (minute >= 1260 ? 0.48 : minute >= 1080 ? 0.18 : 0) +
        (weather === 'rain' ? 0.13 : weather === 'cloudy' ? 0.07 : 0);
      this.sky.fillStyle(color, alpha).fillRect(0, 0, w, h);
    }
    this.lampLights.forEach((l) => l.setVisible(minute >= 1080));
    this.windows?.setVisible(minute >= 1080);
  }
  private feedback(feedback: SceneFeedback) {
    if (!this.player) return;
    const out = feedback.outcome;
    if (!out) return;
    const parts: string[] = [];
    if (feedback.promotion) parts.push(t('game.promotion', this.view.locale));
    for (const change of Object.values(feedback.hearts ?? {}))
      parts.push(`♥ ${change.before} → ${change.after}`);
    for (const [key, value] of Object.entries(out.statDeltas ?? {}))
      if (value)
        parts.push(
          `${value > 0 ? '+' : ''}${value} ${t(`game.${key as 'money' | 'mood' | 'health' | 'english' | 'career'}`, this.view.locale)}`,
        );
    for (const [id, n] of Object.entries(out.items ?? {}))
      if (n) {
        const item = items.find((i) => i.id === id);
        parts.push(
          `${n > 0 ? '+' : ''}${n} ${item ? (this.view.locale === 'en' ? item.name.en : item.name.zhCN) : t('game.itemFallback', this.view.locale)}`,
        );
      }
    if (parts.length) {
      const text = this.add
        .text(this.player.x, this.player.y - 20, parts.join('\n'), {
          fontSize: '9px',
          fontFamily: 'Arial, sans-serif',
          color: '#fff9ce',
          stroke: '#263e39',
          strokeThickness: 3,
          align: 'center',
        })
        .setOrigin(0.5, 1)
        .setDepth(1800);
      this.float(text, 2200, 24);
    }
    if (out.kind === 'talk' || out.kind === 'gift') {
      const actor = this.residents.get(out.npc ?? '')?.sprite ?? this.player;
      const person = npcs.find((n) => n.id === out.npc);
      const item = Object.keys(out.items ?? {})[0];
      const expression =
        out.kind === 'talk'
          ? '♪'
          : person?.gifts.loved.includes(item)
            ? '♥ ♥'
            : person?.gifts.liked.includes(item)
              ? '♥'
              : person?.gifts.disliked.includes(item)
                ? '…'
                : '☺';
      const bubble = this.add
        .text(actor.x, actor.y - 25, expression, {
          fontSize: '10px',
          color: '#b34150',
          backgroundColor: '#fff8df',
          padding: { x: 4, y: 3 },
        })
        .setOrigin(0.5, 1)
        .setDepth(1800);
      this.float(bubble, 1800, 8);
    }
    if (
      out.kind === 'harvest' ||
      (out.kind === 'catch' && out.items) ||
      feedback.promotion
    ) {
      const spark = this.add
        .sprite(this.player.x, this.player.y - 8, 'spark')
        .setDepth(1800);
      this.float(spark, 500, 0);
    }
  }
  private float(
    object: Phaser.GameObjects.Text | Phaser.GameObjects.Sprite,
    duration: number,
    rise: number,
  ) {
    if (this.transients.size >= 12) {
      const oldest = this.transients.values().next().value!;
      this.tweens.killTweensOf(oldest);
      oldest.destroy();
      this.transients.delete(oldest);
    }
    this.transients.add(object);
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.tweens.add({
      targets: object,
      y: object.y - (reduced ? 0 : rise),
      alpha: 0,
      duration,
      onComplete: () => {
        object.destroy();
        this.transients.delete(object);
      },
    });
  }
  halt() {
    this.path = [];
    this.queued = undefined;
    this.player?.anims.stop();
    if (this.player && this.target) {
      this.player.setPosition(this.cell.x * size + 8, this.cell.y * size + 10);
      this.target = undefined;
    }
    if (this.keys) Object.values(this.keys).forEach((k) => k.reset());
  }
  private passable(cell: Cell) {
    return (
      !!this.map &&
      cell.x >= 0 &&
      cell.y >= 0 &&
      cell.x < this.map.width &&
      cell.y < this.map.height &&
      !((this.collision?.getTileAt(cell.x, cell.y)?.index ?? -1) > 0)
    );
  }
  private findPath(start: Cell, end: Cell): Cell[] {
    if (!this.passable(end)) return [];
    const w = this.map!.width;
    const key = (c: Cell) => c.y * w + c.x;
    const parents = new Map<number, Cell>();
    const queue = [start];
    parents.set(key(start), start);
    for (let i = 0; i < queue.length; i++) {
      const c = queue[i];
      if (distance(c, end) === 0) break;
      for (const [dx, dy] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        const n = { x: c.x + dx, y: c.y + dy };
        if (this.passable(n) && !parents.has(key(n))) {
          parents.set(key(n), c);
          queue.push(n);
        }
      }
    }
    if (!parents.has(key(end))) return [];
    const path = [];
    let c = end;
    while (distance(c, start) !== 0) {
      path.unshift(c);
      c = parents.get(key(c))!;
    }
    return path;
  }
  private walkTo(cell: Cell) {
    this.path = this.findPath(this.target ?? this.cell, cell);
    if (
      !this.path.length &&
      !this.target &&
      distance(this.cell, cell) <= 1 &&
      this.queued
    ) {
      const i = this.queued;
      this.queued = undefined;
      this.activate(i);
    }
  }
  walkToLocation(id: PlaceId) {
    this.destination = id;
    if (!this.ready) return;
    if (this.view.interior) {
      if (id === 'home') {
        this.onInteract({ kind: 'home', id: 'desk' });
        this.destination = undefined;
        return;
      }
      const exit = this.spots.find(
        (s) => s.interaction.kind === 'home' && s.interaction.id === 'exit',
      )!;
      this.queued = exit.interaction;
      this.walkTo(exit);
      return;
    }
    const spot = this.spots.find(
      (s) => s.interaction.kind === 'place' && s.interaction.id === id,
    )!;
    this.walkTo(spot);
  }
  walkToNpc(id: string) {
    const npc = this.residents.get(id);
    if (!npc?.sprite.visible) return;
    this.destination = undefined;
    this.queued = { kind: 'npc', id };
    this.walkTo(npc.target ?? npc.cell);
  }
  interact() {
    if (this.view.paused) return;
    if (this.nearby) this.activate(this.nearby);
  }
  private activate(i: Interaction) {
    if (i.kind === 'npc') {
      const npc = this.residents.get(i.id);
      if (!npc?.sprite.visible) return;
      if (distance(npc.cell, this.cell) > 1) {
        this.queued = i;
        this.walkTo(npc.target ?? npc.cell);
        return;
      }
    }
    if (i.kind === 'place') this.destination = undefined;
    this.halt();
    this.onInteract(i);
  }
  private move(
    sprite: Phaser.GameObjects.Sprite,
    target: Cell,
    speed: number,
    delta: number,
    id: string,
  ) {
    const x = target.x * size + 8,
      y = target.y * size + 10,
      dx = x - sprite.x,
      dy = y - sprite.y,
      len = Math.hypot(dx, dy);
    const direction =
      Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : 2) : dy < 0 ? 3 : 0;
    sprite.play(`${id}-${direction}`, true);
    sprite.setDepth(10 + sprite.y);
    if (len <= (speed * delta) / 1000) {
      sprite.setPosition(x, y);
      sprite.anims.stop();
      sprite.setFrame(direction);
      return true;
    }
    sprite.x += ((dx / len) * speed * delta) / 1000;
    sprite.y += ((dy / len) * speed * delta) / 1000;
    return false;
  }
  update(time: number, delta: number) {
    if (!this.ready || !this.player) return;
    this.weather(time);
    this.festivalEffects(time);
    if (this.view.paused) return;
    for (const [id, n] of this.residents) {
      if (!n.target) n.target = n.path.shift();
      if (n.target && this.move(n.sprite, n.target, 40, delta, id)) {
        n.cell = n.target;
        n.target = undefined;
        if (!n.path.length && n.hide) n.sprite.setVisible(false);
      }
    }
    const keys = this.keys!;
    if (
      Phaser.Input.Keyboard.JustDown(keys.E) ||
      Phaser.Input.Keyboard.JustDown(keys.SPACE)
    ) {
      this.interact();
      return;
    }
    if (!this.target) {
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
        this.queued = undefined;
        this.destination = undefined;
        const next = { x: this.cell.x + dx, y: this.cell.y + dy };
        if (this.passable(next)) this.target = next;
        this.direction = dx < 0 ? 1 : dx > 0 ? 2 : dy < 0 ? 3 : 0;
      } else this.target = this.path.shift();
    }
    if (
      this.target &&
      this.move(
        this.player,
        this.target,
        this.destination ? 145 : 85,
        Math.min(delta, 60),
        this.view.state.characterId,
      )
    ) {
      this.cell = this.target;
      this.target = undefined;
      this.onStep();
      if (!this.path.length && this.queued) {
        const queued = this.queued;
        this.queued = undefined;
        this.activate(queued);
        return;
      }
      const door = this.spots.find(
        (s) =>
          distance(s, this.cell) === 0 &&
          ((s.interaction.kind === 'home' && s.interaction.id === 'exit') ||
            (s.interaction.kind === 'place' &&
              places.find((p) => p.id === s.interaction.id)?.kind ===
                'building')),
      );
      if (door) {
        const id = JSON.stringify(door.interaction);
        if (this.entered !== id) {
          this.entered = id;
          this.activate(door.interaction);
          return;
        }
      } else this.entered = undefined;
    }
    if (!this.target && !this.path.length) {
      this.player.anims.stop();
      this.player.setFrame(this.direction);
    }
    const npc = [...this.residents].find(
      ([, n]) => n.sprite.visible && distance(n.cell, this.cell) <= 1,
    );
    const near: Interaction | undefined = npc
      ? { kind: 'npc', id: npc[0] }
      : this.spots.find((s) => distance(s, this.cell) <= 1)?.interaction;
    if (JSON.stringify(near) !== JSON.stringify(this.nearby)) {
      this.nearby = near;
      this.onNearby(near);
    }
  }
  private festivalEffects(time: number) {
    const g = this.celebration;
    if (!g) return;
    g.clear();
    if (this.view.state.day.minute < 1080) return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const flicker = reduced ? 0 : Math.sin(time / 120) * 2;
    g.fillStyle(0xffa334, 0.13).fillCircle(566, 541, 28);
    g.fillStyle(0xee6c32).fillTriangle(557, 547, 576, 547, 567 + flicker, 520);
    g.fillStyle(0xffd976).fillTriangle(562, 547, 572, 547, 566 - flicker, 530);
    if (reduced) return;
    const phase = (time % 2600) / 2600;
    const radius = phase * 34;
    const cycle = Math.floor(time / 2600);
    const x = cycle % 2 ? 510 : 590;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      g.fillStyle(
        [0xffd978, 0xe9a4bc, 0xb1e2e9][cycle % 3],
        1 - phase,
      ).fillCircle(
        x + Math.cos(angle) * radius,
        430 + Math.sin(angle) * radius + phase * 8,
        1.5,
      );
    }
  }
  private weather(time: number) {
    if (!this.rain) return;
    this.rain.clear();
    if (this.view.interior) return;
    const weather = this.view.state.day.weather;
    if (weather !== 'rain' && weather !== 'snow') return;
    const w = this.scale.width / this.cameras.main.zoom,
      h = this.scale.height / this.cameras.main.zoom;
    for (let i = 0; i < (this.scale.width < 600 ? 36 : 70); i++) {
      const x =
          (i * 47 +
            Math.sin(i) * 18 +
            (weather === 'snow' ? time / 180 : time / 45)) %
          w,
        y = (i * 31 + time / (weather === 'snow' ? 45 : 6)) % h;
      if (weather === 'rain') {
        this.rain.lineStyle(0.6, 0xbad5e6, 0.6);
        this.rain.lineBetween(x, y, x - 2, y + 5);
      } else this.rain.fillStyle(0xffffff, 0.8).fillCircle(x, y, 1);
    }
  }
}
