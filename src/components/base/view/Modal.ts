import { Component } from "../Component";
import { EventEmitter } from "../Events";
import { ensureElement } from "../../../utils/utils";

type TModal = {content: HTMLElement}

export class Modal extends Component<TModal>{
  protected closeButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(events: EventEmitter, container: HTMLElement) {
    super(container)
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', (ev) => {
      if(ev.target == this.container) {
        this.close();
        events.emit("modal:close");
      }
    })
  }
  open() {
    this.container.classList.add('modal_active')
  }
  close() {
    this.modalContent.innerHTML = '';
    this.container.classList.remove('modal_active')
  }
  set content(elements: HTMLElement) {
    this.modalContent.append(elements)
  }
}