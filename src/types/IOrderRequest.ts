import { TPayment } from "./IBuyer";
import { IProduct } from "./IProduct";

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: IProduct['id'][];
  total: number;
}
