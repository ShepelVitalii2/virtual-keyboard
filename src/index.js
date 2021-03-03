import './style.css';
import keyLayout from './js/keyLayoutData';

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
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');

    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key',
    );

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    if (this.properties.isRussian === false) {
      localStorage.setItem('lang', 'false');
    }
    if (this.properties.isRussian === true) {
      localStorage.setItem('lang', 'true');
    }
  }

  createKeys() {
    const fragment = document.createDocumentFragment();
    const createIconHTML = icon_name => {
      return `<i class="material-icons">${icon_name}</i>`;
    };
    const text = document.getElementById('text');

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button');
      const insertLineBreak =
        ['Backspace', '\\', 'Enter', '/'].indexOf(key[0]) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      keyElement.setAttribute('data-key', `${key[2]}`);

      function pressBackspace(e) {
        text.focus();

        key = e.target.textContent;

        const cursorAt = Math.max(0, text.selectionStart - 1);

        text.value =
          text.value.slice(0, cursorAt) + text.value.slice(text.selectionEnd);

        text.selectionStart = cursorAt;
        text.selectionEnd = text.selectionStart;
        keyboard.properties.value = text.value;
      }

      switch (key[0]) {
        case 'Backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', pressBackspace);

          break;

        case 'Tab':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('sync_alt');

          keyElement.addEventListener('click', () => {
            this.properties.value = text.value;

            this.properties.value += '\t';
            text.value = this.properties.value;
          });

          break;

        case 'CapsLock':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable',
          );
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
          });

          break;

        case 'Enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            text.focus();
            const cursorAt = text.selectionStart;
            this.properties.value = text.value;
            this.properties.value += '\n';
            text.value = this.properties.value;

            if (cursorAt !== text.value.length - 1) {
              text.value =
                text.value.slice(0, cursorAt - 1) +
                '\n' +
                text.value.slice(cursorAt);
              text.selectionStart = cursorAt;
              text.selectionEnd = text.selectionStart;
              keyboard.properties.value = text.value;
            }
          });

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

          keyElement.addEventListener('click', () => {
            text.focus();

            const cursorAt = text.selectionStart;
            text.value =
              text.value.slice(0, cursorAt) + ' ' + text.value.slice(cursorAt);
            text.selectionStart = 1 + cursorAt;
            text.selectionEnd = text.selectionStart;
          });

          break;

        default: {
          let [, languageLetter] = key;
          // console.log(key);

          if (!this.properties.isRussian) {
            [languageLetter] = key;
            // console.log(key);
          }
          keyElement.textContent = languageLetter.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.insertText(key);
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

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    this.elements.keys.forEach(key => {
      const myKey = key;
      if (myKey.childElementCount === 0) {
        if (this.properties.capsLock) {
          myKey.textContent = myKey.textContent.toUpperCase();
        } else {
          myKey.textContent = myKey.textContent.toLowerCase();
        }
      }
    });
  }

  insertText(e) {
    text.focus();

    const key = keyboard.properties.isRussian === true ? e[1] : e[0];

    const cursorAt = text.selectionStart;

    if (!Array.isArray(e)) {
      text.value =
        text.value.slice(0, cursorAt) + e + text.value.slice(text.selectionEnd);
    }
    if (Array.isArray(e)) {
      if (!this.properties.capsLock) {
        text.value =
          text.value.slice(0, cursorAt) +
          key +
          text.value.slice(text.selectionEnd);
        // console.log(text.value);
      }

      if (this.properties.capsLock) {
        text.value =
          text.value.slice(0, cursorAt) +
          key.toUpperCase() +
          text.value.slice(text.selectionEnd);
      }
    }

    text.selectionStart = cursorAt + 1;
    text.selectionEnd = text.selectionStart;
    keyboard.properties.value = text.value;
  }

  initReal() {
    document.addEventListener('keydown', event => {
      const key = document.querySelector(`button[data-key='${event.code}']`);
      const text = document.querySelector('.use-keyboard-input');
      event.preventDefault();
      switch (event.code) {
        case 'Backspace':
          text.focus();

          const cursorAt = Math.max(0, text.selectionStart - 1);

          text.value =
            text.value.slice(0, cursorAt) + text.value.slice(text.selectionEnd);

          text.selectionStart = cursorAt;
          text.selectionEnd = text.selectionStart;
          keyboard.properties.value = text.value;

          break;

        case 'Tab':
          document.querySelector('.use-keyboard-input').value += '\t';
          break;

        case 'CapsLock':
          this.toggleCapsLock();
          key.classList.add('activeBtn');
          return;

        case 'Enter':
          const cursorPos = text.selectionStart;
          this.properties.value = text.value;
          this.properties.value += '\n';
          text.value = this.properties.value;

          if (cursorPos !== text.value.length - 1) {
            text.value =
              text.value.slice(0, cursorPos - 1) +
              '\n' +
              text.value.slice(cursorPos);
            text.selectionStart = cursorPos;
            text.selectionEnd = text.selectionStart;
            keyboard.properties.value = text.value;
          }
          break;

        case 'ShiftLeft':
          this.toggleCapsLock();
          key.classList.add('activeBtn');
          break;

        case 'ControlLeft':
        case 'ControlRight':
        case 'AltLeft':
        case 'AltRight':
          break;

        case 'Space':
          text.focus();

          const cursor = text.selectionStart;
          text.value =
            text.value.slice(0, cursor) + ' ' + text.value.slice(cursor);
          text.selectionStart = 1 + cursor;
          text.selectionEnd = text.selectionStart;
          keyboard.properties.value = text.value;
          break;

        default:
          this.insertText(key.textContent);
      }

      key.classList.add('activeBtn');
    });

    document.addEventListener('keyup', event => {
      const key = document.querySelector(`button[data-key='${event.code}']`);
      if (event.code === 'ShiftLeft') {
        this.toggleCapsLock();
      }
      key.classList.remove('activeBtn');
    });

    function runOnKeys(func, ...codes) {
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
          this.properties.isRussian = !this.properties.isRussian;

          document.querySelector('.keyboard').remove();
          this.initVirtual();
        }, 100);
      },
      'ShiftLeft',
      'AltLeft',
    );
  }
}

const keyboard = new Keyboard();

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
