import './style.css';
// import keyLayout from './js/keyLayoutData';

import keyboard from './js/Keyboard';

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('lang') === 'false') {
    keyboard.properties.isRussian = false;
  }
  if (localStorage.getItem('lang') === 'true') {
    keyboard.properties.isRussian = true;
  }
  keyboard.initTextarea();
  keyboard.initVirtual();
  keyboard.initReal();
});
