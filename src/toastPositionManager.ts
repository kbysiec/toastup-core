import {
  ActionType,
  Toast,
  actionType,
  cssClassNames,
  displayOrder,
  sleep,
  updateToastTranslate,
} from ".";

function repositionToast(toast: Toast, touchedToast: Toast, type: ActionType) {
  const typeMultiplier = type === actionType.add ? 1 : -1;

  const translateYOffset = toast.position.includes("top")
    ? touchedToast.dimensions.height * typeMultiplier
    : touchedToast.dimensions.height * -1 * typeMultiplier;
  const translateY = toast.translate.y + translateYOffset;

  updateToastTranslate(toast, toast.translate.x, translateY);
}

export function repositionToasts(
  toasts: Toast[],
  toast: Toast,
  actType: ActionType
) {
  toasts.forEach(t => repositionToast(t, toast, actType));
}

function setToastIndex(toast: Toast, toasts: Toast[]) {
  if (toast.order !== displayOrder.reversed) return;
  toast.index = toasts.length;
}

function incrementToastsIndexByOne(toasts: Toast[]) {
  toasts.forEach(toast => (toast.index = toast.index + 1));
}

function getToastsForReindex(toasts: Toast[], toast: Toast) {
  return toasts.filter(t => toast.position === t.position && toast.id !== t.id);
}

export function reindexToastsForPosition(toast: Toast, toasts: Toast[]) {
  setToastIndex(toast, toasts);
  const toastsForReindex = getToastsForReindex(toasts, toast);
  toast.order === displayOrder.normal &&
    incrementToastsIndexByOne(toastsForReindex);
  toasts.sort((a, b) => a.index - b.index);
  let newIndex = toast.order === displayOrder.normal ? toast.index + 1 : 0;
  toasts.forEach(t => (t.index = newIndex++));
}

export function toggleToastsRepositionTransition(
  toasts: Toast[],
  duringReposition: boolean,
  quickReposition = false
) {
  toasts.forEach(toast => {
    toast.element?.classList.toggle(
      quickReposition
        ? cssClassNames.toastQuickRepositioning
        : cssClassNames.toastRepositioning,
      duringReposition
    );
  });
}

function shouldBeRepositionedOnAdd(addedToast: Toast, toast: Toast) {
  return (
    toast.isVisible &&
    toast.position === addedToast.position &&
    toast.id !== addedToast.id
  );
}

function shouldBeRepositionedOnRemove(removedToast: Toast, toast: Toast) {
  return (
    toast.isVisible &&
    toast.position === removedToast.position &&
    toast.index >= removedToast.index
  );
}

export function getToastsForReposition(
  toasts: Toast[],
  toast: Toast,
  actType: ActionType
) {
  return toasts.filter(t =>
    actType === actionType.add
      ? shouldBeRepositionedOnAdd(toast, t)
      : shouldBeRepositionedOnRemove(toast, t)
  );
}

function getToastsForAssurePosition(toasts: Toast[], toast: Toast) {
  return toasts.filter(t => t.isVisible && toast.position === t.position);
}

function assureToastPosition(toast: Toast, index: number, toasts: Toast[]) {
  const prev = toasts[index - 1];
  let translateY = 0;
  if (prev) {
    translateY = toast.position.includes("top")
      ? prev.translate.y + prev.dimensions.height
      : prev.translate.y + prev.dimensions.height * -1;
  }
  updateToastTranslate(toast, toast.translate.x, translateY);
}

export async function assureToastsPosition(toast: Toast, toasts: Toast[]) {
  const delayAfterRepositionInMs = 150;
  const toastsForPosition = getToastsForAssurePosition(toasts, toast);
  toastsForPosition.sort((a, b) => a.index - b.index);

  toggleToastsRepositionTransition(toastsForPosition, true, true);
  toastsForPosition.forEach((t, i) =>
    assureToastPosition(t, i, toastsForPosition)
  );
  await sleep(delayAfterRepositionInMs);
  toggleToastsRepositionTransition(toastsForPosition, false, true);
}
