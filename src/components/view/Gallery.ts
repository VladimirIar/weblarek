import { Component } from "../base/Component";

type TGallery = {
  catalog: HTMLElement[];
};

export class Gallery extends Component<TGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(cards: HTMLElement[]) {
      this.container.replaceChildren(...cards);
  }
} 
