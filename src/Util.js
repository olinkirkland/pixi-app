import * as random from './random.json';

export function randomUserName() {
  console.log(random);
  // const names = random.names;
  // const adjectives = random.adjectives;

  // console.log('====', names);
  // let name = names[Math.floor(Math.random() * names.length)];

  // const r = Math.random();
  // let separator;
  // if (r < 0.3) {
  //   separator = '.';
  // } else if (r < 0.6) {
  //   separator = '_';
  // } else {
  //   separator = '';
  // }

  // if (Math.random() < 0.5) {
  //   name += separator;
  //   if (Math.random() < 0.5) name += Math.floor(Math.random() * 99);
  //   else name += Math.floor(Math.random() * 59) + 1960;
  // }

  // if (Math.random() < 0.5)
  //   name =
  //     adjectives[Math.floor(Math.random() * adjectives.length)] +
  //     separator +
  //     name;

  // return name;
  return '';
}

export const skins = ['blue', 'green', 'orange', 'purple', 'tan'];
