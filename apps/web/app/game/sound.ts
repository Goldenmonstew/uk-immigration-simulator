// Audio is created only after a real pointer/key gesture in the game client.
let unlocked = false;
let muted = true;
let music: HTMLAudioElement | undefined;
let track = '';
let desired = '';
let hidden = false;
const sounds = new Map<string, HTMLAudioElement>();
const files = {
  step: '1',
  voice: 'voice-1',
  menu: 'menu-1',
  coin: 'gold-1',
  achievement: 'succes',
};
export function playSound(kind: keyof typeof files, npc = '') {
  if (!unlocked || muted || hidden) return;
  let audio = sounds.get(kind);
  if (!audio) {
    audio = new Audio(`/game/assets/ninja-adventure/sounds/${files[kind]}.ogg`);
    audio.volume = kind === 'step' ? 0.12 : 0.23;
    sounds.set(kind, audio);
  }
  audio.pause();
  audio.currentTime = 0;
  if (kind === 'voice') {
    audio.preservesPitch = false;
    audio.playbackRate =
      0.8 +
      [
        'margaret',
        'priya',
        'ade',
        'helen',
        'dave',
        'rahman',
        'lina',
        'gareth',
        'jamie',
        'ka-ning-partner',
        'ka-ning-child',
      ].indexOf(npc) /
        20;
  }
  void audio.play().catch(() => {});
}
function syncMusic() {
  if (!unlocked || muted || hidden || !desired) {
    music?.pause();
    return;
  }
  if (track !== desired) {
    music?.pause();
    music = new Audio(desired);
    music.loop = true;
    music.volume = 0.17;
    track = desired;
  }
  void music?.play().catch(() => {});
}
export function unlockSound() {
  unlocked = true;
  syncMusic();
}
export function setMuted(value: boolean) {
  muted = value;
  if (value) for (const audio of sounds.values()) audio.pause();
  syncMusic();
  try {
    localStorage.setItem('uk-immigration-life-muted', String(value));
  } catch {
    /* Storage may be unavailable. */
  }
}
export function readMuted() {
  try {
    return localStorage.getItem('uk-immigration-life-muted') !== 'false';
  } catch {
    return true;
  }
}
export function setSoundSeason(quarter: number, festival: boolean) {
  desired = `/game/assets/ninja-adventure/musics/theme-${festival ? 5 : [9, 2, 3, 4][quarter - 1]}.ogg`;
  syncMusic();
}
export function hideSound(value: boolean) {
  hidden = value;
  syncMusic();
}
export function stopSound() {
  desired = '';
  music?.pause();
  for (const audio of sounds.values()) audio.pause();
}
