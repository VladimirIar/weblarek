import { IProduct } from "../../../types/IProduct";

export class Basket {
  /**
   * в конструктор опционально можно передат товары или создать пустой экземпляр
   */
  constructor(private items: IProduct[] = []) {}

  /**
   *
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
    if(this.items.some(product => product.id === item.id)) {
      throw new Error (`товар "${item.title}" уже есть в корзине`)
    }
    this.items.push(item);
  }

  /**
   * удаление товара, полученного в параметре из массива корзины;
   * @param item
   */
  deleteItem(item: IProduct): void {
    const id: string = item.id;
    this.items = this.items.filter((product) => product.id !== id);
  }

  /**
   * Очистить корзину
   */
  clearCart(): void {
    this.items = [];
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
