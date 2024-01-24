import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Toast, cssClassNames, events } from "../../src";
import { eventManager } from "../../src/eventManager";
import { handleMountedToast } from "../../src/handlers/mountHandler";
import * as toastPositionManager from "../../src/toastPositionManager";
import * as toastQueue from "../../src/toastQueue";
import { toastBase } from "../mocks";

describe("mountHandler", () => {
  const reindexToastsForPositionStub = vi.fn();
  const emitStub = vi.fn();

  let queue: Map<string, Toast>;
  let toast = {
    ...toastBase,
  };

  beforeEach(() => {
    toast = {
      ...toastBase,
    };

    queue = new Map<string, Toast>();
    queue.set(toast.id, toast);

    vi.spyOn(toastQueue.toastQueue, "get").mockReturnValue(queue);
    vi.spyOn(
      toastPositionManager,
      "reindexToastsForPosition"
    ).mockImplementation(reindexToastsForPositionStub);
    vi.spyOn(eventManager, "emit").mockImplementation(emitStub);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("handleMountedToast", () => {
    it("should do nothing if toast is already mounted", () => {
      toast.element = document.createElement("div");

      const event = new CustomEvent<Toast>(events.mounted, { detail: toast });

      handleMountedToast(event);

      expect(reindexToastsForPositionStub).not.toBeCalled();
    });

    it("should update the added toast with the new object containing element prop", () => {
      const mountedToast = {
        ...toast,
        element: document.createElement("div"),
      };

      const event = new CustomEvent<Toast>(events.mounted, {
        detail: mountedToast,
      });

      handleMountedToast(event);

      expect(queue.get(toast.id)).toEqual(mountedToast);
    });

    it("should emit show event once the toast is mounted", () => {
      const mountedToast = {
        ...toast,
        element: document.createElement("div"),
      };

      const event = new CustomEvent<Toast>(events.mounted, {
        detail: mountedToast,
      });

      handleMountedToast(event);

      expect(emitStub).toBeCalledWith(events.show, mountedToast);
    });

    it("should add toast class to the mounted toast", () => {
      const mountedToast = {
        ...toast,
        element: document.createElement("div"),
      };

      const event = new CustomEvent<Toast>(events.mounted, {
        detail: mountedToast,
      });

      handleMountedToast(event);

      expect(
        mountedToast.element.classList.contains(cssClassNames.toast)
      ).toBeTruthy();
    });
  });
});
