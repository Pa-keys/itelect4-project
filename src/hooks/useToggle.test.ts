import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useToggle from "./useToggle";

describe("useToggle", () => {
  it("toggles from its initial value", () => {
    const { result } = renderHook(() => useToggle(false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
  });
});
