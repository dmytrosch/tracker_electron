import { Menu, app, dialog } from "electron";
import {
  GetTemplateFuncForMenuParamsType,
  GetTemplateFuncType,
} from "../../constants/types";

const isProduction = process.env.NODE_ENV === "production";

const getTemplate: GetTemplateFuncType<GetTemplateFuncForMenuParamsType> = ({
  window,
  onResetData,
}) => {
  return [
    {
      label: "Application",
      submenu: [
        {
          label: "Reset data",
          click: () => {
            const clickedButtonIndex = dialog.showMessageBoxSync(window, {
              message: "Are sure you want to reset your data?",
              type: "question",
              buttons: ["OK", "Cancel"],
              cancelId: 1,
            });
            if (clickedButtonIndex === 0) {
              onResetData();
            }
          },
        },
        { label: "Hide to tray", role: "close" },
        {
          type: "separator",
        },
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        {
          role: "minimize",
        },
        {
          type: "separator",
        },
        {
          role: "zoomIn",
        },
        { role: "zoomOut" },
        {
          role: "resetZoom",
        },
        ...(!isProduction
          ? [
              {
                role: "toggleDevTools",
              },
            ]
          : []),
      ],
    },
  ] as Electron.MenuItemConstructorOptions[];
};

const createAppMenu = (params: GetTemplateFuncForMenuParamsType) => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplate(params)));
};

export default createAppMenu;
