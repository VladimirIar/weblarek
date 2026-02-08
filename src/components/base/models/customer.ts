import { IBuyer } from "../../../types/IBuyer";
import { TPayment } from "../../../types/IBuyer";

export class Customer {
  private customerData: IBuyer;

  /**
   * Поля конструктора опциональны
   * @param payment - способ оплаты, только 'card', 'cash' или ''
   * @param email
   * @param phone
   * @param address
   */
  constructor(
    payment: TPayment = "",
    email: string = "",
    phone: string = "",
    address: string = ""
  ) {
    this.customerData = {
      payment,
      email,
      phone,
      address,
    };
  }

  /**
   * сохранение данных в модели.
   * @param field - поле должно иметь одно из значений :  payment, email, phone, address
   * @param value - принимает любое строковое значение. Если поле имеет значение payment
   * value может быть только 'card', 'cash' или ''
   */
  setField(field: keyof IBuyer, value: string | TPayment): void {
    switch (field) {
      case "payment":
        if (value === "card" || value === "cash" || value === "")
          this.customerData.payment = value;
        else {
          throw new Error(`Недопустимое значение payment: ${value}`);
        }
        break;
      case "email":
        this.customerData.email = value;
        break;
      case "phone":
        this.customerData.phone = value;
        break;
      case "address":
        this.customerData.address = value;
        break;
      default:
        throw new Error(`Значение ${field} не найдено`);
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
  }

  /**
   * валидация данных.
   * @returns - возвращает объект с полями
   * соответствующие полям объекта customerData, значениями у которых будет текст
   * ошибки в случае если поле пустое.
   */
  validate(): {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
  } {
    const errors: any = {};
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
      errors.address = "Укажите адрес";
    }
    return errors;
  }
}
