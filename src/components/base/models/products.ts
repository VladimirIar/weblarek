import { IProduct } from "../../../types/IProduct";
import { EventEmitter } from "../Events";

export class Products {
  private chosenCard?: IProduct;

  /**
   *  в конструктор опционально можно передать товары, но так же можно создать пустой экземпляр
   */
  constructor(private events: EventEmitter, private items: IProduct[] = []) {}
  /**
   * сохранение массива товаров полученного в параметрах метода
   * @param items массив товаров
   */
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("products:change");
  }

  /**
   *
   * @returns вовращает список товаров
   */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * получение одного товара по его id;
   * @param id идентефикатор искомого товара
   * @returns возващает сам товар или undefined если такого id нет
   */
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  /**
   * сохранение товара для подробного отображения
   * @param item Один товар
   */
  saveCard(item: IProduct): void {
    this.chosenCard = item;
    this.events.emit("product:select");
  }

  /**
   *
   * @returns Возвращает товар для отображения
   */
  getCard(): IProduct {
    if (!this.chosenCard) {
      throw new Error("Карточка товара не определена");
    } else return this.chosenCard;
  }
}
