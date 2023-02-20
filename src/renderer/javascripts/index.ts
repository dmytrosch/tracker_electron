interface Window {
  MessagesAPI: {
    onLoaded: (cb: (event: object, data: any) => void) => void;
  };
}

window.MessagesAPI.onLoaded((_, data) => {
  console.log(data);
});
