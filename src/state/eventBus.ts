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
    // Simple synchronous invocation is sufficient; tests should use
    // `waitFor` / `findBy*` to await UI updates instead of depending on
    // event-bus internal wrapping. Keep publish synchronous to avoid
    // surprising async scheduling in production.
    invokeHandlers()
  }
}

export const eventBus = new SimpleEventBus()

export default eventBus
