type TrackerObjectType = {
  id: string;
  name: string;
  isActive: boolean;
  startedAt: number;
  stoppedOn: string | null;
  resumedAt?: number;
  stoppedOnParsed?: string;
};

type TrackerListType = TrackerObjectType[];

type GetTemplateFuncForTrayParamsType = {
  window: Electron.BrowserWindow;
};
type GetTemplateFuncForMenuParamsType = GetTemplateFuncForTrayParamsType & {
  onResetData: () => void;
};

type GetTemplateFuncType<T> = (
  params: T
) => Electron.MenuItemConstructorOptions[];

export {
  TrackerListType,
  TrackerObjectType,
  GetTemplateFuncType,
  GetTemplateFuncForTrayParamsType,
  GetTemplateFuncForMenuParamsType,
};
