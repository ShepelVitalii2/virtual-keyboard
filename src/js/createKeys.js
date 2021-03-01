import keyLayout from './js/keyLayoutData';
import keyboard from '../index';

export default function createKeys() {
  const fragment = document.createDocumentFragment();
  const createIconHTML = icon_name => {
    return `<i class="material-icons">${icon_name}</i>`;
  };

  keyLayout.forEach(key => {
    const keyElement = document.createElement('button');
    const insertLineBreak =
      ['Backspace', '\\', 'Enter', '/'].indexOf(key[0]) !== -1;

    // Add attributes/classes
    keyElement.setAttribute('type', 'button');
    keyElement.classList.add('keyboard__key');
    // Every button have date attribute(with code)
    keyElement.setAttribute('data-key', `${key[2]}`);

    function insertText(chars) {
      const cursorAt = keyboard.elements.textarea.selectionStart;
      console.log(chars);

      keyboard.elements.textarea.value =
        keyboard.elements.textarea.value.slice(0, cursorAt) +
        chars +
        keyboard.elements.textarea.value.slice(
          keyboard.elements.textarea.selectionEnd,
        );

      keyboard.elements.textarea.selectionStart = cursorAt + chars.length;
      keyboard.elements.textarea.selectionEnd =
        keyboard.elements.textarea.selectionStart;
    }

    function pressBackspace() {
      if (
        keyboard.elements.textarea.selectionStart !==
        keyboard.elements.textarea.length
      ) {
        insertText(key);
      } else {
        const cursorAt = Math.max(
          0,
          keyboard.elements.textarea.selectionStart - 1,
        );

        keyboard.elements.textarea.value =
          keyboard.elements.textarea.value.slice(0, cursorAt) +
          keyboard.elements.textarea.value.slice(
            keyboard.elements.textarea.selectionEnd,
          );

        keyboard.elements.textarea.selectionStart = cursorAt;
        keyboard.elements.textarea.selectionEnd =
          keyboard.elements.textarea.selectionStart;
        console.log(keyboard.elements.textarea.value);
      }
    }

    // function insertText(letter) {
    //   const cursorAt = text.selectionStart;
    //   if (letter === 'backspace') {
    //     // const letter = '';
    //     letter.length = 1;
    //     console.log(letter.length);
    //     text.value =
    //       text.value.slice(0, cursorAt) +
    //       letter +
    //       text.value.slice(text.selectionEnd);
    //     console.log(letter);
    //   } else {
    //     text.value =
    //       text.value.slice(0, cursorAt) +
    //       letter +
    //       text.value.slice(text.selectionEnd);
    //   }
    // }

    function backspaceAtCursor() {
      // keyboard.elements.textarea = document.getElementById(id);
      // console.log(keyboard.properties.value);
      console.log(keyboard.elements.textarea.selectionEnd);
      console.log(keyboard.elements.textarea.selectionStart);
      const field = keyboard.elements.textarea.value;
      // console.log(field.selectionStart);

      if (field.selectionStart) {
        const startPos = this.elements.textarea.selectionStart;
        const endPos = this.elements.textarea.selectionEnd;

        if (field.selectionStart == field.selectionEnd) {
          field.value =
            field.value.substring(0, startPos - 1) +
            field.value.substring(endPos, field.value.length);

          field.focus();
          field.setSelectionRange(startPos - 1, startPos - 1);
        } else {
          field.value =
            field.value.substring(0, startPos) +
            field.value.substring(endPos, field.value.length);

          field.focus();
          field.setSelectionRange(startPos, startPos);
        }
      }
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
          keyboard.properties.value = document.querySelector(
            '.use-keyboard-input',
          ).value;
          this.properties.value += '\t';
          document.querySelector(
            '.use-keyboard-input',
          ).value = this.properties.value;
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
          this.properties.value = document.querySelector(
            '.use-keyboard-input',
          ).value;
          this.properties.value += '\n';
          document.querySelector(
            '.use-keyboard-input',
          ).value = this.properties.value;
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
        if (!this.properties.isRrussian) {
          [lenguageLetter] = key;
        }
        keyElement.textContent = lenguageLetter.toLowerCase();

        keyElement.addEventListener('click', () => {
          if (this.properties.capsLock) {
            this.properties.value = document.querySelector(
              '.use-keyboard-input',
            ).value;
            this.properties.value += lenguageLetter.toUpperCase();
          } else {
            this.properties.value = document.querySelector(
              '.use-keyboard-input',
            ).value;
            this.properties.value += lenguageLetter.toLowerCase();
          }

          document.querySelector(
            '.use-keyboard-input',
          ).value = this.properties.value;
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
