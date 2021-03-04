import keyboard from './Keyboard';

export function toggleCapsLock() {
  keyboard.properties.capsLock = !keyboard.properties.capsLock;

  keyboard.elements.keys.forEach(key => {
    const myKey = key;
    if (myKey.childElementCount === 0) {
      if (keyboard.properties.capsLock) {
        myKey.textContent = myKey.textContent.toUpperCase();
      } else {
        myKey.textContent = myKey.textContent.toLowerCase();
      }
    }
  });
}

export function onBackspacePress() {
  text.focus();

  const cursorAt = Math.max(0, text.selectionStart - 1);

  text.value =
    text.value.slice(0, cursorAt) + text.value.slice(text.selectionEnd);

  text.selectionStart = cursorAt;
  text.selectionEnd = text.selectionStart;
  keyboard.properties.value = text.value;
}

export function onSpacePress() {
  text.focus();

  const cursor = text.selectionStart;
  text.value = text.value.slice(0, cursor) + ' ' + text.value.slice(cursor);
  text.selectionStart = 1 + cursor;
  text.selectionEnd = text.selectionStart;
}

export function onEnterPress() {
  text.focus();
  const cursorAt = text.selectionStart;
  keyboard.properties.value = text.value;
  keyboard.properties.value += '\n';
  text.value = keyboard.properties.value;

  if (cursorAt !== text.value.length - 1) {
    text.value =
      text.value.slice(0, cursorAt - 1) + '\n' + text.value.slice(cursorAt);
    text.selectionStart = cursorAt;
    text.selectionEnd = text.selectionStart;
    keyboard.properties.value = text.value;
  }
}

export function insertText(e) {
  const { isRussian } = keyboard.properties;
  const { capsLock } = keyboard.properties;
  text.focus();

  const key = isRussian === true ? e[1] : e[0];

  const cursorAt = text.selectionStart;

  if (!Array.isArray(e)) {
    text.value =
      text.value.slice(0, cursorAt) + e + text.value.slice(text.selectionEnd);
  }
  if (Array.isArray(e)) {
    if (!capsLock) {
      text.value =
        text.value.slice(0, cursorAt) +
        key +
        text.value.slice(text.selectionEnd);
    }

    if (capsLock) {
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
