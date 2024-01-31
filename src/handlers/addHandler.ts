import { addToQueue } from "@/toastQueue";
import { Toast } from "@/types";

export function handleAddedToast(event: CustomEvent<Toast>) {
  const toast = event.detail;
  addToQueue(toast);
}
