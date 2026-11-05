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

export default function TownCanvas(props: TownCanvasProps) {
  const { t } = useTranslation();
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<TownScene | undefined>(undefined);
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    const element = host.current!;
    const town = new TownScene(props.sprite, latest.current, (id) =>
      latest.current.onLocation(id),
    );
    scene.current = town;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: element,
      width: element.clientWidth,
      height: element.clientHeight,
      backgroundColor: '#a8c580',
      pixelArt: true,
      roundPixels: true,
      input: { keyboard: { target: element } },
      scale: { mode: Phaser.Scale.RESIZE },
      scene: town,
      banner: false,
      audio: { noAudio: true },
    });
    const observer = new ResizeObserver(() => {
      game.scale.resize(element.clientWidth, element.clientHeight);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      scene.current = undefined;
      game.destroy(true);
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
