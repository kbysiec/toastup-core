import {
  Action,
  HidePayload,
  Toast,
  actionType,
  assureToastsPosition,
  executeToastCallback,
  getToastsForReposition,
  register,
  repositionToasts,
  setToastVisibility,
  sleep,
  sleepForAnimationTime,
  toastQueue,
  toggleAnimation,
  toggleToastsRepositionTransition,
} from "..";

async function hideToast(toast: Toast, withAnimation: boolean) {
  executeToastCallback(toast, t => t.onHiding);

  withAnimation && toggleAnimation(toast, t => t.outAnimation, true);
  await sleepForAnimationTime(toast.outAnimation);
  setToastVisibility(toast, false);
  clearInterval(toast.autoHideDetails?.intervalId);

  executeToastCallback(toast, t => t.onHide);
}

async function hideAndReposition(toast: Toast, withAnimation: boolean) {
  const delayAfterRepositionInMs = 400;
  await hideToast(toast, withAnimation);

  const toastMap = toastQueue.get();
  const toasts = Array.from(toastMap.values());
  const toastsFromTheSameGroup = getToastsForReposition(
    toasts,
    toast,
    actionType.remove
  );

  toggleToastsRepositionTransition(toastsFromTheSameGroup, true);
  repositionToasts(toastsFromTheSameGroup, toast, actionType.remove);
  await sleep(delayAfterRepositionInMs);
  toggleToastsRepositionTransition(toastsFromTheSameGroup, false);
}

export async function hide(
  toast: Toast,
  withAnimation: boolean,
  callback: () => void
) {
  const toastMap = toastQueue.get();
  await hideAndReposition(toast, withAnimation);
  const toasts = Array.from(toastMap.values());
  await assureToastsPosition(toast, toasts);
  toastMap.delete(toast.id);
  callback();
}

export async function handleHideToast(event: CustomEvent<HidePayload>) {
  const toastMap = toastQueue.get();
  const { toastId, withAnimation, callback } = event.detail;
  const toast = toastMap.get(toastId);

  if (!toast || toast.duringRemoval) return;

  toast.duringRemoval = true;
  const action: Action = {
    actionType: actionType.remove,
    fn: hide.bind(null, toast, withAnimation, callback),
  };
  await register(action);
}
