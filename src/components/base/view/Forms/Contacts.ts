import { ensureElement } from "../../../../utils/utils";
import { Form } from "./Form";
import { EventEmitter } from "../../Events";

export class Contacts extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.submitButton.addEventListener('click', (ev) => {
      ev.preventDefault();
      events.emit('contacnts:submit')
    })
    this.emailInput.addEventListener('input', (ev) => {
      const input = ev.target as HTMLInputElement;
      events.emit('contacts:email', {email: input.value})
    })
    this.phoneInput.addEventListener('input', (ev) => {
      const input = ev.target as HTMLInputElement;
      events.emit('contacts:phone', {phone: input.value})
    })
  }
  set email(value: string) {
    this.emailInput.value = value
  }
  set phone(value: string) {
    this.phoneInput.value = value;
  }
}