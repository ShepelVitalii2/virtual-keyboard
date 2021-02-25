// export default function init() {
//   //Setup main elements
//   main.classList.add('keyboard', 'keyboard--hidden');
//   keysContainer.classList.add('keyboard__keys');
//   keysContainer.appendChild(this._createKeys());

//   // add to DOM
//   main.appendChild(keysContainer);
//   document.body.appendChild(main);

//   //Automatically use keyboard for elements
//   document.querySelectorAll('.use-keyboard-input').forEach(element => {
//     element.addEventListener('focus', () => {
//       open(element.value, currentValue => {
//         element.value = currentValue;
//       });
//     });
//   });
//   document.onkeypress = function (e) {
//     const textArea = document.querySelector('.use-keyboard-input');
//     textArea.blur();

//     if (e.key !== 'Enter') {
//       Keyboard.properties.value += e.key;
//     }

//     Keyboard._triggerEvent('oninput');
//   };
// }

// const open = function (initialValue, oninput, onclose) {
//   this.properties.value = initialValue || '';
//   this.eventHandlers.oninput = oninput;
//   this.eventHandlers.onclose = onclose;
//   main.classList.remove('keyboard--hidden');
// };
