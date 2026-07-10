const storageKey = 'ajedrezTotalCart';
const cartItemsElement = document.getElementById('cartItems');
const cartCountElement = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');
const clearCartButton = document.getElementById('clearCart');
const finishCartButton = document.getElementById('finishCart');
const cartMessageElement = document.getElementById('cartMessage');

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    renderCart();
}

function formatPrice(value) {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
    }).format(value);
}

function renderCart() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
    if (cartTotalElement) {
        cartTotalElement.textContent = formatPrice(totalPrice);
    }

    if (!cartItemsElement) {
        return;
    }

    if (!cart.length) {
        cartItemsElement.innerHTML = '<div class="cart-empty">Tu carrito está vacío. Agrega productos para comenzar.</div>';
        return;
    }

    cartItemsElement.innerHTML = cart.map(item => `
        <div class="cart-item d-flex justify-content-between align-items-center">
            <div>
                <div class="fw-bold">${item.name}</div>
                <small class="text-muted">${item.quantity} x ${formatPrice(item.price)}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <strong>${formatPrice(item.price * item.quantity)}</strong>
                <button type="button" class="btn btn-sm btn-outline-danger remove-item" data-name="${item.name}">×</button>
            </div>
        </div>
    `).join('');
}

function addToCart(name, price) {
    const cart = getCart();
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price: Number(price),
            quantity: 1
        });
    }

    if (cartMessageElement) {
        cartMessageElement.innerHTML = `<div class="alert alert-success py-2 px-3 mb-0">Se agregó ${name} al carrito.</div>`;
    }

    saveCart(cart);
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        addToCart(button.dataset.name, button.dataset.price);
    });
});

if (cartItemsElement) {
    cartItemsElement.addEventListener('click', event => {
        if (event.target.classList.contains('remove-item')) {
            const name = event.target.dataset.name;
            const cart = getCart().filter(item => item.name !== name);
            saveCart(cart);
        }
    });
}

if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem(storageKey);
        if (cartMessageElement) {
            cartMessageElement.innerHTML = '<div class="alert alert-secondary py-2 px-3 mb-0">Carrito vaciado.</div>';
        }
        renderCart();
    });
}

if (finishCartButton) {
    finishCartButton.addEventListener('click', () => {
        const cart = getCart();
        if (!cart.length) {
            if (cartMessageElement) {
                cartMessageElement.innerHTML = '<div class="alert alert-warning py-2 px-3 mb-0">Tu carrito está vacío.</div>';
            }
            return;
        }

        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (cartMessageElement) {
            cartMessageElement.innerHTML = `<div class="alert alert-success py-2 px-3 mb-0">¡Gracias por tu compra! Total: ${formatPrice(totalPrice)}.</div>`;
        }
        localStorage.removeItem(storageKey);
        renderCart();
    });
}

renderCart();
