
export type TPayment = 'cash' | 'card' | '';
/**
* Интерфейс для учёта данных покупателя при оформлении заказа.
*/
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

