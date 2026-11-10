import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';
import { newGame } from '@uk-immigration/game';
import TownCanvas, { type TownCanvasProps } from '../app/game/town-canvas';

vi.mock('react', { spy: true });
vi.mock('phaser', () => ({ Scene: class {} }));
afterEach(() => {
  vi.restoreAllMocks();
});

test('a destination request focuses the keyboard host without scrolling before starting the walk', () => {
  const destinationButton = {};
  let activeElement: unknown = destinationButton;
  const host = {
    focus: vi.fn(() => {
      activeElement = host;
    }),
  };
  const walkToLocation = vi.fn(() => {
    expect(activeElement).toBe(host);
  });
  const effects: React.EffectCallback[] = [];
  const props: TownCanvasProps = {
    state: newGame('skilled-worker', 42, 'en'),
    locale: 'en',
    interior: false,
    paused: false,
    onReady: vi.fn(),
    onInteract: vi.fn(),
    onNearby: vi.fn(),
    onStep: vi.fn(),
    interactRequest: 0,
    destination: { location: 'shop', request: 1 },
  };
  vi.spyOn(React, 'useRef')
    .mockReturnValueOnce({ current: host })
    .mockReturnValueOnce({ current: { walkToLocation } })
    .mockReturnValueOnce({ current: props });
  vi.spyOn(React, 'useEffect').mockImplementation((effect) => {
    effects.push(effect);
  });
  const html = renderToStaticMarkup(<TownCanvas {...props} />);
  expect(html).toContain('role="application"');
  expect(html).toContain('tabindex="0"');
  expect(activeElement).toBe(destinationButton);
  effects.at(-1)!();
  expect(host.focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });
  expect(activeElement).toBe(host);
  expect(walkToLocation).toHaveBeenCalledExactlyOnceWith('shop');
});
