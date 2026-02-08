import './scss/styles.scss';
import { Basket } from './components/base/models/Basket';
import { Products } from './components/base/models/products';
import { Customer } from './components/base/models/Customer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ApiClient } from './components/base/ApiClient';


const basketModel = new Basket();
const productsModel = new Products();
const customerModel = new Customer(); 


//Тест функциональности
// productsModel.setItems(apiProducts.items);
// console.log(`Массив товаров из каталога: ${JSON.stringify(productsModel.getItems(), null, 2)}`)
// console.log(`Товар по ID: ${JSON.stringify(productsModel.getItemById(apiProducts.items[1].id), null, 2)}`)
// productsModel.saveCard(productsModel.getItems()[2])
// console.log(`сохраненный для подробного отображения товар: ${JSON.stringify(productsModel.getCard(), null, 2)}`)
// basketModel.addItem(productsModel.getItems()[3])
// basketModel.addItem(productsModel.getItems()[0])
// console.log(`сохраненныe в корзине товары: ${JSON.stringify(basketModel.getItems(), null, 2)}`)
// console.log(basketModel.getTotalPrice());
// console.log(basketModel.getAmount());
// console.log(basketModel.hasItem(apiProducts.items[0].id))
// console.log(basketModel.hasItem(apiProducts.items[1].id))
// basketModel.deleteItem(productsModel.getItems()[3])
// console.log(`сохраненныe в корзине товары после удаления одного товаара: ${JSON.stringify(basketModel.getItems(), null, 2)}`)

// customerModel.setField('payment', 'card');
// customerModel.setField('email', 'some@mail.com');
// customerModel.setField('phone', '+7(777)777-77-77');
// console.log(customerModel.getCustomerData());
// console.log(customerModel.validate())
// customerModel.setField('address', 'Ул. Пушкина')
// console.log(customerModel.getCustomerData());
// customerModel.clearCustomerData();
// console.log(customerModel.getCustomerData());
// console.log(customerModel.validate())

const API_INSTANCE = new Api(import.meta.env.VITE_API_ORIGIN);
const apiClient = new ApiClient(API_INSTANCE);

apiClient.getProducts().then(productsFromServer => {
  productsModel.setItems([...productsFromServer]);
  console.log(`Массив товаров из каталога: ${JSON.stringify(productsModel.getItems(), null, 2)}`)
})
