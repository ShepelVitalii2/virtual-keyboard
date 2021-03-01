//   init() {
//     //Create main element
//     this.elements.text = document.getElementById('use-keyboard-input');
//     this.elements.main = document.createElement('div');
//     this.elements.keysContainer = document.createElement('div');

//     //Setup main elements
//     this.elements.main.classList.add('keyboard', 'keyboard--hidden');
//     this.elements.keysContainer.classList.add('keyboard__keys');

//     this.elements.keysContainer.appendChild(this._createKeys());

//     this.elements.keys = this.elements.keysContainer.querySelectorAll(
//       '.keyboard__key',
//     );

//     // add to DOM
//     this.elements.main.appendChild(this.elements.keysContainer);
//     document.body.appendChild(this.elements.main);

//     //Automatically use keyboard for elements
//     document.querySelectorAll('.use-keyboard-input').forEach(element => {
//       element.addEventListener('focus', () => {
//         this.open(element.value, currentValue => {
//           element.value = currentValue;
//         });
//       });
//     });
//     document.onkeypress = function (e) {
//       const textArea = document.querySelector('.use-keyboard-input');
//       textArea.blur();

//       if (e.key !== 'Enter') {
//         if (text.selectionEnd !== Keyboard.properties.value.length) {
//           return;
//         }
//         Keyboard.properties.value += e.key;
//         // text.value = Keyboard.properties.value;

//         // console.log(text.value);
//       }

//       Keyboard._triggerEvent('oninput');
//     };
//   },

//   _createKeys() {
//     const fragment = document.createDocumentFragment();

//     const createIconHTML = icon_name => {
//       return `<i class="material-icons">${icon_name}</i>`;
//     };
//     this._changheLanguage().forEach((key, index) => {
//       const keyElement = document.createElement('button');
//       keyElement.dataset.keyCode = key;
//       const insertLineBreak =
//         ['backspace', 'p', 'enter', 'language', 'ъ'].indexOf(key) !== -1;

//       //add attributes/classes
//       keyElement.setAttribute('type', 'button');
//       keyElement.setAttribute('id', `${index}`);
//       keyElement.classList.add('keyboard__key');

//       document.addEventListener('keydown', e => {
//         if (
//           e.code === 'Backspace' &&
//           keyElement.dataset.keyCode === 'backspace'
//         ) {
//           keyElement.classList.add('activeBtn');

//           useBackspaceBtn();
//           // Keyboard.properties.value += 'HELLO';
//           // console.log(Keyboard.properties.value);
//           e.preventDefault();
//         }
//         if (e.code === 'CapsLock' && keyElement.dataset.keyCode === 'caps') {
//           keyElement.classList.add('activeBtn');
//           useCapsLockBtn();
//         }
//         if (e.code === 'Enter' && keyElement.dataset.keyCode === 'enter') {
//           keyElement.classList.add('activeBtn');
//           useEnterBtn();
//         }
//         if (e.code === 'Space' && keyElement.dataset.keyCode === 'space') {
//           keyElement.classList.add('activeBtn');
//           useSpaceBtn();
//         }

//         if (keyElement.dataset.keyCode === e.key.toLowerCase()) {
//           keyElement.classList.add('activeBtn');
//           // useRegularBtn();
//           // e.preventDefault();
//           // console.log(text.selectionEnd);
//           if (text.selectionEnd !== this.properties.value.length) {
//             const cursorAt = text.selectionStart;
//             insertText(key);
//             text.selectionStart = cursorAt + key.length;
//             text.selectionEnd = text.selectionStart;
//             Keyboard.properties.value = text.value;
//           }
//         }
//       });

//       document.addEventListener('keyup', e => {
//         if (keyElement.dataset.keyCode === key) {
//           keyElement.classList.remove('activeBtn');
//         }
//       });

//       function insertText(letter) {
//         const cursorAt = text.selectionStart;
//         if (letter === 'backspace') {
//           // const letter = '';
//           letter.length = 1;
//           console.log(letter.length);
//           text.value =
//             text.value.slice(0, cursorAt) +
//             letter +
//             text.value.slice(text.selectionEnd);
//           console.log(letter);
//         } else {
//           text.value =
//             text.value.slice(0, cursorAt) +
//             letter +
//             text.value.slice(text.selectionEnd);
//         }
//       }

//       const useBackspaceBtn = () => {
//         const cursorAt = Math.max(0, text.selectionStart - 1);

//         text.value =
//           text.value.slice(0, cursorAt) + text.value.slice(text.selectionEnd);

//         text.selectionStart = cursorAt;
//         text.selectionEnd = text.selectionStart;
//         this.properties.value = text.value;
//       };

//       const useCapsLockBtn = () => {
//         this._toggleCapsLock();

//         keyElement.classList.toggle(
//           'keyboard__key--active',
//           this.properties.capsLock,
//         );
//       };

//       const useEnterBtn = () => {
//         this.properties.value += '\n';
//         this._triggerEvent('oninput');
//       };

//       const useSpaceBtn = () => {
//         this.properties.value += ' ';
//         this._triggerEvent('oninput');
//       };

//       const useDoneBtn = () => {
//         this.close();
//         this._triggerEvent('onclose');
//       };

//       const useRegularBtn = () => {
//         this.properties.value += this.properties.capsLock
//           ? key.toUpperCase()
//           : key.toLowerCase();
//         this._triggerEvent('oninput');
//       };

//       switch (key) {
//         case 'backspace':
//           keyElement.classList.add('keyboard__key--wide');
//           keyElement.innerHTML = createIconHTML('backspace');

//           // keyElement.addEventListener('click', useBackspaceBtn);

//           keyElement.addEventListener('click', () => {
//             this.properties.value = this.properties.value.substring(
//               0,
//               this.properties.value.length - 1,
//             );
//             this._triggerEvent('oninput');
//           });

//           break;

//         case 'language':
//           keyElement.classList.add('keyboard__key--wide');

//           keyElement.innerHTML = createIconHTML('language');

//           keyElement.addEventListener('click', () => {
//             this._toggleLanguage();
//           });

//           break;

//         case 'caps':
//           keyElement.classList.add(
//             'keyboard__key--wide',
//             'keyboard__key--activatable',
//           );
//           keyElement.innerHTML = createIconHTML('keyboard_capslock');

//           keyElement.addEventListener('click', useCapsLockBtn);

//           break;

//         case 'enter':
//           keyElement.classList.add('keyboard__key--wide');
//           keyElement.innerHTML = createIconHTML('keyboard_return');

//           keyElement.addEventListener('click', useEnterBtn);

//           break;

//         case 'space':
//           keyElement.classList.add('keyboard__key--extra-wide');
//           keyElement.innerHTML = createIconHTML('space_bar');

//           keyElement.addEventListener('click', useSpaceBtn);

//           break;

//         case 'done':
//           keyElement.classList.add(
//             'keyboard__key--wide',
//             'keyboard__key--dark',
//           );
//           keyElement.innerHTML = createIconHTML('check_circle');

//           keyElement.addEventListener('click', useDoneBtn);

//           break;

//         default:
//           keyElement.textContent = key.toLowerCase();

//           keyElement.addEventListener('click', useRegularBtn);

//           break;
//       }
//       fragment.appendChild(keyElement);

//       if (insertLineBreak) {
//         fragment.appendChild(document.createElement('br'));
//       }
//     });

//     return fragment;
//   },

//   _triggerEvent(handlerName) {
//     if (typeof this.eventHandlers[handlerName] === 'function') {
//       this.eventHandlers[handlerName](this.properties.value);
//     }
//   },

//   _toggleLanguage() {
//     this.properties.language = !this.properties.language;
//     this.elements.keysContainer.innerHTML = ' ';
//     this.elements.keysContainer.appendChild(this._createKeys());
//   },

//   _changheLanguage() {
//     if (!this.properties.language) {
//       return keyLayout[0];
//     } else {
//       return keyLayout[1];
//     }
//   },

//   _toggleCapsLock() {
//     this.properties.capsLock = !this.properties.capsLock;

//     for (const key of this.elements.keys) {
//       if (key.childElementCount === 0) {
//         key.textContent = this.properties.capsLock
//           ? key.textContent.toUpperCase()
//           : key.textContent.toLowerCase();
//       }
//       console.log(key.childElementCount);
//     }
//   },

//   open(initialValue, oninput, onclose) {
//     this.properties.value = initialValue || '';
//     this.eventHandlers.oninput = oninput;
//     this.eventHandlers.onclose = onclose;
//     this.elements.main.classList.remove('keyboard--hidden');
//   },

//   close() {
//     this.properties.value = '';
//     this.eventHandlers.oninput = oninput;
//     this.eventHandlers.onclose = onclose;
//     this.elements.main.classList.add('keyboard--hidden');
//   },
// };

// window.addEventListener('DOMContentLoaded', function () {
//   Keyboard.init();
// });
