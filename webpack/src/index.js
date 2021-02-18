import "./style.css";

const keyboardEngl = [
  113,
  119,
  101,
  114,
  116,
  121,
  117,
  105,
  111,
  112,
  91,
  93,
  97,
  115,
  100,
  102,
  103,
  104,
  106,
  107,
  108,
  59,
  39,
  122,
  120,
  99,
  118,
  98,
  110,
  109,
  44,
  46,
  47,
];

const keyboardRus = [
  1081,
  1094,
  1091,
  1082,
  1077,
  1085,
  1075,
  1096,
  1097,
  1079,
  1093,
  1098,
  1092,
  1099,
  1074,
  1072,
  1087,
  1088,
  1086,
  1083,
  1076,
  1078,
  1101,
  1103,
  1095,
  1089,
  1084,
  1080,
  1090,
  1100,
  1073,
  1102,
  47,
];

const english = '<div class="lang english" data-action ="eng">&#9773; </div> ';
const russian = '<div class="lang russian" data ="rus">&#10026; </div> ';

document.onkeypress = function (event) {
  keyboardEngl.push(event.code);
  console.log(keyboardEngl);
};

function initEngl(e) {
  let out = "";
  const textArea =
    '<label><textarea class="text-area"name="feedback" rows="15"  placeholder="#"></textarea></label>';

  for (let i = 0; i < keyboardEngl.length; i += 1) {
    if (i === 12 || i === 24) {
      out += '<div class="clearfix"></div>';
    }
    out +=
      '<div class="k-key" data="' +
      keyboardEngl[i] +
      '"> ' +
      String.fromCharCode(keyboardEngl[i]) +
      "</div>";
  }
  document.querySelector("#root").innerHTML = out + english + russian;
  document.querySelector("#header").innerHTML = textArea;
}
initEngl();

function initRus() {
  let out = "";
  const textArea =
    '<label><textarea class="text-area"name="feedback" rows="15"  placeholder="#"></textarea></label>';

  for (let i = 0; i < keyboardRus.length; i += 1) {
    if (i === 12 || i === 24) {
      out += '<div class="clearfix"></div>';
    }
    out +=
      '<div class="k-key" data="' +
      keyboardRus[i] +
      '"> ' +
      String.fromCharCode(keyboardRus[i]) +
      "</div>";
  }
  document.querySelector("#root").innerHTML = out + english + russian;
  document.querySelector("#header").innerHTML = textArea;
}
// initRus();

const englishBtn = document.querySelector("[data-action='eng']");
console.log(englishBtn);
const russianBtn = document.querySelector(".russian [data-action='rus']");
console.log(russianBtn);
// englishBtn.hidden = false;
// englishBtn.classList.toggle("russian");

// if()

document.onkeypress = function (e) {
  console.log(e.keyCode);
  document.querySelectorAll("#root .k-key").forEach(function (element) {
    element.classList.remove("active");
  });
  document
    .querySelector('#root .k-key[data="' + e.keyCode + '"]')
    .classList.add("active");
  const textArea = document.querySelector(".text-area");
  textArea.textContent += String.fromCharCode(e.keyCode);
};

document.querySelectorAll("#root .k-key").forEach(function (element) {
  element.onclick = function (e) {
    document.querySelectorAll("#root .k-key").forEach(function (element) {
      element.classList.remove("active");
    });

    this.classList.add("active");

    const textArea = document.querySelector(".text-area");
    // выводит текст через пробел через пробел
    if (this.classList.contains("active")) {
      textArea.textContent += this.textContent;
      console.log(this.textContent);
    }
  };
});
