import { Toast } from ".";

const queue = new Map<string, Toast>();

export function get() {
  return queue;
}

export function addToQueue(toast: Toast) {
  const toastMap = toastQueue.get();
  const existingToast = toastMap.get(toast.id);
  if (toastMap.has(toast.id) && existingToast?.uuid !== toast.uuid) {
    throw new Error(`Toast with id ${toast.id} already exists!`);
  }
  toastMap.set(toast.id, toast);
}

export function update(toast: Toast) {
  const toastMap = toastQueue.get();
  toastMap.set(toast.id, toast);
}

export const toastQueue = {
  get,
};
