// Utility functions for cart management
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(item) {
    const cart = getCart();
    // Check if item already exists (by name), if so, increase quantity
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({...item, qty: 1});
    }
    saveCart(cart);
    alert(`${item.name} added to cart!`);
}

// Attach event listeners to Add to Cart buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('button[data-name][data-price]').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'), 10);
            addToCart({name, price});
        });
    });

    // Render cart if on cart page
    const cartRoot = document.getElementById('cart-root');
    if (cartRoot) {
        renderCart(cartRoot);
    }

    // Attach event listeners to static buttons
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    const clearBtn = document.getElementById('cart-clear-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            const cart = getCart();
            if (cart.length === 0) return;
            // Calculate totals for modal
            let subtotal = 0;
            cart.forEach(item => { subtotal += item.price * item.qty; });
            const gst = Math.round(subtotal * 0.18);
            const total = subtotal + gst;
            const usdToInr = 83;
            const totalInr = total * usdToInr;
            showCheckoutModal(cart, total, subtotal, gst, totalInr);
        };
    }
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm('Are you sure you want to clear the cart?')) {
                saveCart([]);
                if (cartRoot) renderCart(cartRoot);
            }
        };
    }
});

function renderCart(container) {
    const cart = getCart();
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    const clearBtn = document.getElementById('cart-clear-btn');
    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty-message">Your cart is empty.</div>';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }
    let subtotal = 0;
    const ul = document.createElement('ul');
    ul.className = 'cart-list';
    cart.forEach(item => {
        subtotal += item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} <span>$${item.price} x ${item.qty}</span>
        `;
        ul.appendChild(li);
    });
    container.innerHTML = '';
    container.appendChild(ul);

    // GST calculation (18%)
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    // INR conversion (1 USD = 83 INR, for example)
    const usdToInr = 83;
    const totalInr = total * usdToInr;

    // Subtotal
    const subtotalDiv = document.createElement('div');
    subtotalDiv.className = 'cart-total';
    subtotalDiv.textContent = `Subtotal: $${subtotal}`;
    container.appendChild(subtotalDiv);

    // GST
    const gstDiv = document.createElement('div');
    gstDiv.className = 'cart-total';
    gstDiv.textContent = `GST (18%): $${gst}`;
    container.appendChild(gstDiv);

    // Total in USD
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.textContent = `Total: $${total}`;
    container.appendChild(totalDiv);

    // Total in INR
    const inrDiv = document.createElement('div');
    inrDiv.className = 'cart-total';
    inrDiv.textContent = `Total (INR): ₹${totalInr.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
    container.appendChild(inrDiv);

    // Show buttons if cart is not empty
    if (checkoutBtn) checkoutBtn.style.display = '';
    if (clearBtn) clearBtn.style.display = '';
}

// Modal for order and payment details
function showCheckoutModal(cart, total, subtotal, gst, totalInr) {
    // Remove existing modal if any
    const oldModal = document.getElementById('checkout-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = 1000;

    const box = document.createElement('div');
    box.style.background = '#23272a';
    box.style.color = '#f3f3f3';
    box.style.padding = '2em';
    box.style.borderRadius = '12px';
    box.style.minWidth = '320px';
    box.style.maxWidth = '90vw';
    box.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    box.style.position = 'relative';

    // Close button
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '12px';
    closeBtn.style.right = '18px';
    closeBtn.style.fontSize = '1.5em';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => modal.remove();
    box.appendChild(closeBtn);

    // Order summary
    const title = document.createElement('div');
    title.style.fontSize = '1.3em';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '1em';
    title.textContent = 'Order Details';
    box.appendChild(title);

    const orderList = document.createElement('ul');
    orderList.style.listStyle = 'none';
    orderList.style.padding = 0;
    orderList.style.marginBottom = '1em';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} × ${item.qty} — $${item.price * item.qty}`;
        orderList.appendChild(li);
    });
    box.appendChild(orderList);

    // Subtotal, GST, Total
    const subtotalDiv = document.createElement('div');
    subtotalDiv.style.fontWeight = 'bold';
    subtotalDiv.textContent = `Subtotal: $${subtotal}`;
    box.appendChild(subtotalDiv);

    const gstDiv = document.createElement('div');
    gstDiv.style.fontWeight = 'bold';
    gstDiv.textContent = `GST (18%): $${gst}`;
    box.appendChild(gstDiv);

    const totalDiv = document.createElement('div');
    totalDiv.style.fontWeight = 'bold';
    totalDiv.textContent = `Total: $${total}`;
    box.appendChild(totalDiv);

    const inrDiv = document.createElement('div');
    inrDiv.style.fontWeight = 'bold';
    inrDiv.style.marginBottom = '1em';
    inrDiv.textContent = `Total (INR): ₹${totalInr.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
    box.appendChild(inrDiv);

    // Payment method
    const payTitle = document.createElement('div');
    payTitle.style.margin = '1em 0 0.5em 0';
    payTitle.style.fontWeight = 'bold';
    payTitle.textContent = 'Payment Method';
    box.appendChild(payTitle);

    const payForm = document.createElement('form');
    payForm.onsubmit = e => {
        e.preventDefault();
        alert('Order placed! (Demo only)');
        saveCart([]);
        modal.remove();
        // Optionally, re-render cart if on cart page
        const cartRoot = document.getElementById('cart-root');
        if (cartRoot) renderCart(cartRoot);
    };

    // Payment options
    const methods = [
        {id: 'cod', label: 'Cash on Delivery'},
        {id: 'card', label: 'Credit/Debit Card'},
        {id: 'upi', label: 'UPI'}
    ];
    methods.forEach(m => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '0.5em';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'payment';
        radio.value = m.id;
        radio.required = true;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(' ' + m.label));
        payForm.appendChild(label);
    });

    // Card/UPI details (shown conditionally)
    const detailsDiv = document.createElement('div');
    detailsDiv.style.margin = '0.5em 0';
    payForm.appendChild(detailsDiv);

    payForm.addEventListener('change', e => {
        const val = payForm.payment.value;
        detailsDiv.innerHTML = '';
        if (val === 'card') {
            detailsDiv.innerHTML = `
                <input type="text" placeholder="Card Number" required style="margin-bottom:0.5em;display:block;width:100%;">
                <input type="text" placeholder="Cardholder Name" required style="margin-bottom:0.5em;display:block;width:100%;">
                <input type="text" placeholder="Expiry MM/YY" required style="margin-bottom:0.5em;display:block;width:100%;">
                <input type="text" placeholder="CVV" required style="margin-bottom:0.5em;display:block;width:100%;">
            `;
        } else if (val === 'upi') {
            detailsDiv.innerHTML = `
                <input type="text" placeholder="UPI ID" required style="margin-bottom:0.5em;display:block;width:100%;">
            `;
        }
    });

    // Place order button
    const placeBtn = document.createElement('button');
    placeBtn.type = 'submit';
    placeBtn.textContent = 'Place Order';
    placeBtn.style.marginTop = '1em';
    placeBtn.style.width = '100%';
    placeBtn.style.background = '#ffb347';
    placeBtn.style.color = '#23272a';
    placeBtn.style.fontWeight = 'bold';
    placeBtn.style.fontSize = '1.1em';
    placeBtn.style.border = 'none';
    placeBtn.style.borderRadius = '6px';
    placeBtn.style.padding = '0.7em';
    placeBtn.style.cursor = 'pointer';
    payForm.appendChild(placeBtn);

    box.appendChild(payForm);
    modal.appendChild(box);
    document.body.appendChild(modal);
}
