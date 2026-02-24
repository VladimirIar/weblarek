import { ensureElement, ensureAllElements } from "../../../utils/utils";
import { Form } from "./Form";
import { EventEmitter } from "../../base/Events";
import { TPayment } from "../../../types/IBuyer";

export class Order extends Form {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(protected events: EventEmitter, container: HTMLElement) {
    super(container);
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      this.container
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      ".form__input",
      this.container
    );
    this.submitButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      events.emit("order:submit");
    });
    this.addressInput.addEventListener("input", (ev) => {
      const input = ev.target as HTMLInputElement;
      events.emit("order:address", { address: input.value });
    });
    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", (ev) => {
        const target = ev.target as HTMLButtonElement;
        events.emit("order:payment", { payment: target.name });
      });
    });
  }
  set payment(type: TPayment) {
    this.paymentButtons.forEach((button) => {
      const isActive = button.name === type;
      button.classList.toggle("button_alt-active", isActive);
    });
  }
  set addres(value: string) {
    this.addressInput.value = value;
  }
}
