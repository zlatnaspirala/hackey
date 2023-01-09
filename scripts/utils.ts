export function getAudio(id: string): HTMLAudioElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLAudioElement)) {
    throw new Error(`Element "${id}" not found or not an audio element.`);
  }
  return el;
}

export function getButton(id: string): HTMLButtonElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLButtonElement)) {
    throw new Error(`Element "${id}" not found or not a button element.`);
  }
  return el;
}

export function getButtons(id: string): Array<HTMLButtonElement> {
  const els = document.getElementsByClassName(id);
  if (!els.length) {
    throw new Error(`Elements "${id}" not found.`);
  }
  const buttons: Array<HTMLButtonElement> = [];
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    if (!(el instanceof HTMLButtonElement)) {
      throw new Error(`Element ${i} of "${id}" not a button element.`);
    }
    buttons.push(el);
  }
  return buttons;
}

export function getDiv(id: string): HTMLDivElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLDivElement)) {
    throw new Error(`Element "${id}" not found or not a div element.`);
  }
  return el;
}

export function getInput(id: string): HTMLInputElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLInputElement)) {
    throw new Error(`Element "${id}" not found or not an input element.`);
  }
  return el;
}

export function getSpan(id: string): HTMLSpanElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLSpanElement)) {
    throw new Error(`Element "${id}" not found or not a span element.`);
  }
  return el;
}

export function getVideo(id: string): HTMLVideoElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLVideoElement)) {
    throw new Error(`Element "${id}" not found or not a video element.`);
  }
  return el;
}

export function getE(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLElement)) {
    throw new Error(`Element "${id}" not found or not any kindof HTMLElement.`);
  }
  return el;
}

export class LocalStorageMemory {

  public localStorage;

  constructor() {
    // empty
    this.localStorage = window.localStorage;
  }

  /**
   * save  Put the object into storage.
   * @example Usage : save("MyObjectKey", myObject )
   * @method save
   * @param {String} Name Name of localstorage key
   * @param {object} Value Any object we can store.
   * @return {false | object} What ever we are stored intro localStorage.
   */
  public save(name: string, obj: unknown) {
    try {
      return localStorage.setItem(name, JSON.stringify(obj));
    } catch (e) {
      console.log("Something wrong in LocalStorageMemory class , method save!");
      return false;
    }
  }

  /**
   * Load saved object from storage. Retrieve the object from storage or
   * return false.
   * @example Usage : var giveMeMyObject = load("MyObjectKey")
   * @function load
   * @param {String} Name Name of localstorage key
   * @return {false | object} What ever we are stored intro localStorage.
   */
  public load(name: string) {
    if (localStorage.getItem(name) === "undefined" || localStorage.getItem(name) == null || localStorage.getItem(name) === "") {
      console.warn("LocalStorageMemory method load return's: ", localStorage.getItem(name));
      return null;
    } else {
      return JSON.parse(localStorage.getItem(name) as string);
    }
  }

}