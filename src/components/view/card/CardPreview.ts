import { ensureElement } from "../../../utils/utils";
import { CardCatalog, TCardCatalog } from "./CardCatalog";
import { ICardAction } from "../../../types/ICardAction";

type TCardPreview = TCardCatalog & {disabled: boolean, buttonText: string}

export class CardPreview extends CardCatalog<TCardPreview> {
  protected subtitleElement: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected actions?: ICardAction;
  constructor(container: HTMLElement, actions?: ICardAction) {
    super(container);
    this.subtitleElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    this.actions = actions;
      this.basketButton.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this.actions?.onClick?.(ev);
      });
  }
  set description(textSubtitle: string) {
    this.subtitleElement.textContent = textSubtitle;
  }
  set disabled(isDisable: boolean) {
    this.basketButton.disabled = isDisable;
  }
  set buttonText(textOnButton: string) {
    this.basketButton.textContent = textOnButton;
  }
  set action(action: ICardAction) {
    this.actions = action;
  }
}
