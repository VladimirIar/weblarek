import { IBuyer } from "../../types/IBuyer";
import { TPayment } from "../../types/IBuyer";
import { EventEmitter } from "../base/Events";

export class Customer {
  private customerData: IBuyer = {
    payment: "",
    email: "",
    phone: "",
    address: "",
  };
  /**
   * Поля конструктора опциональны
   * @param payment - способ оплаты, только 'card', 'cash' или ''
   * @param email
   * @param phone
   * @param address
   */
  constructor(private events: EventEmitter) {}

  /**
   * сохранение данных в модели.
   * @param field - поле должно иметь одно из значений :  payment, email, phone, address
   * @param value - принимает любое строковое значение. Если поле имеет значение payment
   * value может быть только 'card', 'cash' или ''
   */
  setField(field: keyof IBuyer, value: string | TPayment): void {
    switch (field) {
      case "payment":
        if (value === "card" || value === "cash" || value === "") {
          this.customerData.payment = value;
          this.events.emit("customer:change");
        }
        break;
      case "email":
        this.customerData.email = value;
        this.events.emit("customer:change");

        break;
      case "phone":
        this.customerData.phone = value;
        this.events.emit("customer:change");

        break;
      case "address":
        this.customerData.address = value;
        this.events.emit("customer:change");
        break;
      
    }
  }
  /**
   *
   * @returns - возвращает все данные покупателя
   */
  getCustomerData(): IBuyer {
    return { ...this.customerData };
  }

  /**
   * очищает все данные покупателя
   */
  clearCustomerData(): void {
    this.customerData = { payment: "", email: "", phone: "", address: "" };
    this.events.emit("customer:change");
  }

  /**
   * валидация данных.
   * @returns - возвращает объект с полями
   * соответствующие полям объекта customerData, значениями у которых будет текст
   * ошибки в случае если поле пустое.
   */
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (this.customerData.payment === "") {
      errors.payment = "Не выбран вид оплаты";
    }
    if (this.customerData.email == "") {
      errors.email = "Укажите емэйл";
    }
    if (this.customerData.phone == "") {
      errors.phone = "Введите номер телефона";
    }
    if (this.customerData.address == "") {
      errors.address = "Необходиме указать адрес";
    }
    return errors;
  }
}
