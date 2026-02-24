import "./scss/styles.scss";
import { Basket } from "./components/base/models/basket";
import { Products } from "./components/base/models/products";
import { Customer } from "./components/base/models/customer";
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { ApiClient } from "./components/base/ApiClient";
import { Gallery } from "./components/base/view/Gallery";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";

import { CardCatalog } from "./components/base/view/card/CardCatalog";
import { IProduct } from "./types/IProduct";
import { CardPreview } from "./components/base/view/card/CardPreview";
import { Modal } from "./components/base/view/Modal";
import { Header } from "./components/base/view/Header";
import { basketList } from "./components/base/view/BasketList";
import { CardBasket } from "./components/base/view/card/CardBasket";
import { Order } from "./components/base/view/Forms/Order";
import { Contacts } from "./components/base/view/Forms/Contacts";
import { IOrderRequest } from "./types/IOrderRequest";
import { Success } from "./components/base/view/Success";

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
      onClick: () => events.emit("product:select", item),
    });
    return card.render(item);
  });
  gallery.render({ catalog: cards });
});

events.on("product:select", (element: IProduct) => {
  const isSelected = basketModel.hasItem(element.id);
  const buttonText =
    element.price == null
      ? "Недоступно"
      : isSelected
      ? "Удалить из корзины"
      : "Купить";
  const preview = new CardPreview(cloneTemplate("#card-preview"), {
    onClick: () => events.emit("product:chosen", element),
  });
  modal.content = preview.render({
    ...element,
    buttonText: buttonText,
    buttonDisabled: element.price == null,
  });
  modal.open();
});

events.on("modal:close", () => {
  modal.close();
});

events.on("basket:change", () => {
  header.counter = basketModel.getAmount();
});

events.on("product:chosen", (element: IProduct) => {
  basketModel.hasItem(element.id)
    ? basketModel.deleteItem(element)
    : basketModel.addItem(element);
  modal.close();
});

events.on("basket:render", () => {
  const items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate("#card-basket"), {
      onClick: () => {
        events.emit("basket:deleteItem", item);
      },
    });
    return card.render({ ...item, index: index + 1 });
  });
  modal.content = basket.render({
    price: basketModel.getTotalPrice(),
    list: items,
    buttonDisabled: basketModel.getAmount() == 0,
  });
  modal.open();
});

events.on("basket:deleteItem", (element: IProduct) => {
  basketModel.deleteItem(element);
  events.emit("basket:render");
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
  order.payment = customerModel.getCustomerData().payment;
  order.addres = customerModel.getCustomerData().address;
  contacts.email = customerModel.getCustomerData().email;
  contacts.phone = customerModel.getCustomerData().phone;
  order.error =
    customerModel.validate().address || customerModel.validate().payment || "";
  contacts.error =
    customerModel.validate().email || customerModel.validate().phone || "";

  order.disable =
    customerModel.validate().address != undefined ||
    customerModel.validate().payment != undefined;

  contacts.disable =
    customerModel.validate().email != undefined ||
    customerModel.validate().phone != undefined;
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
    payment: customerModel.getCustomerData().payment,
    email: customerModel.getCustomerData().email,
    phone: customerModel.getCustomerData().phone,
    address: customerModel.getCustomerData().address,
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
