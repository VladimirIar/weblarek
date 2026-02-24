import { IProduct } from "../../types/IProduct";
import { EventEmitter } from "../base/Events";

export class Basket {
  private events: EventEmitter;
  /**
   * в конструктор необходимо передать события
   * так же в конструктор опционально можно передат товары или создать пустой экземпляр
   */
  constructor(events: EventEmitter, private items: IProduct[] = []) {
    this.events = events;
  }

  /**
   * @returns получение массива товаров, которые находятся в корзине
   */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /**
   * добавление товара, который был получен в параметре, в массив корзины;
   * @param item
   */
  addItem(item: IProduct): void {
    if (this.items.some((product) => product.id === item.id)) {
      throw new Error(`товар "${item.title}" уже есть в корзине`);
    }
    this.items.push(item);
    this.events.emit("basket:change");
  }

  /**
   * удаление товара, полученного в параметре из массива корзины;
   * @param item
   */
  deleteItem(item: IProduct): void {
    const id: string = item.id;
    this.items = this.items.filter((product) => product.id !== id);
    this.events.emit("basket:change");
  }

  /**
   * Очистить корзину
   */
  clearCart(): void {
    this.items = [];
    this.events.emit("basket:change");
  }

  /**
   *
   * @returns возвращает сумму цен всех товаров в корзине
   */
  getTotalPrice(): number {
    const total: number = this.items.reduce((sum, item) => {
      if (typeof item.price === "number") return sum + item.price;
      else return sum;
    }, 0);
    return total;
  }

  /**
   *
   * @returns возвращает количество товаров в коризне
   */
  getAmount(): number {
    return this.items.length;
  }

  /**
   * проверяет наличие товара в корзине
   * @param id
   * @returns
   */
  hasItem(id: string): boolean {
    for (const item of this.items) {
      if (item.id === id) {
        return true;
      }
    }
    return false;
  }
}
