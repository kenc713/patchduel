import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../src/App";

describe("Layout centering", () => {
  // App コンポーネントの子要素が中央揃え（align-items: center）になっていることを確認
  it("centers app children (align-items: center)", () => {
    const { container } = render(<App />);
    const app = container.querySelector(".app");
    expect(app).toBeTruthy();
    const style = window.getComputedStyle(app as Element);
    expect(style.display).toBe("flex");
    expect(style.alignItems).toBe("center");
  });
});
