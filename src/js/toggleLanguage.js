import keyboard from './Keyboard';

export default function runOnKeys(func, ...codes) {
  const pressed = new Set();

  document.addEventListener('keydown', event => {
    pressed.add(event.code);

    for (let i = 0; i < codes.length; i += 1) {
      if (!pressed.has(codes[i])) {
        return;
      }
    }

    pressed.clear();
    func();
  });

  document.addEventListener('keyup', event => {
    pressed.delete(event.code);
  });
}

runOnKeys(
  () => {
    setTimeout(() => {
      keyboard.properties.isRussian = !keyboard.properties.isRussian;

      document.querySelector('.keyboard').remove();
      keyboard.initVirtual();
    }, 100);
  },
  'ShiftLeft',
  'AltLeft',
);
