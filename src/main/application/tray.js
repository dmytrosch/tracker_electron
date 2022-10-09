import { nativeImage, Tray, Menu } from "electron";
import path from "path";
import trayIcon from "../../../resources/tray-icon.png";

const getTemplate = ({ window }) => [
  { label: "tracker", enabled: false },
  { type: "separator" },
  {
    label: "Hide/show application",
    click: () => (window.isVisible() ? window.hide() : window.show()),
  },
  {
    role: "quit",
  },
];

const createAppTray = (params) => {
  const img = nativeImage.createFromPath(path.resolve(__dirname, trayIcon));
  const tray = new Tray(img);
  tray.setContextMenu(Menu.buildFromTemplate(getTemplate(params)));
  return tray;
};

export default createAppTray;
