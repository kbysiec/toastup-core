import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Toast, events } from "../../src";
import { handleClickToast } from "../../src/handlers/clickHandler";
import * as toastModule from "../../src/toast";
import * as toastQueue from "../../src/toastQueue";
import { toastBase } from "../mocks";

describe("clickHandler", () => {
  const executeToastCallbackStub = vi.fn();

  let queue: Map<string, Toast>;
  let toast = {
    ...toastBase,
    id: "1",
  };

  beforeEach(() => {
    toast = {
      ...toastBase,
      id: "1",
    };

    queue = new Map<string, Toast>();
    queue.set(toast.id, toast);

    vi.spyOn(toastQueue.toastQueue, "get").mockReturnValue(queue);
    vi.spyOn(toastModule, "executeToastCallback").mockImplementation(
      executeToastCallbackStub
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("handleClickToast", () => {
    it("should do nothing if toast for given id is not found", () => {
      toast.element = document.createElement("div");

      const event = new CustomEvent<string>(events.click, { detail: "2" });

      handleClickToast(event);

      expect(executeToastCallbackStub).not.toBeCalled();
    });

    it("should executeToastCallback be invoked if the toast with given id exists", () => {
      toast.element = document.createElement("div");

      const event = new CustomEvent<string>(events.click, { detail: "1" });

      handleClickToast(event);

      expect(executeToastCallbackStub).toBeCalled();
    });
  });
});