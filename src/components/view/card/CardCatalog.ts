import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types/IProduct";
import { ICardAction } from "../../../types/ICardAction";

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, "image" | "category">;

export class CardCatalog<T extends TCardCatalog> extends Card<T> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardAction) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }
  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
  set image(value: string) {
    this.setImage(
      this.imageElement,
      `${CDN_URL}${value.replace("svg", "png")}`,
      this.title
    );
  }
}
