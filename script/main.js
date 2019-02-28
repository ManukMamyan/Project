$(document).ready(() => {
   //Товары
  // let product1 = new Product(123, 'Ноутбук', 45600);
   //let product2 = new Product(124, 'Клавиатура', 1200);
   //let product3 = new Product(125, 'Мышь', 600);

   //Корзина
    let mycart = new Cart('getCart.json');

    //Добавление товара
    $('#products').on('click', '.add-to-cart', e => {
        mycart.addProduct(e.target);
    });

    $('#clearAllItems').on('click', '.clearCart', () => {
        mycart.clearCart();
    });

    //Отзывы
    let myfeed = new Feedback('feedback.json');
});