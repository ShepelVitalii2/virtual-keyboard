import './style.css';

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
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      'backspace',
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      'caps',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      'enter',
      'done',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      ',',
      '.',
      '?',
      'language',
      'space',
    ];

    const keyLayoutRus = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      'backspace',
      'й',
      'ц',
      'у',
      'к',
      'е',
      'н',
      'г',
      'ш',
      'щ',
      'з',
      'х',
      'ъ',
      'caps',
      'ф',
      'ы',
      'в',
      'а',
      'п',
      'р',
      'о',
      'л',
      'д',
      'ж',
      'э',
      'enter',
      'done',
      'я',
      'ч',
      'с',
      'м',
      'и',
      'т',
      'ь',
      'б',
      'ю',
      ',',
      '.',
      '?',
      'language',
      'space',
    ];

    const createIconHTML = icon_name => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement('button');
      const insertLineBreak =
        ['backspace', 'p', 'enter', 'language', 'ъ'].indexOf(key) !== -1;

      //add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

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
            keyElement.classList.toggle('active');

            if (keyElement.hasAttribute('class', 'active')) {
              const allKeys = document.querySelectorAll('.button');
              console.log(allKeys);
              keyLayoutRus.forEach(key => {
                console.log(key);
                allKeys.textContent = key.toLowerCase();
              });
            }

            // this._triggerEvent('oninput');
          });

          break;

        case 'caps':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable',
          );
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this.properties.value = this._toggleCapsLock();
            keyElement.classList.toggle(
              'keyboard__key--active',
              this.properties.capsLock,
            );
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });

          break;

        case 'done':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--dark',
          );
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase();
            this._triggerEvent('oninput');
          });

          break;
      }

      fragment.appendChild(keyElement);
      // console.log(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  // _changeLanguage() {
  //   let out = '';
  //   for (let i = 0; i < keyLayoutRus.length; i += 1) {
  //     if (i === 12 || i === 24) {
  //       out += '<div class="clearfix"></div>';
  //     }
  //     out +=
  //       '<div class="k-key" data="' +
  //       keyLayoutRus[i] +
  //       '"> ' +
  //       String.fromCharCode(keyLayoutRus[i]) +
  //       '</div>';
  //   }
  //   fragment.appendChild(out);
  // },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
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

// const keyboard = [
//   113,
//   119,
//   101,
//   114,
//   116,
//   121,
//   117,
//   105,
//   111,
//   112,
//   91,
//   93,
//   97,
//   115,
//   100,
//   102,
//   103,
//   104,
//   106,
//   107,
//   108,
//   59,
//   39,
//   122,
//   120,
//   99,
//   118,
//   98,
//   110,
//   109,
//   44,
//   46,
//   47,
// ];
// document.onkeypress = function (event) {
//   keyboard.push(event.charCode);
//   console.log(keyboard);
// };

// function init() {
//   let out = "";
//   for (let i = 0; i < keyboard.length; i += 1) {
//     if (i === 12 || i === 24) {
//       out += '<div class="clearfix"></div>';
//     }
//     out +=
//       '<div class="k-key" data="' +
//       keyboard[i] +
//       '"> ' +
//       String.fromCharCode(keyboard[i]) +
//       "</div>";
//   }
//   document.querySelector("#root").innerHTML = out;
// }
// init();

// document.onkeypress = function (e) {
//   document.querySelectorAll("#root .k-key").forEach(function (element) {
//     element.classList.remove("active");
//   });
//   document
//     .querySelector('#root .k-key[data="' + e.keyCode + '"]')
//     .classList.add("active");
// };

// document.querySelectorAll("#root .k-key").forEach(function (element) {
//   element.onclick = function (event) {
//     document.querySelectorAll("#root .k-key").forEach(function (element) {
//       element.classList.remove("active");
//     });
//     let code = this.getAttribute("data");
//     this.classList.add("active");
//     // console.log(code);
//   };
// });
