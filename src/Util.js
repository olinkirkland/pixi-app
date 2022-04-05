import { adjectives, names } from './data/random-user-data';

export function randomUserName() {
  let name = names[Math.floor(Math.random() * names.length)];

  const r = Math.random();
  let separator;
  if (r < 0.3) {
    separator = '.';
  } else if (r < 0.6) {
    separator = '_';
  } else {
    separator = '';
  }

  if (Math.random() < 0.5) {
    name += separator;
    if (Math.random() < 0.5) name += Math.floor(Math.random() * 99);
    else name += Math.floor(Math.random() * 59) + 1960;
  }

  if (Math.random() < 0.5)
    name =
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      separator +
      name;

  if (Math.random() < 0.2) name = name.toLowerCase();

  return name;
}

export function generateJoinAction() {
  const action = {
    id: Math.floor(Math.random() * 9999),
    action: 'join',
    value: {
      skin: skins[Math.floor(Math.random() * skins.length)],
      name: randomUserName(),
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 600)
    }
  };

  return action;
}

export const skins = ['blue', 'green', 'orange', 'purple', 'tan'];
