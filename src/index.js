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
      // change from localStorage
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
    // use lang
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

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      // Every button have date attribute(with code)
      keyElement.setAttribute('data-key', `${key[2]}`);

      function insertText(e) {
        // text.focus();
        const cursorAt = Math.max(0, text.selectionStart - 1);
        console.log(e);
        console.log('12312312');
        text.value =
          text.value.slice(0, cursorAt) +
          e +
          text.value.slice(text.selectionEnd);

        //Определяем где находится курсор
        text.selectionStart = cursorAt;
        text.selectionEnd = text.selectionStart;
        keyboard.properties.value = text.value;
      }

      function pressBackspace(e) {
        //Что бы значение нахождения курсора в начале и в конце при нажатии бкспйс не обнулялось
        text.focus();

        //Значение буквы
        key = e.target.textContent;
        //Значение строки
        console.log('text value : ' + text.value);

        //Где находится курсор
        const cursorAt = Math.max(0, text.selectionStart - 1);
        // console.log('cursorAt : ' + cursorAt);
        //длинна строки
        // console.log('text.value.length : ' + text.value.length);
        // где заканчивается куроср
        // console.log('text.selectionEnd : ' + text.selectionEnd);

        //Соединяем две строки в -1 символ.
        text.value =
          text.value.slice(0, cursorAt) + text.value.slice(text.selectionEnd);

        //Определяем где находится курсор
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
            this.properties.value = text.value;
            this.properties.value += '\n';
            text.value = this.properties.value;
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
            this.properties.value = document.querySelector(
              '.use-keyboard-input',
            ).value;
            this.properties.value += ' ';
            document.querySelector(
              '.use-keyboard-input',
            ).value = this.properties.value;
          });

          break;

        default: {
          let [, lenguageLetter] = key;
          if (!this.properties.isRussian) {
            [lenguageLetter] = key;
          }
          keyElement.textContent = lenguageLetter.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.properties.value = text.value;
            this.properties.value += lenguageLetter.toLowerCase();

            if (this.properties.capsLock) {
              this.properties.value = text.value;
              this.properties.value += lenguageLetter.toUpperCase();
            }
            insertText(key);

            text.value = this.properties.value;
          });

          break;
        }
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        // add br after some keys
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

  initReal() {
    document.addEventListener('keydown', event => {
      // Use date attribute
      const key = document.querySelector(`button[data-key='${event.code}']`);
      const text = document.querySelector('.use-keyboard-input');
      event.preventDefault();
      switch (event.code) {
        case 'Backspace':
          this.properties.value = text.value;
          this.properties.value = this.properties.value.slice(
            0,
            this.properties.value.length - 1,
          );
          text.value = this.properties.value;
          break;

        case 'Tab':
          document.querySelector('.use-keyboard-input').value += '\t';
          break;

        case 'CapsLock':
          this.toggleCapsLock();
          key.classList.add('activeBtn');
          return;

        case 'Enter':
          document.querySelector('.use-keyboard-input').value += '\n';
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
          document.querySelector('.use-keyboard-input').value += ' ';
          break;

        default:
          keyLayout.forEach(item => {
            if (item[2] === event.code) {
              // english
              if (!this.properties.isRussian) {
                if (!this.properties.capsLock) {
                  text.value += item[0].toLowerCase();
                }
                if (this.properties.capsLock) {
                  text.value += item[0].toUpperCase();
                }
                // russian
              } else {
                if (!this.properties.capsLock) {
                  text.value += item[1].toLowerCase();
                }
                if (this.properties.capsLock) {
                  text.value += item[1].toUpperCase();
                }
              }
            }
          });
      }

      key.classList.add('activeBtn');
      // console.clear(); //!====================================
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

        // Are all keys from the set pressed?
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
