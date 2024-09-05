import { Howl } from "howler";

export interface DrumPart {
  key: string;
  name: string;
  src: string;
}

export type DrumKit = Record<string, Howl>;

export const joshDum: DrumPart[] = [
  { key: "kick", name: "Kick", src: "/drums/josh-dum/kick.ogg" },
  { key: "hihat-open", name: "Open HiHat", src: "/drums/josh-dum/open.ogg" },
  { key: "hihat-closed", name: "Closed HiHat", src: "/drums/josh-dum/hihat.ogg" },
  { key: "crash1", name: "Crash 1", src: "/drums/josh-dum/crash1.ogg" },
  { key: "crash2", name: "Crash 2", src: "/drums/josh-dum/crash2.ogg" },
  { key: "bell", name: "Bell", src: "/drums/josh-dum/bell.ogg" },
  { key: "snare1", name: "Snare 1", src: "/drums/josh-dum/snare1.ogg" },
  { key: "snare2", name: "Snare 2", src: "/drums/josh-dum/snare2.ogg" },
  { key: "tom1", name: "Tom 1", src: "/drums/josh-dum/tom1.ogg" },
  { key: "tom2", name: "Tom 2", src: "/drums/josh-dum/tom2.ogg" },
  { key: "ride", name: "Ride", src: "/drums/josh-dum/ride.ogg" },
  { key: "splash", name: "Splash", src: "/drums/josh-dum/splash.ogg" },
];

export function initKit(kit: DrumPart[]): DrumKit {
  const drumKit: DrumKit = {};
  for (const part of kit) {
    const audio = new Howl({ src: part.src });
    drumKit[part.key] = audio;
  }
  return drumKit as DrumKit;
}
