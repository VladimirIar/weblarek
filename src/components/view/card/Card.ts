import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IProduct } from "../../../types/IProduct";

export type TCard = Partial<IProduct>;

export abstract class Card<T extends TCard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container
    );
  }
  set title(textTitle: string) {
    this.titleElement.textContent = textTitle;
  }
  set price(textPrice: number | null) {
    if (textPrice !== null) {
      this.priceElement.textContent = textPrice.toString() + " синапсов";
    } else this.priceElement.textContent = "Бесценно";
  }
}
