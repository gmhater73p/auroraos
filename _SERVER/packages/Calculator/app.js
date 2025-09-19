;(async function(){
const package = document.currentScript.package;
const mainWindow = package.createWindow(atob(await package.resource("main.html")), { minimizable: true, titleBar: "Default", title: "Calculator", startingDimensions: [282, 516] });

const calculator = ["0", null, false, null]

const display = document.getElementById(`${package.name}Display`);
const performCalculation = {
  '/': (f, s) => f / s,
  '*': (f, s) => f * s,
  '+': (f, s) => f + s,
  '-': (f, s) => f - s,
  '=': (f, s) => s
};

mainWindow.body.onclick = function(e) {
  if (!e.target.matches("button")) return;
  if (e.target.id.includes("_N")) {
    if (calculator[2] === true) {
      calculator[0] = e.target.value;
      calculator[2] = false;
    } else {
      calculator[0] = calculator[0] === "0" ? e.target.value : calculator[0] + e.target.value;
    }
    return display.value = calculator[0];
  }
  if (e.target.id.includes("_O")) {
    const inputValue = parseFloat(calculator[0]);
    if (calculator[1] == null) {
      calculator[1] = inputValue;
    } else if (calculator[3]) {
      const result = performCalculation[calculator[3]](calculator[1], inputValue);
      calculator[0] = String(result);
      calculator[1] = result;
    }
    calculator[2] = true;
    calculator[3] = e.target.value;
    return display.value = calculator[0];
  }
  if (e.target.id.includes("Decimal")) {
    if (!calculator[0].includes(e.target.innerText)) {
      calculator[0] += e.target.innerText;
      return display.value = calculator[0];
    }
  }
  if (e.target.id.includes("Clear")) {
    calculator[0] = "0";
    calculator[1] = null;
    calculator[2] = false;
    calculator[3] = null;
    return display.value = calculator[0];
  }
}
})()