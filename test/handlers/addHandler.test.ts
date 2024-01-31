import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { events } from "../../src/constants";
import { handleAddedToast } from "../../src/handlers/addHandler";
import * as toastQueue from "../../src/toastQueue";
import { Toast } from "../../src/types";
import { toastBase } from "../mocks";

describe("addHandler", () => {
  const addStub = vi.fn();

  let queue: Map<string, Toast>;
  let toast = { ...toastBase };

  beforeEach(() => {
    toast = { ...toastBase };
    queue = new Map<string, Toast>();
    vi.spyOn(toastQueue.toastQueue, "get").mockReturnValue(queue);
    vi.spyOn(toastQueue, "addToQueue").mockImplementation(addStub);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("handleAddedToast", () => {
    it("should add function be invoked with toast", () => {
      const event = new CustomEvent<Toast>(events.added, { detail: toast });

      handleAddedToast(event);
      expect(addStub).toHaveBeenCalledWith(toast);
    });
  });
});
