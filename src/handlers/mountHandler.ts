import { cssClassNames, events } from "@/constants";
import { eventManager } from "@/eventManager";
import { reindexToastsForPosition } from "@/toastPositionManager";
import { toastQueue, update } from "@/toastQueue";
import { Toast } from "@/types";

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
