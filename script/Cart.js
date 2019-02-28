class Cart {
    constructor(source, container = '.cart-drop') {
        this.source = source;
        this.container = container;
        this.countGoods = 0; // Общее кол-во товаров в корзине
        this.amount = 0; // Общая стоимость товаров
        this.cartItems = []; // Массив с товарами
        this._init(this.source);
    }

    _render() {
        let $cartItemsDiv = $('<div/>', {
            class: 'cart-drop-wrapper'
        });

        $cartItemsDiv.appendTo($(this.container));
        $(this.container).append(`<div class="cart-drop__total"><span>total</span><span class="totalAmount"></span></div>`);
        $(this.container).append(`<a href="checkout.html" class="cart-product__checkout">Checkout</a>`);
        $(this.container).append(`<a href="shopping-cart.html" class="cart-product__go-to-cart">Go&nbsp;to&nbsp;cart</a>`);
    }

    _renderItem(product) {
        let $container = $('<div/>', {
            class: 'cart-drop-flex clearDropCart',
            'data-product': product.id_product
        });

        let $innerContainer = $('<div/>', {
            class: 'cart-product-description'
        });
        $container.append($(`<a class="cart-product" href="single-page.html"><img src=${product.src} alt="product" class="cart-product__img"></a>`));
        $container.append($innerContainer);
        $innerContainer.append(`<h3 class="cart-drop__heading">${product.product_name}</h3>
        <i class="fas fa-star star"></i>
            <i class="fas fa-star star"></i>
            <i class="fas fa-star star"></i>
            <i class="fas fa-star star"></i>
            <i class="fas fa-star-half-alt star"></i>
            <p class="cart-drop__quantity">${product.quantity}&nbsp;x $${product.price}</p>`);
        let $delBtn = $(`<a href="#"><i class="fas fa-times-circle shut"></i></a>`);
        $container.append($delBtn);
        $delBtn.click(() => {
            this._remove(product.id_product)
        });
        $container.appendTo($('.cart-drop-wrapper'));

    }

    _renderCartItem(product) {
        let $container = $(`<tr data-product = "${product.id_product}" class="productCartItem">
        <td>
            <a class="prod-info transform_scale" href="single-page.html"><img src=${product.src} alt="product">
                <h4 class="product-cart-name">${product.product_name}</h4>
                <p class="prod-det"><span>Color: </span>Red</p>
                <p class="prod-det"><span>Size: </span>Xll</p>
            </a>
        </td>
        <td>$${product.price}</td>
        <td><input class="prod-quantity" type="number" value=${product.quantity} name="quant"></td>
        <td>FREE</td>
        <td class="subtotal">$${product.price*product.quantity}</td>
        <td><a href="#"><i class="fas fa-times-circle shut transform_scale delCartBtn"></i></a></td>
    </tr>`);

        $container.appendTo($('.products-table'));
        let $delBtn = $('.delCartBtn');
        $delBtn.click(() => {
            this._remove(product.id_product);
        });
    }

    _renderSum() {
        //$('.sum-amount').text(`Всего товаров в корзине: ${this.countGoods}`);
        $('.totalAmount').text(`$${this.amount}`);
        $('.cartSubtotal').text(`$${this.amount}`);
        $('.total-price').text(`$${this.amount}`);
    }

    _init(source) {
        this._render();
        if (!localStorage.getItem('mycart')) {
            fetch(source)
                .then(result => result.json())
                .then(data => {
                    for (let product of data.contents) {
                        this.cartItems.push(product);
                        this._renderItem(product);
                        this._renderCartItem(product);
                    }
                    this.countGoods = data.countGoods;
                    this.amount = data.amount;
                    localStorage.setItem('mycart', JSON.stringify(this.cartItems));
                    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
                    localStorage.setItem('amount', JSON.stringify(this.amount));
                    this._renderSum();
                });
        } else {
            this.cartItems = JSON.parse(localStorage.getItem('mycart'));
            for (let product of this.cartItems) {
                this._renderItem(product);
                this._renderCartItem(product);
            }
            this.countGoods = JSON.parse(localStorage.getItem('countGoods'));
            this.amount = JSON.parse(localStorage.getItem('amount'));
            this._renderSum();
        }
    }

    _updateCart(product) {
        let $container = $(`div[data-product="${product.id_product}"]`);
        $container.find('.cart-drop__quantity').text(`${product.quantity} x $${product.price}`);
        // $container.find('.product-price').text(`${product.quantity * product.price} руб.`);
    }

    _updateCartItem(product) {
        let $container = $(`tr[data-product="${product.id_product}"]`);
        $container.find('.prod-quantity').attr("value", `${product.quantity}`);
        $container.find('.subtotal').text(`$${product.price * product.quantity}`);
    }

    addProduct(element) {
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
            this._updateCartItem(find);
        } else {
            let product = {
                id_product: productId,
                price: +$(element).data('price'),
                product_name: $(element).data('name'),
                quantity: 1,
                src: $(element).data('src')
            };
            this.cartItems.push(product);
            this.countGoods += product.quantity;
            this.amount += product.price;
            this._renderItem(product);
            this._renderCartItem(product);
        }
        localStorage.setItem('mycart', JSON.stringify(this.cartItems));
        localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
        localStorage.setItem('amount', JSON.stringify(this.amount));
        this._renderSum();
    }

    _remove(idProduct) {
        let find = this.cartItems.find(product => product.id_product === idProduct);
        if (find.quantity > 1) {
            find.quantity--;
            this._updateCart(find);
            this._updateCartItem(find);
        } else {
            let $containerDrop = $(`div[data-product="${idProduct}"]`);
            let $containerCart = $(`tr[data-product="${idProduct}"]`);
            this.cartItems.splice(this.cartItems.indexOf(find), 1);
            $containerDrop.remove();
            $containerCart.remove();
        }
        this.countGoods--;
        this.amount -= find.price;
        localStorage.setItem('mycart', JSON.stringify(this.cartItems));
        localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
        localStorage.setItem('amount', JSON.stringify(this.amount));
        this._renderSum()
    }

    clearCart() {
        let $cartPage = $('.productCartItem');
        let $cartDrop = $('.clearDropCart');
        $cartDrop.remove();
        $cartPage.remove();
        this.cartItems = [];
        this.countGoods = 0;
        this.amount = 0;

        localStorage.setItem('mycart', JSON.stringify(this.cartItems));
        localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
        localStorage.setItem('amount', JSON.stringify(this.amount));
        this._renderSum()
    }

}