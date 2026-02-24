import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

type TForm = {
  error: string;
  disable: boolean;
};

export abstract class Form extends Component<TForm> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type = "submit"]',
      this.container
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );
  }
  set error(errorText: string) {
    this.errorsElement.textContent = errorText;
  }
  set disable(isDisable: boolean) {
    this.submitButton.disabled = isDisable;
  }
}
