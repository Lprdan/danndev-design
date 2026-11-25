const ART = "▓█████▄     ▄▄▄          ███▄    █     ███▄    █    ▓█████▄    ▓█████     ██▒   █▓\n▒██▀ ██▌   ▒████▄        ██ ▀█   █     ██ ▀█   █    ▒██▀ ██▌   ▓█   ▀    ▓██░   █▒\n░██   █▌   ▒██  ▀█▄     ▓██  ▀█ ██▒   ▓██  ▀█ ██▒   ░██   █▌   ▒███       ▓██  █▒░\n░▓█▄   ▌   ░██▄▄▄▄██    ▓██▒  ▐▌██▒   ▓██▒  ▐▌██▒   ░▓█▄   ▌   ▒▓█  ▄      ▒██ █░░\n░▒████▓     ▓█   ▓██▒   ▒██░   ▓██░   ▒██░   ▓██░   ░▒████▓    ░▒████▒      ▒▀█░\n ▒▒▓  ▒     ▒▒   ▓▒█░   ░ ▒░   ▒ ▒    ░ ▒░   ▒ ▒     ▒▒▓  ▒    ░░ ▒░ ░      ░ ▐░\n ░ ▒  ▒      ▒   ▒▒ ░   ░ ░░   ░ ▒░   ░ ░░   ░ ▒░    ░ ▒  ▒     ░ ░  ░      ░ ░░\n ░ ░  ░      ░   ▒         ░   ░ ░       ░   ░ ░     ░ ░  ░       ░           ░░\n   ░             ░  ░            ░             ░       ░          ░  ░         ░\n ░                                                   ░                        ░";

let shown = false;

export function consoleSignature() {
  if (shown) return;
  shown = true;
  const mono = 'font-family: ui-monospace, Menlo, Consolas, monospace;';
  console.log('%c' + ART, mono + 'color: #ff2d2d; font-size: 10px; line-height: 1.15;');
  console.log('%cDando uma olhada no código? 😏', 'font-size: 15px; font-weight: 700; color: #eef3f2;');
  console.log('%cGostou do que viu e quer um igual? Entre em contato e vamos conversar sobre isso.', 'font-size: 13px; color: #b8c4c6;');
  console.log('%c' + '─'.repeat(48), 'color: #5b6b70;');
  console.log('%c© 2026 danndev - danndev.com.br', 'font-size: 12px; color: #2ef2e6;');
}
