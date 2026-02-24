import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

type TSuccess = { description: number };

export class Success extends Component<TSuccess> {
  protected closeButton: HTMLButtonElement;
  protected totalPrice: HTMLElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );
    this.totalPrice = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      events.emit("success:close");
    });
  }

  set description(num: number) {
    this.totalPrice.textContent = `Списано ${num} синапсов`;
  }
}
