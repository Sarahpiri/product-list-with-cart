document.addEventListener("DOMContentLoaded", () => {
  const cartItems = {};
  const cartCount = document.getElementById("cart-count");
  const cartList = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const confirmOrder = document.getElementById("confirm-order");
  const orderConfirmed = document.getElementById("order-confirmed");
  const orderSummaryList = document.getElementById("order-summary-list");
  const orderTotalAmount = document.getElementById("order-total-amount");
  const startNewOrder = document.getElementById("start-new-order");
  const productCards = document.querySelectorAll(".card-1");

  productCards.forEach((card) => {
    const btn = card.querySelector(".Waffle-btn");
    const name = card.querySelector("p").innerText.trim();
    const priceText = card
      .querySelector("h4")
      .innerText.replace("$", "")
      .trim();
    const price = parseFloat(priceText);
    const imageSrc = card.querySelector("img").src; // دریافت مسیر عکس

    btn.addEventListener("click", () => {
      if (!cartItems[name]) {
        cartItems[name] = { quantity: 1, price, imageSrc }; // اضافه کردن imageSrc
        createCounter(btn, name);
        updateCart();
      }

      function createCounter(btn, name) {
        const counter = document.createElement("div");
        counter.classList.add("counter");

        const minus = document.createElement("img");
        minus.src = "./assets/images/icon-decrement-quantity.svg";
        minus.alt = "minus";
        minus.classList.add("btn-minus");

        const plus = document.createElement("img");
        plus.src = "./assets/images/icon-increment-quantity.svg";
        plus.alt = "plus";
        plus.classList.add("btn-plus");

        const countText = document.createElement("span");
        countText.textContent = cartItems[name].quantity;

        btn.replaceChildren();
        btn.appendChild(minus);
        btn.appendChild(countText);
        btn.appendChild(plus);
        btn.classList.add("added");

        minus.addEventListener("click", () => {
          if (!cartItems[name]) return;
          cartItems[name].quantity--;
          const newQty = cartItems[name].quantity;

          if (newQty === 0) {
            delete cartItems[name];
            console.log(cartItems[name], newQty);

            btn.innerHTML = `<img src='./assets/images/icon-add-to-cart.svg' alt='' />Add to Cart`;
            btn.classList.remove("added");
            btn.addEventListener(
              "click",
              () => {
                cartItems[name] = {
                  quantity: 1,
                  price: cartItems[name]?.price || 0,
                };
                createCounter(btn, name);
                updateCart();
              },
              { once: true }
            ); // فقط یک بار اجرا بشه
          } else {
            countText.textContent = newQty;
          }

          updateCart();
        });

        plus.addEventListener("click", () => {
          cartItems[name].quantity++;
          countText.textContent = cartItems[name].quantity;
          updateCart();
        });
      }

      updateCart();
    });
  });

  function updateCart() {
    cartList.innerHTML = "";
    let totalCount = 0;
    let totalPrice = 0;
    const totalEl = document.getElementById("cart-total");

    for (const name in cartItems) {
      const item = cartItems[name];

      const li = document.createElement("li");
      li.classList.add("cart-item");
      // unique classes for each item
      li.classList.add(`item-${name.toLowerCase().replace(/\s+/g, "-")}`);

      const span = document.createElement("span");
      span.classList.add("cart-item-text");
      span.textContent = `x${item.quantity} ${name} - $${(
        item.price * item.quantity
      ).toFixed(2)}`;

      const div = document.createElement("div");
      div.classList.add("remove-img");

      const removeImg = document.createElement("img");
      removeImg.src = "./assets/images/icon-remove-item.svg";
      removeImg.alt = "removeImg";
      removeImg.classList.add("remove-item");

      li.appendChild(removeImg);
      li.appendChild(div);
      li.appendChild(span);
      cartList.appendChild(li);

      totalCount += item.quantity;
      totalPrice += item.price * item.quantity;
    }

    cartCount.textContent = totalCount;
    totalEl.textContent = `Total: $${totalPrice.toFixed(2)}`;

    if (totalCount > 0) {
      emptyCart.classList.add("hidden");
      confirmOrder.classList.remove("hidden");
      totalEl.classList.remove("hidden");
    } else {
      emptyCart.classList.remove("hidden");
      confirmOrder.classList.add("hidden");
      totalEl.classList.add("hidden");
    }
  }

  confirmOrder.addEventListener("click", () => {
    // پر کردن لیست سفارش در مدال
    orderSummaryList.innerHTML = "";
    let totalPrice = 0;

    for (const name in cartItems) {
      const item = cartItems[name];
      const li = document.createElement("li");
      li.innerHTML = `
       <span>${item.quantity}x @ $${item.price.toFixed(2)}</span>
       <span>${name}</span>
       <img src="${item.imageSrc}" alt="${name}" class="item-image" />
        
       
      `;
      orderSummaryList.appendChild(li);
      totalPrice += item.price * item.quantity;
    }

    // اضافه کردن جمع کل
    // const totalLi = document.createElement("li");
    // totalLi.innerHTML = `
    //   <span><strong>Order Total</strong></span>
    //   <span><strong>$${totalPrice.toFixed(2)}</strong></span>
    // `;
    // orderSummaryList.appendChild(totalLi);

    document.getElementById(
      "order-total-amount"
    ).textContent = `$${totalPrice.toFixed(2)}`;

    // نمایش مدال
    orderConfirmed.classList.remove("hidden");
  });

  startNewOrder.addEventListener("click", () => {
    // پاک کردن سبد خرید و بستن مدال
    for (const name in cartItems) {
      delete cartItems[name];
    }
    orderConfirmed.classList.add("hidden");
    updateCart();
  });
});
