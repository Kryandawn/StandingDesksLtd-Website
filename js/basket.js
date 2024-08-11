// Basket functionality
let basket = [];
let basketItems = document.getElementById('basket-items');
let basketTotal = document.getElementById('basket-total');
let basketIcon = document.getElementById('basket-icon');
let floatingBasket = document.getElementById('floating-basket');
let basketCount = document.getElementById('basket-count');
let checkoutButton = document.getElementById('checkout-btn');
let modal = document.getElementById('modal');

function addItemToBasket(productId, price) {
    console.log(`Adding item to basket: Product ID ${productId}, Price $${price}`);
    let existingItem = basket.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        basket.push({ id: productId, price: price, quantity: 1 });
    }
    updateBasketDisplay();
    updateBasketTotal();
    showFloatingBasket();
}

function removeItemFromBasket(productId) {
    console.log(`Removing item with ID ${productId} from basket`);
    basket = basket.filter(item => item.id !== productId);
    updateBasketDisplay();
    updateBasketTotal();
    if (basket.length === 0) {
        hideFloatingBasket();
    }
}

function updateItemQuantity(productId, newQuantity) {
    const item = basket.find(item => item.id === productId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeItemFromBasket(productId);
        }
        updateBasketDisplay();
        updateBasketTotal();
    }
}

function updateBasketTotal() {
    const total = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (basketTotal) {
        basketTotal.textContent = `$${total.toFixed(2)}`;
    }
    if (basketIcon) {
        const itemCount = basket.reduce((sum, item) => sum + item.quantity, 0);
        basketCount.textContent = itemCount;
        basketIcon.classList.toggle('has-items', itemCount > 0);
    }
}

function updateBasketDisplay() {
    if (basketItems) {
        basketItems.innerHTML = '';
        if (basket.length === 0) {
            basketItems.innerHTML = '<p>Your basket is empty</p>';
        } else {
            basket.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('basket-item');
                itemElement.innerHTML = `
                    <h4>${item.name || 'Product'}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                `;
                basketItems.appendChild(itemElement);
            });
        }
    }
    updateBasketTotal();
}

function showFloatingBasket() {
    if (floatingBasket) {
        floatingBasket.classList.remove('hidden');
        floatingBasket.classList.add('show');
    }
}

function hideFloatingBasket() {
    if (floatingBasket) {
        floatingBasket.classList.remove('show');
        floatingBasket.classList.add('hidden');
    }
}

function showModal() {
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Modal element not found');
    }
}

function hideModal() {
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error('Modal element not found');
    }
}

// Event listeners
if (basketItems) {
    basketItems.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            removeItemFromBasket(productId);
        }
    });
}

if (basketIcon) {
    basketIcon.addEventListener('click', () => {
        if (floatingBasket) {
            floatingBasket.classList.toggle('show');
            floatingBasket.classList.remove('hidden');
        }
    });
}

if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        console.log('Checkout process initiated');
        showModal();
        if (floatingBasket) {
            floatingBasket.classList.remove('show');
            floatingBasket.classList.add('hidden');
        }
    });
}

// Hide modal by default when the page loads
document.addEventListener('DOMContentLoaded', () => {
    hideModal();
});

// Export functions for use in other modules
export { addItemToBasket as addToBasket, removeItemFromBasket, updateItemQuantity, updateBasketDisplay };
