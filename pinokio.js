module.exports = {
  version: "1.0",
  title: "GPT-Terminal-Plus",
  description: "Host a GPT action from your desktop (for ChatGPT Custom GPT)",
  menu: async (kernel, info) => {
    const installed = info.exists("node_modules");
    const running = info.running("start.js");

    if (installed) {
      if (running) {
        return [
          {
            default: true,
            icon: "fa-solid fa-rocket",
            text: "Open App",
            href: "start.js"
          }
        ];
      } else {
        return [
          {
            default: true,
            icon: "fa-solid fa-power-off",
            text: "Start",
            href: "start.js"
          },
          {
            icon: "fa-solid fa-plug",
            text: "Update",
            href: "scripts/install.js"
          }
        ];
      }
    } else {
      return [
        {
          default: true,
          icon: "fa-solid fa-download",
          text: "Install",
          href: "install.js"
        }
      ];
    }
  }
};
