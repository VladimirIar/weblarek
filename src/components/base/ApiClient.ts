import { IApi } from "../../types";
import { IOrderRequest } from "../../types/IOrderRequest";
import { IOrderResponse } from "../../types/IOrderResponse";
import { IProduct } from "../../types/IProduct";

export class ApiClient{

  /**
   * 
   * @param api - объект, реализующий интерфейс IApi
   */
  constructor(private api: IApi){}

  /**
   * Получает каталог товаров с сервера.
   * Выполняет GET-запрос к эндпоинту товаров и возвращает массив товаров.
   * @returns - Промис с массивом товаров, доступных для покупки
   */
  async getProducts(): Promise<IProduct[]> {
    return this.api.get<{total: number, items: IProduct[]}>('/product/')
    .then(response => response.items);
  }

  /**
   * Отправляет заказ на сервер для оформления.
   * Выполняет POST-запрос к эндпоинту заказов с данными покупателя и выбранными товарами.
   * @param orderData - данные заказа, включая информацию о покупателе и список товаров.
   * @returns - Промис с ответом сервера, содержащим идентификатор созданного заказа и итоговую сумму.
   */
  async confirmOrder(orderData: IOrderRequest) : Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', orderData);
  }
}