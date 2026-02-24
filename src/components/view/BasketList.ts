import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

type TBasket = {
  price: number;
  list?: HTMLElement[];
  buttonDisabled: boolean;
};

export class basketList extends Component<TBasket> {
  protected basketList: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected totalPrice: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.basketList = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );
    this.totalPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.basketButton.disabled = true;
    this.basketButton.addEventListener("click", () => {
      events.emit("basket:order");
    });
  }
  set price(num: number) {
    this.totalPrice.textContent = num.toString() + " синапсов";
  }

  set list(products: HTMLElement[]) {
    this.basketList.innerHTML = "";
    products.forEach((product) => this.basketList.append(product));
  }

  set buttonDisabled(isDisable: boolean) {
      this.basketButton.disabled = isDisable;
  }
}
