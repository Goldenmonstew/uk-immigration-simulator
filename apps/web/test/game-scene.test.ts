import { expect, test, vi } from 'vitest';
import { newGame, npcAt } from '@uk-immigration/game';
import { TownScene, type SceneView } from '../app/game/scene';
import townMap from '../public/game/town.json';

// Exercise the real routing/update logic without a browser or Phaser renderer.
vi.mock('phaser', () => ({
  Scene: class {},
  Input: { Keyboard: { JustDown: () => false } },
}));

class Sprite {
  visible = true;
  anims = { stop: vi.fn() };
  destroy = vi.fn(() => {
    this.visible = false;
  });
  constructor(
    public x: number,
    public y: number,
  ) {}
  setOrigin() {
    return this;
  }
  setDepth() {
    return this;
  }
  setFrame() {
    return this;
  }
  play() {
    return this;
  }
  setVisible(value: boolean) {
    this.visible = value;
    return this;
  }
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }
}
type Cell = { x: number; y: number };
type Walker = {
  sprite: Sprite;
  cell: Cell;
  path: Cell[];
  target?: Cell;
  at: string;
};

function setup(interior = false) {
  const state = newGame('family-partner', 42, 'en');
  state.day.kind = 'workday';
  state.day.weather = 'sunny';
  state.day.minute = interior ? 480 : 780;
  delete state.day.festival;
  if (!interior) state.flags.push('family-jamie-unemployed');
  const view: SceneView = { state, locale: 'en', paused: false, interior };
  const onInteract = vi.fn();
  const scene = new TownScene(view, onInteract, vi.fn(), vi.fn(), vi.fn());
  const anchors = new Map(
    townMap.layers
      .filter((layer) => ['places', 'anchors'].includes(layer.name))
      .flatMap((layer) => layer.objects ?? [])
      .map(
        (object) =>
          [object.name, { x: object.x / 16, y: object.y / 16 }] as const,
      ),
  );
  const collision = townMap.layers.find(
    (layer) => layer.name === 'collision',
  )!.data!;
  Object.assign(scene, {
    ready: true,
    map: { width: townMap.width, height: townMap.height },
    collision: {
      getTileAt: (x: number, y: number) => ({
        index: collision[y * townMap.width + x],
      }),
    },
    anchors,
    add: { sprite: (x: number, y: number) => new Sprite(x, y) },
    player: new Sprite(8, 10),
    keys: Object.fromEntries(
      ['LEFT', 'RIGHT', 'UP', 'DOWN', 'W', 'A', 'S', 'D'].map((key) => [
        key,
        { isDown: false },
      ]),
    ),
  });
  scene.sync(view);
  const residents = Reflect.get(scene, 'residents') as Map<string, Walker>;
  const jamie = residents.get('jamie')!;
  const depart = () => {
    state.flags = [];
    state.day.minute = 800;
    expect(npcAt(state, 'jamie')).toBe('away');
    scene.sync(view);
  };
  return { scene, view, residents, jamie, anchors, onInteract, depart };
}

test('a street resident walks to the actual station door, cannot be approached, and disappears on arrival', () => {
  const { scene, view, residents, jamie, anchors, onInteract, depart } =
    setup();
  expect(jamie.sprite.visible).toBe(true);
  depart();
  expect(jamie.path.at(-1)).toEqual(anchors.get('station'));
  expect(jamie.sprite.destroy).not.toHaveBeenCalled();
  scene.walkToNpc('jamie');
  expect(Reflect.get(scene, 'queued')).toBeUndefined();
  Object.assign(scene, { nearby: { kind: 'npc', id: 'jamie' } });
  scene.interact();
  expect(onInteract).not.toHaveBeenCalled();
  const steps = jamie.path.length;
  for (let step = 0; step < steps; step++) {
    scene.sync(view);
    scene.update(step * 400, 400);
    if (step < steps - 1) expect(jamie.sprite.destroy).not.toHaveBeenCalled();
  }
  expect(jamie.cell).toEqual(anchors.get('station'));
  expect(jamie.sprite.destroy).toHaveBeenCalledOnce();
  expect(residents.has('jamie')).toBe(false);
  scene.sync(view);
  expect(residents.has('jamie')).toBe(false);
});

test('a resident already walking finishes the current step before heading for the station', () => {
  const { scene, view, jamie, anchors, depart } = setup();
  view.state.day.minute = 660;
  scene.sync(view);
  scene.update(0, 100);
  const step = jamie.target;
  expect(step).toBeDefined();
  depart();
  expect(jamie.target).toEqual(step);
  expect(jamie.path.at(-1)).toEqual(anchors.get('station'));
  scene.update(400, 400);
  expect(jamie.cell).toEqual(step);
  expect(jamie.sprite.destroy).not.toHaveBeenCalled();
});

test('a household resident disappears immediately when becoming away', () => {
  const { residents, jamie, depart } = setup(true);
  expect(jamie.sprite.visible).toBe(true);
  depart();
  expect(jamie.sprite.destroy).toHaveBeenCalledOnce();
  expect(residents.has('jamie')).toBe(false);
});
