import { Component } from "../Component";

type TGallery = {
  catalog: HTMLElement[]
}

export class Gallery extends Component<TGallery>{
  constructor(container: HTMLElement) {
    super(container)
  }

  set catalog(cards: HTMLElement[]) {
    cards.forEach((card) => {
      this.container.append(card)
    })
  }
}