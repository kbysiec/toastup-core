import {
  Action,
  MeasureType,
  Toast,
  actionType,
  animationElementSelector,
  assureToastsPosition,
  cssClassNames,
  displayOrder,
  executeToastCallback,
  getOuter,
  getToastsForReposition,
  measureType,
  register,
  repositionToasts,
  setToastVisibility,
  sleep,
  sleepForAnimationTime,
  toastQueue,
  toggleAnimation,
  toggleToastsRepositionTransition,
  updateToastTranslate,
} from "..";

function getToastWithHighestTranslateY(toasts: Toast[], toast: Toast) {
  const toastWithHighestTranslateY = toasts.length
    ? toasts.reduce((prev: Toast, current: Toast) => {
        if (toast.position.includes("top")) {
          return prev.translate.y > current.translate.y ? prev : current;
        } else {
          return prev.translate.y < current.translate.y ? prev : current;
        }
      })
    : null;

  return toastWithHighestTranslateY;
}

export function getStartTranslateYForReversedOrder(
  toast: Toast,
  toasts: Toast[],
  sameAsLastToast = false
) {
  const toastWithBiggestTranslateY = getToastWithHighestTranslateY(
    toasts,
    toast
  );
  if (toastWithBiggestTranslateY) {
    const translateYAsLastToast = toastWithBiggestTranslateY.translate.y;
    const translateYForTopPosition =
      toastWithBiggestTranslateY.dimensions.height +
      toastWithBiggestTranslateY.translate.y;
    const translateYForBottomPosition =
      toastWithBiggestTranslateY.dimensions.height * -1 +
      toastWithBiggestTranslateY.translate.y;

    const translateY = sameAsLastToast
      ? translateYAsLastToast
      : toast.position.includes("top")
        ? translateYForTopPosition
        : translateYForBottomPosition;

    return translateY;
  }
  return toast.translate.y;
}

export async function animateBodyIfApplicable(toast: Toast) {
  if (!toast.animateBody) return;

  toggleAnimation(
    toast,
    t => t.inBodyAnimation,
    true,
    animationElementSelector.body
  );
  await sleepForAnimationTime(toast.inBodyAnimation);
  toast.element
    ?.querySelector(animationElementSelector.body)
    ?.classList.toggle(`${cssClassNames.bodyVisible}`, true);
}

async function showToast(toast: Toast) {
  executeToastCallback(toast, t => t.onShowing);
  toast.isVisible = true;
  toggleAnimation(toast, t => t.inAnimation, true);
  setToastVisibility(toast, true);
  executeToastCallback(toast, t => t.onShow);
  await sleepForAnimationTime(toast.inAnimation);
  await animateBodyIfApplicable(toast);
}

async function showAndRepositionNormalOrder(toast: Toast, toasts: Toast[]) {
  const delayAfterRepositionInMs = 300;

  toggleToastsRepositionTransition(toasts, true);
  repositionToasts(toasts, toast, actionType.add);
  await sleep(delayAfterRepositionInMs);
  toast.delayBeforeShow && (await sleep(toast.delayBeforeShow));

  await showToast(toast);
  toggleAnimation(toast, t => t.inAnimation, false);
  toast.animateBody &&
    toggleAnimation(
      toast,
      t => t.inBodyAnimation,
      false,
      animationElementSelector.body
    );
  toggleToastsRepositionTransition(toasts, false);
}

async function showAndRepositionReversedOrder(toast: Toast, toasts: Toast[]) {
  const translate = {
    x: toast.translate.x,
    y: toasts.length ? getStartTranslateYForReversedOrder(toast, toasts) : 0,
  };
  updateToastTranslate(toast, translate.x, translate.y);

  toast.delayBeforeShow && (await sleep(toast.delayBeforeShow));
  await showToast(toast);
  toggleAnimation(toast, t => t.inAnimation, false);
  toast.animateBody &&
    toggleAnimation(
      toast,
      t => t.inBodyAnimation,
      false,
      animationElementSelector.body
    );
}

async function showAndReposition(toast: Toast) {
  setMeasure(toast, measureType.height);
  setMeasure(toast, measureType.width);
  const toastMap = toastQueue.get();
  const toasts = Array.from(toastMap.values());
  const toastsFromTheSameGroup = getToastsForReposition(
    toasts,
    toast,
    actionType.add
  );

  toast.order === displayOrder.normal
    ? await showAndRepositionNormalOrder(toast, toastsFromTheSameGroup)
    : await showAndRepositionReversedOrder(toast, toastsFromTheSameGroup);

  setToastAutoHide(toast);
}

export async function show(toast: Toast) {
  const toastMap = toastQueue.get();
  await showAndReposition(toast);
  const toasts = Array.from(toastMap.values());
  await assureToastsPosition(toast, toasts);
}

export async function handleShowToast(event: CustomEvent<Toast>) {
  const toast = event.detail;

  const action: Action = {
    actionType: actionType.add,
    fn: show.bind(null, toast),
  };
  await register(action);
}

export function setMeasure(toast: Toast, measure: MeasureType) {
  if (!toast.element || !toast.element) return;
  toast.dimensions = {
    ...toast.dimensions,
    [measure]: getOuter(toast.element, measure),
  };
}

function setToastProgress(toast: Toast, value: number) {
  toast.element?.style.setProperty("--progressValue", `${value}`);
}

function isReadyForAutoHide(toast: Toast) {
  return toast.autoHideDetails.timeVisible >= toast.autoHide;
}

function shouldRecalculateTimeVisible(toast: Toast) {
  return !toast.autoHideDetails.isPaused;
}

function shouldSetProgress(toast: Toast) {
  return (
    toast.showProgress &&
    typeof toast.autoHide === "number" &&
    !toast.autoHideDetails.isPaused
  );
}

function recalculateTimeVisible(
  toast: Toast,
  currentTime: number,
  lastTime: number
) {
  toast.autoHideDetails.timeVisible += currentTime - lastTime;
}

export function setToastAutoHide(toast: Toast) {
  if (!toast.autoHide) return;

  let lastTime = new Date().getTime();

  toast.autoHideDetails.intervalId = setInterval(() => {
    const currentTime = new Date().getTime();

    isReadyForAutoHide(toast) && toast.hide(true);

    shouldRecalculateTimeVisible(toast) &&
      recalculateTimeVisible(toast, currentTime, lastTime);

    shouldSetProgress(toast) &&
      setToastProgress(
        toast,
        toast.autoHideDetails.timeVisible / (toast.autoHide as number)
      );

    lastTime = currentTime;
  }, 16.6);
}
