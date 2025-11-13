// Core utility helpers for the RPG project
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const randomChoice = (list) => list[Math.floor(Math.random() * list.length)];
export const timestamp = () => new Date().toLocaleTimeString();

