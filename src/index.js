import './style.css';
import { keyLayout } from './js/keyLayoutData';

const text = document.getElementById('use-keyboard-input');
const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    language: false,
  },

  init() {
    //Create main element
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    //Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');

    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key',
    );

    // add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    //Automatically use keyboard for elements
    document.querySelectorAll('.use-keyboard-input').forEach(element => {
      element.addEventListener('focus', () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
    });
    document.onkeypress = function (e) {
      const textArea = document.querySelector('.use-keyboard-input');
      textArea.blur();

      if (e.key !== 'Enter') {
        if (text.selectionEnd !== Keyboard.properties.value.length) {
          return;
        }
        Keyboard.properties.value += e.key;
        // text.value = Keyboard.properties.value;

        // console.log(text.value);
      }

      Keyboard._triggerEvent('oninput');
    };
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    const createIconHTML = icon_name => {
      return `<i class="material-icons">${icon_name}</i>`;
    };
    this._changheLanguage().forEach((key, index) => {
      const keyElement = document.createElement('button');
      keyElement.dataset.keyCode = key;
      const insertLineBreak =
        ['backspace', 'p', 'enter', 'language', 'ъ'].indexOf(key) !== -1;

      //add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.setAttribute('id', `${index}`);
      keyElement.classList.add('keyboard__key');

      document.addEventListener('keydown', e => {
        if (
          e.code === 'Backspace' &&
          keyElement.dataset.keyCode === 'backspace'
        ) {
          keyElement.classList.add('activeBtn');

          useBackspaceBtn();
          // Keyboard.properties.value += 'HELLO';
          // console.log(Keyboard.properties.value);
          e.preventDefault();
        }
        if (e.code === 'CapsLock' && keyElement.dataset.keyCode === 'caps') {
          keyElement.classList.add('activeBtn');
          useCapsLockBtn();
        }
        if (e.code === 'Enter' && keyElement.dataset.keyCode === 'enter') {
          keyElement.classList.add('activeBtn');
          useEnterBtn();
        }
        if (e.code === 'Space' && keyElement.dataset.keyCode === 'space') {
          keyElement.classList.add('activeBtn');
          useSpaceBtn();
        }

        if (keyElement.dataset.keyCode === e.key.toLowerCase()) {
          keyElement.classList.add('activeBtn');
          // useRegularBtn();
          // e.preventDefault();
          // console.log(text.selectionEnd);
          if (text.selectionEnd !== this.properties.value.length) {
            const cursorAt = text.selectionStart;
            insertText(key);
            text.selectionStart = cursorAt + key.length;
            text.selectionEnd = text.selectionStart;
            Keyboard.properties.value = text.value;
          }
        }
      });

      document.addEventListener('keyup', e => {
        if (keyElement.dataset.keyCode === key) {
          keyElement.classList.remove('activeBtn');
        }
      });

      function insertText(letter) {
        const cursorAt = text.selectionStart;
        if (letter === 'backspace') {
          // const letter = '';
          letter.length = 1;
          console.log(letter.length);
          text.value =
            text.value.slice(0, cursorAt) +
            letter +
            text.value.slice(text.selectionEnd);
          console.log(letter);
        } else {
          text.value =
            text.value.slice(0, cursorAt) +
            letter +
            text.value.slice(text.selectionEnd);
        }
      }

      const useBackspaceBtn = () => {
        const cursorAt = Math.max(0, text.selectionStart - 1);

        text.value =
          text.value.slice(0, cursorAt) + text.value.slice(text.selectionEnd);

        text.selectionStart = cursorAt;
        text.selectionEnd = text.selectionStart;
        this.properties.value = text.value;
      };

      const useCapsLockBtn = () => {
        this._toggleCapsLock();

        keyElement.classList.toggle(
          'keyboard__key--active',
          this.properties.capsLock,
        );
      };

      const useEnterBtn = () => {
        this.properties.value += '\n';
        this._triggerEvent('oninput');
      };

      const useSpaceBtn = () => {
        this.properties.value += ' ';
        this._triggerEvent('oninput');
      };

      const useDoneBtn = () => {
        this.close();
        this._triggerEvent('onclose');
      };

      const useRegularBtn = () => {
        this.properties.value += this.properties.capsLock
          ? key.toUpperCase()
          : key.toLowerCase();
        this._triggerEvent('oninput');
      };

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          // keyElement.addEventListener('click', useBackspaceBtn);

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1,
            );
            this._triggerEvent('oninput');
          });

          break;

        case 'language':
          keyElement.classList.add('keyboard__key--wide');

          keyElement.innerHTML = createIconHTML('language');

          keyElement.addEventListener('click', () => {
            this._toggleLanguage();
          });

          break;

        case 'caps':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable',
          );
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', useCapsLockBtn);

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', useEnterBtn);

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', useSpaceBtn);

          break;

        case 'done':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--dark',
          );
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', useDoneBtn);

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', useRegularBtn);

          break;
      }
      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleLanguage() {
    this.properties.language = !this.properties.language;
    this.elements.keysContainer.innerHTML = ' ';
    this.elements.keysContainer.appendChild(this._createKeys());
  },

  _changheLanguage() {
    if (!this.properties.language) {
      return keyLayout[0];
    } else {
      return keyLayout[1];
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
      console.log(key.childElementCount);
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  },
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});

///////////////////////////////////////////////////////////////////////////////////

// class Keyboard {
//   constructor() {
//     this.elements = {
//       main: null,
//       textarea: null,
//       keysContainer: null,
//       keys: [],
//     };

//     this.properties = {
//       value: '',
//       capsLock: false,
//       // change from localStorage
//       isRrussian: false,
//     };

//     this.keyLayout = [
//       ['`', 'ё', 'Backquote'],
//       ['1', '1', 'Digit1'],
//       ['2', '2', 'Digit2'],
//       ['3', '3', 'Digit3'],
//       ['4', '4', 'Digit4'],
//       ['5', '5', 'Digit5'],
//       ['6', '6', 'Digit6'],
//       ['7', '7', 'Digit7'],
//       ['8', '8', 'Digit8'],
//       ['9', '9', 'Digit9'],
//       ['0', '0', 'Digit0'],
//       ['-', '-', 'Minus'],
//       ['=', '=', 'Equal'],
//       ['Backspace', 'Backspace', 'Backspace'],
//       ['Tab', 'Tab', 'Tab'],
//       ['q', 'й', 'KeyQ'],
//       ['w', 'ц', 'KeyW'],
//       ['e', 'у', 'KeyE'],
//       ['r', 'к', 'KeyR'],
//       ['t', 'е', 'KeyT'],
//       ['y', 'н', 'KeyY'],
//       ['u', 'г', 'KeyU'],
//       ['i', 'ш', 'KeyI'],
//       ['o', 'щ', 'KeyO'],
//       ['p', 'з', 'KeyP'],
//       ['[', 'х', 'BracketLeft'],
//       [']', 'ъ', 'BracketRight'],
//       ['\\', '|', 'Backslash'],
//       ['CapsLock', 'CapsLock', 'CapsLock'],
//       ['a', 'ф', 'KeyA'],
//       ['s', 'ы', 'KeyS'],
//       ['d', 'в', 'KeyD'],
//       ['f', 'а', 'KeyF'],
//       ['g', 'п', 'KeyG'],
//       ['h', 'р', 'KeyH'],
//       ['j', 'о', 'KeyJ'],
//       ['k', 'л', 'KeyK'],
//       ['l', 'д', 'KeyL'],
//       [';', 'ж', 'Semicolon'],
//       ["'", 'э', 'Quote'],
//       ['Enter', 'Enter', 'Enter'],
//       ['Shift', 'Shift', 'ShiftLeft'],
//       ['z', 'я', 'KeyZ'],
//       ['x', 'ч', 'KeyX'],
//       ['c', 'с', 'KeyC'],
//       ['v', 'и', 'KeyV'],
//       ['b', 'и', 'KeyB'],
//       ['n', 'т', 'KeyN'],
//       ['m', 'ь', 'KeyM'],
//       [',', 'б', 'Comma'],
//       ['.', 'ю', 'Period'],
//       ['/', '/', 'Slash'],
//       ['Control', 'Control', 'ControlLeft'],
//       ['Alt', 'Alt', 'AltLeft'],
//       ['Space', 'Space', 'Space'],
//       ['Alt', 'Alt', 'AltRight'],
//       ['Control', 'Control', 'ControlRight'],
//     ];
//   }

//   initTextarea() {
//     this.elements.textarea = document.createElement('textarea');
//     this.elements.textarea.classList.add('use-keyboard-input');
//     document.body.appendChild(this.elements.textarea);
//   }

//   initVirtual() {
//     // Create main elements
//     this.elements.main = document.createElement('div');
//     this.elements.keysContainer = document.createElement('div');

//     // Setup main elements
//     this.elements.main.classList.add('keyboard');
//     this.elements.keysContainer.classList.add('keyboard__keys');
//     // use lang
//     this.elements.keysContainer.appendChild(this.createKeys());

//     this.elements.keys = this.elements.keysContainer.querySelectorAll(
//       '.keyboard__key',
//     );

//     // Add to DOM
//     this.elements.main.appendChild(this.elements.keysContainer);
//     document.body.appendChild(this.elements.main);

//     if (this.properties.isRrussian === false) {
//       localStorage.setItem('lang', 'false');
//     }
//     if (this.properties.isRrussian === true) {
//       localStorage.setItem('lang', 'true');
//     }
//   }

//   createKeys() {
//     const fragment = document.createDocumentFragment();

//     this.keyLayout.forEach(key => {
//       const keyElement = document.createElement('button');
//       const insertLineBreak =
//         ['Backspace', '\\', 'Enter', '/'].indexOf(key[0]) !== -1;

//       // Add attributes/classes
//       keyElement.setAttribute('type', 'button');
//       keyElement.classList.add('keyboard__key');
//       // Every button have date attribute(with code)
//       keyElement.setAttribute('data-key', `${key[2]}`);

//       switch (key[0]) {
//         case 'Backspace':
//           keyElement.classList.add('keyboard__key_wide');
//           keyElement.innerHTML = '<span>Backspace</span>';

//           keyElement.addEventListener('click', () => {
//             this.properties.value = document.querySelector(
//               '.use-keyboard-input',
//             ).value;
//             this.properties.value = this.properties.value.slice(
//               0,
//               this.properties.value.length - 1,
//             );
//             document.querySelector(
//               '.use-keyboard-input',
//             ).value = this.properties.value;
//           });

//           break;

//         case 'Tab':
//           keyElement.classList.add('keyboard__key_wide');
//           keyElement.innerHTML = '<span>Tab</span>';

//           keyElement.addEventListener('click', () => {
//             this.properties.value = document.querySelector(
//               '.use-keyboard-input',
//             ).value;
//             this.properties.value += '\t';
//             document.querySelector(
//               '.use-keyboard-input',
//             ).value = this.properties.value;
//           });

//           break;

//         case 'CapsLock':
//           keyElement.classList.add('keyboard__key_wide');
//           keyElement.innerHTML = '<span>CapsLock</span>';

//           keyElement.addEventListener('click', () => {
//             this.toggleCapsLock();
//           });

//           break;

//         case 'Enter':
//           keyElement.classList.add('keyboard__key_wide');
//           keyElement.innerHTML = '<span>Enter</span>';

//           keyElement.addEventListener('click', () => {
//             this.properties.value = document.querySelector(
//               '.use-keyboard-input',
//             ).value;
//             this.properties.value += '\n';
//             document.querySelector(
//               '.use-keyboard-input',
//             ).value = this.properties.value;
//           });

//           break;

//         case 'Shift':
//           keyElement.classList.add('keyboard__key_wide');
//           keyElement.innerHTML = '<span>Shift</span>';

//           break;

//         case 'Control':
//           keyElement.classList.add('keyboard__key_wide');
//           keyElement.innerHTML = '<span>Control</span>';

//           break;

//         case 'Alt':
//           keyElement.classList.add('keyboard__key_wide');
//           keyElement.innerHTML = '<span>Alt</span>';

//           break;

//         case 'Space':
//           keyElement.classList.add('keyboard__key_extra-wide');
//           keyElement.innerHTML = '<span> </span>';

//           keyElement.addEventListener('click', () => {
//             this.properties.value = document.querySelector(
//               '.use-keyboard-input',
//             ).value;
//             this.properties.value += ' ';
//             document.querySelector(
//               '.use-keyboard-input',
//             ).value = this.properties.value;
//           });

//           break;

//         default: {
//           let [, lenguageLetter] = key;
//           if (!this.properties.isRrussian) {
//             [lenguageLetter] = key;
//           }
//           keyElement.textContent = lenguageLetter.toLowerCase();

//           keyElement.addEventListener('click', () => {
//             if (this.properties.capsLock) {
//               this.properties.value = document.querySelector(
//                 '.use-keyboard-input',
//               ).value;
//               this.properties.value += lenguageLetter.toUpperCase();
//             } else {
//               this.properties.value = document.querySelector(
//                 '.use-keyboard-input',
//               ).value;
//               this.properties.value += lenguageLetter.toLowerCase();
//             }

//             document.querySelector(
//               '.use-keyboard-input',
//             ).value = this.properties.value;
//           });

//           break;
//         }
//       }

//       fragment.appendChild(keyElement);

//       if (insertLineBreak) {
//         // add br after some keys
//         fragment.appendChild(document.createElement('br'));
//       }
//     });

//     return fragment;
//   }

//   toggleCapsLock() {
//     this.properties.capsLock = !this.properties.capsLock;

//     this.elements.keys.forEach(key => {
//       const myKey = key;
//       if (myKey.childElementCount === 0) {
//         if (this.properties.capsLock) {
//           myKey.textContent = myKey.textContent.toUpperCase();
//         } else {
//           myKey.textContent = myKey.textContent.toLowerCase();
//         }
//       }
//     });
//   }

//   // work with real keyboard
//   initReal() {
//     document.addEventListener('keydown', event => {
//       // Use date attribute
//       const key = document.querySelector(`button[data-key='${event.code}']`);
//       event.preventDefault();
//       switch (event.code) {
//         case 'Backspace':
//           this.properties.value = document.querySelector(
//             '.use-keyboard-input',
//           ).value;
//           this.properties.value = this.properties.value.slice(
//             0,
//             this.properties.value.length - 1,
//           );
//           document.querySelector(
//             '.use-keyboard-input',
//           ).value = this.properties.value;
//           break;

//         case 'Tab':
//           document.querySelector('.use-keyboard-input').value += '\t';
//           break;

//         case 'CapsLock':
//           this.toggleCapsLock();
//           key.classList.add('keyboard__key_activeted');
//           return;

//         case 'Enter':
//           document.querySelector('.use-keyboard-input').value += '\n';
//           break;

//         case 'ShiftLeft':
//           this.toggleCapsLock();
//           key.classList.add('keyboard__key_activeted');
//           break;

//         case 'ControlLeft':
//         case 'ControlRight':
//         case 'AltLeft':
//         case 'AltRight':
//           break;

//         case 'Space':
//           document.querySelector('.use-keyboard-input').value += ' ';
//           break;

//         default:
//           this.keyLayout.forEach(item => {
//             if (item[2] === event.code) {
//               // english
//               if (!this.properties.isRrussian) {
//                 if (!this.properties.capsLock) {
//                   document.querySelector(
//                     '.use-keyboard-input',
//                   ).value += item[0].toLowerCase();
//                 }
//                 if (this.properties.capsLock) {
//                   document.querySelector(
//                     '.use-keyboard-input',
//                   ).value += item[0].toUpperCase();
//                 }
//                 // russian
//               } else {
//                 if (!this.properties.capsLock) {
//                   document.querySelector(
//                     '.use-keyboard-input',
//                   ).value += item[1].toLowerCase();
//                 }
//                 if (this.properties.capsLock) {
//                   document.querySelector(
//                     '.use-keyboard-input',
//                   ).value += item[1].toUpperCase();
//                 }
//               }
//             }
//           });
//       }

//       key.classList.add('keyboard__key_activeted');
//       console.clear(); //!====================================
//     });

//     document.addEventListener('keyup', event => {
//       const key = document.querySelector(`button[data-key='${event.code}']`);
//       if (event.code === 'ShiftLeft') {
//         this.toggleCapsLock();
//       }
//       key.classList.remove('keyboard__key_activeted');
//     });

//     function runOnKeys(func, ...codes) {
//       const pressed = new Set();

//       document.addEventListener('keydown', event => {
//         pressed.add(event.code);

//         // Are all keys from the set pressed?
//         for (let i = 0; i < codes.length; i += 1) {
//           if (!pressed.has(codes[i])) {
//             return;
//           }
//         }

//         pressed.clear();
//         func();
//       });

//       document.addEventListener('keyup', event => {
//         pressed.delete(event.code);
//       });
//     }

//     runOnKeys(
//       () => {
//         setTimeout(() => {
//           this.properties.isRrussian = !this.properties.isRrussian;
//           // delete old
//           document.querySelector('.keyboard').remove();
//           this.initVirtual();
//         }, 100);
//       },
//       'ShiftLeft',
//       'AltLeft',
//     );
//   }
// }

// const keyboard = new Keyboard();

// window.addEventListener('DOMContentLoaded', () => {
//   if (localStorage.getItem('lang') === 'false') {
//     keyboard.properties.isRrussian = false;
//   }
//   if (localStorage.getItem('lang') === 'true') {
//     keyboard.properties.isRrussian = true;
//   }
//   keyboard.initTextarea();
//   keyboard.initVirtual();
//   keyboard.initReal();
// });
