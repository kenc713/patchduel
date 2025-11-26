type Handler = (payload: any) => void

/**
 * シンプルなイベントバス実装
 * 登録されたハンドラーに対してイベントを配信する
 */
class SimpleEventBus {
  private handlers: Map<string, Set<Handler>> = new Map()

  /**
   * ハンドラーの登録
   * @param event 
   * @param h 
   * @returns 
   */
  subscribe(event: string, h: Handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set())
    this.handlers.get(event)!.add(h)
    return () => this.unsubscribe(event, h)
  }

  /**
   * ハンドラーの登録解除
   * @param event 
   * @param h 
   * @returns 
   */
  unsubscribe(event: string, h: Handler) {
    const s = this.handlers.get(event)
    if (!s) return
    s.delete(h)
    if (s.size === 0) this.handlers.delete(event)
  }

  /**
   * 登録されたハンドラーにイベントを配信する
   * @param event 
   * @param payload 
   * @returns 
   */
  publish(event: string, payload?: any) {
    const s = this.handlers.get(event)
    if (!s) return
    const invokeHandlers = () => {
      for (const h of Array.from(s)) {
        try { h(payload) } catch (e) { /* swallow handler errors */ }
      }
    }

    // Try to use React's test `act` when available (in test envs) so
    // state updates triggered by handlers are wrapped and won't warn.
    // We use a dynamic import and call it asynchronously; if it fails
    // (production/browser), fall back to immediate invocation.
    // First try synchronous require-based approaches (works in Node/test env).
    try {
      // Try to obtain CommonJS `require` at runtime without referencing
      // the identifier directly (so bundlers/TS don't error). This works
      // in Node/test environments while safely failing in browsers.
      let nodeRequire: any = undefined;
      try {
        nodeRequire = (globalThis as any).require ?? Function("return require")();
      } catch (e) {
        /* ignore - not available */
      }

      if (nodeRequire) {
        const reactReq = nodeRequire("react");
        if (reactReq && typeof reactReq.act === "function") {
          const prev = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
          try {
            ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
            reactReq.act(() => {
              invokeHandlers();
            });
            return;
          } finally {
            ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = prev;
          }
        }
      }
    } catch (e) {
      // ignore
    }

    try {
      let nodeRequire: any = undefined;
      try {
        nodeRequire = (globalThis as any).require ?? Function("return require")();
      } catch (e) {
        /* ignore */
      }

      if (nodeRequire) {
        const rdt = nodeRequire("react-dom/test-utils");
        if (rdt && typeof rdt.act === "function") {
          const prev = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
          try {
            ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
            rdt.act(() => {
              invokeHandlers();
            });
            return;
          } finally {
            ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = prev;
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // No synchronous test act available — fall back to synchronous invocation.
    // Tests that need React's `act` should wrap `eventBus.publish` in `act()` themselves;
    // meanwhile ensure handlers are invoked synchronously so callers relying on
    // immediate effects (tests) observe changes without awaiting microtasks.
    invokeHandlers()
  }
}

export const eventBus = new SimpleEventBus()

export default eventBus
