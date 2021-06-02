export class EventHandler {
  public fireEvent(eventName: string, detail?: any) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}
