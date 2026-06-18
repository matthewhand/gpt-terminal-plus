// Minimal, safe preload. Exposes a tiny read-only bridge so renderer code can
// tell it is running inside the desktop shell (e.g. to hide web-only banners).
// Kept intentionally small: no Node APIs are leaked to the page.
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  isDesktop: true,
  platform: process.platform,
  version: process.versions.electron,
});
