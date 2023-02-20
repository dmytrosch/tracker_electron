import { nativeImage, Tray, Menu } from "electron";
import * as path from "path";
import {
  GetTemplateFuncForTrayParamsType,
  GetTemplateFuncType,
} from "../../constants/types";
import trayIcon from "../../../resources/tray-icon.png";

const getTemplate: GetTemplateFuncType<GetTemplateFuncForTrayParamsType> = ({
  window,
}) => [
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

const createAppTray = (params: GetTemplateFuncForTrayParamsType): Tray => {
  const img = nativeImage.createFromPath(path.resolve(__dirname, trayIcon));
  const tray = new Tray(img);
  tray.setToolTip("tracker");
  tray.setContextMenu(Menu.buildFromTemplate(getTemplate(params)));
  return tray;
};

export default createAppTray;
