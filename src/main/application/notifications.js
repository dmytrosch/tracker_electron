import { Notification } from "electron";

const showNotification = (text, options = {}) => {
  const notification = new Notification({ title: text, ...options });
  notification.show();
  setTimeout(() => notification.close(), 3500);
};

export default showNotification;
