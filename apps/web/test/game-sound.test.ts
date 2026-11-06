import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

test('sound waits for a gesture, changes seasonal tracks, and persists mute', async () => {
  const made: FakeAudio[] = [];
  class FakeAudio {
    loop = false;
    volume = 1;
    currentTime = 0;
    preservesPitch = true;
    playbackRate = 1;
    play = vi.fn(async () => {});
    pause = vi.fn();
    constructor(public src: string) {
      made.push(this);
    }
  }
  const saved = new Map<string, string>();
  vi.stubGlobal('Audio', FakeAudio);
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => saved.set(key, value),
  });
  const sound = await import('../app/game/sound');
  expect(sound.readMuted()).toBe(true);
  sound.setMuted(false);
  sound.setSoundSeason(1, false);
  sound.playSound('step');
  expect(made).toHaveLength(0);
  sound.unlockSound();
  expect(made[0].src).toContain('theme-9.ogg');
  expect(made[0].play).toHaveBeenCalledOnce();
  sound.setSoundSeason(2, false);
  expect(made[0].pause).toHaveBeenCalled();
  expect(made[1].src).toContain('theme-2.ogg');
  sound.setSoundSeason(3, true);
  expect(made[2].src).toContain('theme-5.ogg');
  sound.playSound('voice', 'margaret');
  const voice = made.at(-1)!;
  const firstPitch = voice.playbackRate;
  sound.playSound('voice', 'ade');
  expect(voice.playbackRate).not.toBe(firstPitch);
  sound.playSound('voice', 'yao-flatmate');
  expect(voice.playbackRate).toBeCloseTo(1.35);
  expect(voice.preservesPitch).toBe(false);
  sound.setMuted(true);
  expect(sound.readMuted()).toBe(true);
  const calls = voice.play.mock.calls.length;
  sound.playSound('voice', 'ade');
  expect(voice.play).toHaveBeenCalledTimes(calls);
  sound.setMuted(false);
  sound.hideSound(true);
  const music = made.find((a) => a.src.includes('theme-5'))!;
  expect(music.pause).toHaveBeenCalled();
  sound.stopSound();
});
