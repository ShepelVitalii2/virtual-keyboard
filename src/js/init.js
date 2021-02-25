// export default function init() {
//   //Create main element
//   this.elements.main = document.createElement('div');
//   this.elements.keysContainer = document.createElement('div');

//   //Setup main elements
//   this.elements.main.classList.add('keyboard', 'keyboard--hidden');
//   this.elements.keysContainer.classList.add('keyboard__keys');
//   this.elements.keysContainer.appendChild(this._createKeys());

//   this.elements.keys = this.elements.keysContainer.querySelectorAll(
//     '.keyboard__key',
//   );

//   // add to DOM
//   this.elements.main.appendChild(this.elements.keysContainer);
//   document.body.appendChild(this.elements.main);

//   //Automatically use keyboard for elements
//   document.querySelectorAll('.use-keyboard-input').forEach(element => {
//     element.addEventListener('focus', () => {
//       this.open(element.value, currentValue => {
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
