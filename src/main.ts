import "./scss/styles.scss";
import { Basket } from "./components/models/basket";
import { Products } from "./components/models/products";
import { Customer } from "./components/models/customer";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { ApiClient } from "./components/base/ApiClient";
import { Gallery } from "./components/view/Gallery";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";

import { CardCatalog } from "./components/view/card/CardCatalog";
import { IProduct } from "./types/IProduct";
import { CardPreview } from "./components/view/card/CardPreview";
import { Modal } from "./components/view/Modal";
import { Header } from "./components/view/Header";
import { basketList } from "./components/view/BasketList";
import { CardBasket } from "./components/view/card/CardBasket";
import { Order } from "./components/view/Forms/Order";
import { Contacts } from "./components/view/Forms/Contacts";
import { IOrderRequest } from "./types/IOrderRequest";
import { Success } from "./components/view/Success";

const events = new EventEmitter();
const productsModel = new Products(events);
const basketModel = new Basket(events);
const customerModel = new Customer(events);

const gallery = new Gallery(ensureElement(".gallery"));
const modal = new Modal(events, ensureElement(".modal"));
const header = new Header(events, ensureElement(".header"));
const basket = new basketList(events, cloneTemplate("#basket"));
const order = new Order(events, cloneTemplate("#order"));
const contacts = new Contacts(events, cloneTemplate("#contacts"));
const success = new Success(events, cloneTemplate("#success"));
const preview = new CardPreview(cloneTemplate('#card-preview'));

const api = new Api(API_URL);
const apiClient = new ApiClient(api);

apiClient
  .getProducts()
  .then((productsFromServer) => {
    productsModel.setItems(productsFromServer);
  })
  .catch((error) => {
    console.error(error);
  });

events.on("products:change", () => {
  const cards = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), {
      onClick: () => productsModel.saveCard(item),
    });
    return card.render(item);
  });
  gallery.render({ catalog: cards });
});


events.on("product:select", () => {
  const element = productsModel.getCard();
  if (!element) {
    return;
  }
  const isSelected = basketModel.hasItem(element.id);
  const buttonText =
    element.price == null
      ? "Недоступно"
      : isSelected
      ? "Удалить из корзины"
      : "Купить";
  
  preview.action = { onClick: () => events.emit("product:chosen", element) };
  modal.content = preview.render({
    ...element,
    buttonText: buttonText,
    disabled: element.price == null,
  });
  modal.open();
});

events.on("basket:change", () => {
  header.counter = basketModel.getAmount();
  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate("#card-basket"), {
      onClick: () => {
       { events.emit("basket:deleteItem", item), events.emit('basket:open') };
      },
    });
    return card.render({ ...item, index: index + 1 });
  });
  basket.render({
    price: basketModel.getTotalPrice(),
    list: items,
    buttonDisabled: basketModel.getAmount() == 0,
  });
});

events.on("product:chosen", () => {
  const element = productsModel.getCard();
  if (!element) {
    return;
  }
  basketModel.hasItem(element.id)
    ? basketModel.deleteItem(element)
    : basketModel.addItem(element);
  modal.close();
});

events.on("basket:open", () => {
  modal.content = basket.render();
  modal.open();
});

events.on("basket:deleteItem", (element: IProduct) => {
  basketModel.deleteItem(element);
  modal.close();
});

events.on("basket:order", () => {
  customerModel.clearCustomerData();
  modal.close();
  modal.content = order.render();
  modal.open();
});

events.on("order:payment", (value: { payment: "cash" | "card" | "" }) => {
  customerModel.setField("payment", value.payment);
});

events.on("order:address", (value: { address: string }) => {
  customerModel.setField("address", value.address);
});

events.on("customer:change", () => {
  const data = customerModel.getCustomerData();
  order.payment = data.payment;
  order.addres = data.address;
  contacts.email = data.email;
  contacts.phone = data.phone;
  const errors = customerModel.validate()
  const orderError = [errors.payment, errors.address]
  .filter(value => value)
  .join('; ');
  const orderDisable =
  customerModel.validate().address != undefined ||
  customerModel.validate().payment != undefined;
  
  order.render({error: orderError, disable: orderDisable});

  const contactsError = [errors.email, errors.phone]
  .filter(value => value)
  .join('; ');
  const contactsDisable =
    customerModel.validate().email != undefined ||
    customerModel.validate().phone != undefined;

  contacts.render({error: contactsError, disable: contactsDisable});
});

events.on("order:submit", () => {
  modal.close();
  modal.content = contacts.render();
  modal.open();
});

events.on("contacts:email", (value: { email: string }) => {
  customerModel.setField("email", value.email);
});

events.on("contacts:phone", (value: { phone: string }) => {
  customerModel.setField("phone", value.phone);
});

events.on("contacts:submit", async () => {

  const order: IOrderRequest = {
    ...customerModel.getCustomerData(), 
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotalPrice(),
  };
  try {
    const result = await apiClient.confirmOrder(order);
    success.description = result.total;
    basketModel.clearCart();
    customerModel.clearCustomerData();
    modal.close();
    modal.content = success.render();
    modal.open();
  } catch (err) {
    contacts.error = "Заказ не был оформлен";
  }
});

events.on("success:close", () => {
  modal.close();
});
