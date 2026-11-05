'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { useTranslation } from '../../i18n/locale';
import type { LocationId } from './mock-core';
import { TownScene } from './scene';
import styles from './town-canvas.module.css';

export interface TownCanvasProps {
  locale: 'zh-CN' | 'en';
  quarter: 1 | 2 | 3 | 4;
  sprite: string;
  paused: boolean;
  onLocation: (id: LocationId) => void;
  destination?: { location: LocationId; request: number };
}

export function observeTownSize(
  element: HTMLDivElement,
  createGame: (type: number) => Phaser.Game,
) {
  let game: Phaser.Game | undefined;
  let started = false;
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = element;
    if (width <= 0 || height <= 0) return;
    if (game) {
      game.scale.resize(width, height);
    } else if (!started) {
      started = true;
      try {
        game = createGame(Phaser.AUTO);
      } catch {
        game = createGame(Phaser.CANVAS);
      }
    }
  };
  const observer = new ResizeObserver(resize);
  observer.observe(element);
  resize();
  const frame = requestAnimationFrame(resize);
  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    started = true;
    game?.destroy(true);
    game = undefined;
  };
}

export default function TownCanvas(props: TownCanvasProps) {
  const { t } = useTranslation();
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<TownScene | undefined>(undefined);
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    const element = host.current!;
    const stop = observeTownSize(element, (type) => {
      const town = new TownScene(props.sprite, latest.current, (id) =>
        latest.current.onLocation(id),
      );
      scene.current = town;
      if (latest.current.destination)
        town.walkToLocation(latest.current.destination.location);
      return new Phaser.Game({
        type,
        parent: element,
        backgroundColor: '#a8c580',
        pixelArt: true,
        roundPixels: true,
        input: { keyboard: { target: element } },
        scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
        scene: town,
        banner: false,
        audio: { noAudio: true },
      });
    });
    return () => {
      stop();
      scene.current = undefined;
    };
  }, [props.sprite]);

  useEffect(() => {
    scene.current?.sync({
      locale: props.locale,
      quarter: props.quarter,
      paused: props.paused,
    });
  }, [props.locale, props.quarter, props.paused]);

  useEffect(() => {
    if (props.destination)
      scene.current?.walkToLocation(props.destination.location);
  }, [props.destination]);

  return (
    <div
      ref={host}
      className={styles.canvas}
      role="application"
      aria-label={t('game.town')}
      tabIndex={props.paused ? -1 : 0}
      onPointerDown={() => host.current?.focus({ preventScroll: true })}
      onBlur={() => scene.current?.halt()}
    />
  );
}
