import { ensureElement } from "../../../../utils/utils";
import { IProduct } from "../../../../types/IProduct";
import { CardCatalog } from "./CardCatalog";
import { ICardAction } from "../../../../types/ICardAction";

type TCardPreview = Pick<IProduct, 'description' | 'image' | 'category'> & 
{
  buttonText?: string;
  buttonDisabled?: boolean;
}

export class CardPreview extends CardCatalog {
  protected subtitleElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardAction) {
    super(container);
    this.subtitleElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    if(actions?.onClick) {
      this.basketButton.addEventListener('click', (ev) => {
        ev.stopPropagation();
        actions.onClick?.(ev)
      });
    }
  }
  set description(textSubtitle: string) {
    this.subtitleElement.textContent = textSubtitle;
  }
  set disabled(isDisable: boolean){
    this.basketButton.disabled = isDisable
  }

  set buttonText(textOnButton: string) {
    this.basketButton.textContent = textOnButton;
  }
  render(data?: Partial<TCardPreview> | undefined): HTMLElement {
    if(data?.description !== undefined) {
      this.description = data.description;
    }
    if(data?.buttonText !== undefined) {
      this.buttonText = data.buttonText;
    }
    if(data?.buttonDisabled !== undefined) {
      this.disabled = data.buttonDisabled
    }
    return super.render(data);
    }
}