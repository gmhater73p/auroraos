;(async function() {
const package = document.currentScript.package;
const packageWindow = package.createWindow(atob(await package.resource("main.html")), { titleBar: "Default", title: "Terminal", minimizable: true, resizable: true, startingDimensions: [600, 400] });

const commandHistory = [""];
var commandHistoryPosition = 0;

const commands = [
  {
    name: "help",
    description: "Shows all available commands.",
    activate: function() {
      writeTerminal("<br><span style='font-weight:bold'>auroraOS Help</span>");
      commands.forEach(command => {
        writeTerminal(`<span style="color:yellow">${command.name}</span> ${command.usage ? `<span style='color:lightblue'>${command.usage.replaceAll("<", "").replaceAll(">", "")}</span>` : ""} - ${command.description ? command.description : "No description available."}`);
      });
      return writeTerminal("<br>");
    }
  },
  {
    name: "echo",
    usage: "message",
    description: "Displays message in the terminal.",
    activate: function(args) { return writeTerminal(args.join(" ")); }
  },
  {
    name: "clear",
    description: "Clears terminal.",
    activate: function() { Array.from(packageWindow.body.childNodes).filter(e => e.tagName === "P").forEach(e => e.remove()); return; }
  },
  {
    name: "eval",
    usage: "code",
    description: "Evaluates JavaScript code. <span style='color:red'>Please be careful with this.<span>",
    activate: function(args) {
      try {
        const output = eval(args.join(" "));
        if (output) return writeTerminal("> " + output);
      } catch(error) {
        return writeTerminal(`<span style='color:red'>${error}</span>`);
      }
    }
  },
];

const input = document.querySelector(`#${package.name}ip > input`);

input.onkeydown = async function(e) {
  if (e.keyCode === 13) {
    if (input.value === "") return;
    
    commandHistory.push(input.value);
    commandHistoryPosition = commandHistory.length;
    
    const clone = document.getElementById(`${package.name}ip`).cloneNode(true);
    document.body.appendChild(clone);
    clone.id = "temp";
    const inputText = document.querySelector("#temp > input").value;
    document.querySelector("#temp > input").remove();
    writeTerminal(clone.innerHTML + inputText, false);
    clone.remove();
    
    const args = input.value.split(" ");
    const match = args.shift();
    
    for (const command of commands) {
      if (command.name === match) {
        await command.activate(args);
        document.getElementById(`${package.name}ip`).style.display = "flex";
        packageWindow.body.appendChild(document.getElementById(`${package.name}ip`));
        input.value = null;
        input.focus();
        return;
      }
    }
    writeTerminal("<span style='color:red'>Command not found.</span>");
    document.getElementById(`${package.name}ip`).style.display = "flex";
    packageWindow.body.appendChild(document.getElementById(`${package.name}ip`));
    input.value = null;
    input.focus();
  } else if (e.keyCode === 38) {
    commandHistoryPosition = Math.min(Math.max(commandHistoryPosition - 1, 0), commandHistory.length - 1);
    input.value = commandHistory[commandHistoryPosition];
  } else if (e.keyCode === 40) {
    commandHistoryPosition = Math.min(Math.max(commandHistoryPosition + 1, 0), commandHistory.length - 1);
    input.value = commandHistory[commandHistoryPosition];
  }
};

document.querySelector(`#${package.name}ip > span`).innerText = sessionStorage.getItem("username") + "@auroraos";

const writeTerminal = function(content) {
  const message = document.createElement("p");
  message.style = "margin:0;font-family:monospace";
  message.innerHTML = content;
  packageWindow.body.appendChild(message);
  document.getElementById(`${package.name}ip`).style.display = "none";
};

const requestInput = function(prompt, callback) {
  return new Promise(function(resolve) {
    const ip = document.createElement("span");
    ip.style = "display:flex;white-space:pre-wrap";
    ip.innerHTML = prompt;
    const cinput = document.createElement("input");
    cinput.spellcheck = false;
    cinput.style = "font-family:monospace;flex-grow:50;background:transparent;border:none;box-shadow:none;color:white;font-weight:initial;padding:0;border-radius:0;";

    ip.appendChild(cinput);
    packageWindow.body.appendChild(ip);
    cinput.focus();
    cinput.onkeydown = function(e) {
      if (e.keyCode === 13) {
        const inputText = cinput.value;
        cinput.remove();
        writeTerminal(ip.innerHTML + inputText);
        resolve(inputText);
        ip.remove();
      }
    }
  });
}

const motds = [
  "The chicken came before the egg.",
];

writeTerminal("<span style='color:lightblue'>Welcome to the auroraOS terminal.</span>");
writeTerminal(motds[Math.floor(Math.random() * Math.floor(motds.length))]);
writeTerminal("Type <span style='color:yellow'>help</span> for a list of available commands.<br><br>");
document.getElementById(`${package.name}ip`).style.display = "flex";
packageWindow.body.appendChild(document.getElementById(`${package.name}ip`));
input.value = null;
input.focus();
})()