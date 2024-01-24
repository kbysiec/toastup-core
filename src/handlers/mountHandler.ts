import {
  Toast,
  cssClassNames,
  eventManager,
  events,
  reindexToastsForPosition,
  toastQueue,
  update,
} from "..";

function addNecessaryClassName(toast: Toast) {
  toast.element && toast.element.classList.add(cssClassNames.toast);
}

export function handleMountedToast(event: CustomEvent<Toast>) {
  const toastMap = toastQueue.get();
  const mountedToast = event.detail;
  const toast = toastMap.get(mountedToast.id);

  if (toast?.element) return;

  addNecessaryClassName(mountedToast);

  update(mountedToast);
  const toasts = Array.from(toastMap.values());
  reindexToastsForPosition(mountedToast, toasts);
  eventManager.emit(events.show, mountedToast);
}
