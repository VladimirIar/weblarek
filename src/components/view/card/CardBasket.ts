import { ensureElement } from "../../../utils/utils";
import { Card, TCard } from "./Card";
import { ICardAction } from "../../../types/ICardAction";

type TCardBasket = TCard & { index: number };

export class CardBasket extends Card<TCardBasket> {
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;
  protected actions?: ICardAction;
  constructor(container: HTMLElement, actions?: ICardAction) {
    super(container);
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    if (actions?.onClick) {
      this.actions = actions
      this.deleteButton.addEventListener("click", this.actions.onClick);
    }
  }
  set index(num: number) {
    this.indexElement.textContent = num.toString();
  }
}
