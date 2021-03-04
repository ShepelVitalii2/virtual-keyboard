import keyLayout from './keyLayoutData';
import {
  toggleCapsLock,
  onBackspacePress,
  onSpacePress,
  onEnterPress,
  insertText,
} from './auxiliaryFuncForKeyboard';

import runOnKeys from './toggleLanguage';

class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      textarea: null,
      keysContainer: null,
      keys: [],
    };

    this.properties = {
      value: '',
      capsLock: false,
      isRussian: false,
    };
  }

  initTextarea() {
    this.elements.textarea = document.createElement('textarea');
    this.elements.textarea.classList.add('use-keyboard-input');
    this.elements.textarea.id = 'text';
    document.body.appendChild(this.elements.textarea);
  }

  initVirtual() {
    const { isRussian } = this.properties;

    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');

    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key',
    );

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    if (isRussian === false) {
      localStorage.setItem('lang', 'false');
    }
    if (isRussian === true) {
      localStorage.setItem('lang', 'true');
    }
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    const createIconHTML = iconName => {
      return `<i class="material-icons">${iconName}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button');
      const insertLineBreak =
        ['Backspace', '\\', 'Enter', '/'].indexOf(key[0]) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      keyElement.setAttribute('data-key', `${key[2]}`);

      switch (key[0]) {
        case 'Backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', onBackspacePress);

          break;

        case 'Tab':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('sync_alt');

          keyElement.addEventListener('click', () => {
            this.elements.textarea.focus();
            this.elements.textarea.value += '\t';
          });

          break;

        case 'CapsLock':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable',
          );
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            toggleCapsLock();
          });

          break;

        case 'Enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', onEnterPress);

          break;

        case 'Shift':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('upgrade');

          break;

        case 'Control':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('done_outline');

          break;

        case 'Alt':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('list_alt');

          break;

        case 'Space':
          keyElement.classList.add('keyboard__key--extra-wide');

          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', onSpacePress);

          break;

        default: {
          let [, languageLetter] = key;

          if (!this.properties.isRussian) {
            [languageLetter] = key;
          }
          keyElement.textContent = languageLetter.toLowerCase();

          keyElement.addEventListener('click', () => {
            insertText(key);
          });

          break;
        }
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  initReal() {
    document.addEventListener('keydown', e => {
      const key = document.querySelector(`button[data-key='${e.code}']`);
      e.preventDefault();
      switch (e.code) {
        case 'Backspace':
          onBackspacePress();

          break;

        case 'Tab':
          this.elements.textarea.value += '\t';
          break;

        case 'CapsLock':
          toggleCapsLock();
          key.classList.add('activeBtn');
          return;

        case 'Enter':
          onEnterPress();

          break;

        case 'ShiftLeft':
          toggleCapsLock();
          key.classList.add('activeBtn');
          break;

        case 'ControlLeft':
        case 'ControlRight':
        case 'AltLeft':
        case 'AltRight':
          break;

        case 'Space':
          onSpacePress();

          break;

        default:
          insertText(key.textContent);
      }

      key.classList.add('activeBtn');
    });

    document.addEventListener('keyup', e => {
      const key = document.querySelector(`button[data-key='${e.code}']`);
      if (e.code === 'ShiftLeft') {
        toggleCapsLock();
      }
      key.classList.remove('activeBtn');
    });
  }
}

const keyboard = new Keyboard();

export default keyboard;
