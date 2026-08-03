import formatCurrency from "../diloag_menu/dialog-menu.js";
import {appendProductCartCardItem, syncProductCartCardItem} from "./cart-dialog.js";

const wideScreenCartBtn = document.querySelector('.wide-screen-cart-btn');
const smallScreeCartBtn = document.querySelector('.small-screen-cart-btn');

const addToCartBtn = document.querySelectorAll('.add-to-cart-btn');

let badgesInitialized = false;
let cartUpdatedListenerAttached = false;
let totalCartCount = 0;

const cartState = {
    totalCartCount: 0,
    totalItems: 0,
    totalCents: 0
};

function createBadge(container, className) {
    const existing = container.querySelector(`.${className}`);
    if (existing) return existing;

    const badge = document.createElement('span');
    badge.setAttribute("aria-label", "cart count nofication");
    badge.className = `cart-count ${className}`;
    badge.textContent = "0";
    badge.style.display = "none";
    container.appendChild(badge);
    return badge;
}

function syncBadgeVisibility() {
    const wideBadge = document.querySelector('.wide-screen-cart-count');
    const smallBadge = document.querySelector('.small-screen-cart-count');

    if (!wideBadge || !smallBadge) return;

    if (totalCartCount > 0) {
        wideBadge.style.display = "block";
        smallBadge.style.display = "block";
    } else {
        wideBadge.style.display = "none";
        smallBadge.style.display = "none";
    }

    wideBadge.textContent = totalCartCount;
    smallBadge.textContent = totalCartCount;
}

const parseTotalItems = () => {
    const totalQuantity = document.querySelector('.products-count');
    if (!totalQuantity) return 0;
    const match = totalQuantity.innerText.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

const parseTotalCents = () => {
    const totalPriceElement = document.querySelector('.total-price');
    if (!totalPriceElement) return 0;
    const cleanTotalPrice = totalPriceElement.innerText.replace(/[^0-9.]/g, "");
    return Math.round(parseFloat(cleanTotalPrice || "0") * 100);
};

const getProductPriceInCents = (cartButton) => {
    const menuCard = cartButton.closest('.menu-card');
    const priceElement = menuCard?.querySelector('.menu-item-price');

    if (!priceElement) return 0;

    const match = priceElement.textContent.match(/\d+(?:\.\d{1,2})?/);
    if (!match) return 0;

    return Math.round(parseFloat(match[0]) * 100);
};

const getProductNameFromButton = (cartButton) => {
    const menuCard = cartButton.closest('.menu-card');
    const nameElement = menuCard?.querySelector('.menu-item-title');
    return nameElement?.textContent?.trim() || 'Coffee item';
};

const dispatchCartUpdate = () => {
    const hasMenuDialogTotals = Boolean(document.querySelector('.products-count') && document.querySelector('.total-price'));

    cartState.totalItems = hasMenuDialogTotals ? parseTotalItems() : cartState.totalItems;
    cartState.totalCents = hasMenuDialogTotals ? parseTotalCents() : cartState.totalCents;

    window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: {
            totalCartCount: totalCartCount,
            totalItems: cartState.totalItems,
            totalCents: cartState.totalCents
        }
    }));
};

export function attachMenuDialogListeners() {
    const increaseCartBtn = document.querySelectorAll('.menus-container-dialog .increase-cart-count-btn');
    const decreaseQuantity = document.querySelectorAll('.menus-container-dialog .decrease-cart-count-btn');

    increaseCartBtn.forEach(cartBtn => {
        // Remove any existing listener by cloning and replacing
        const newBtn = cartBtn.cloneNode(true);
        cartBtn.parentNode.replaceChild(newBtn, cartBtn);

        newBtn.addEventListener('click', (e) => {
            const cardAction = e.target.closest('.menu-dialog-cart-action');
            if (!cardAction) return;
            const cartCount = cardAction.querySelector('.cart-count');
            const addText = cardAction.querySelector('.add-text');
            const decreaseCountBtn = cardAction.querySelector('.decrease-cart-count-btn');

            const productPriceElement = cardAction.closest('.price').querySelector('h3');
            const price = productPriceElement.innerText;
            const clearPrice = price.replace(/[^0-9.]/g, "");
            const priceCents = Math.round(parseFloat(clearPrice) * 100);

            const totalQuantity = document.querySelector('.products-count');
            const totalPriceElement = document.querySelector('.total-price');
            const currentTotalText = totalPriceElement.innerText;
            const cleanTotalPrice = currentTotalText.replace(/[^0-9.]/g, "");
            let totalCents = Math.round(parseFloat(cleanTotalPrice) * 100);
            totalCents += priceCents;

            totalPriceElement.textContent = `${formatCurrency(totalCents)}`;

            let currentCount = parseInt(cartCount.innerText, 10);
            cartCount.innerText = currentCount + 1;

            let totalProductQuantity = parseInt(totalQuantity.innerText, 10);
            totalQuantity.innerText = `${totalProductQuantity + 1} items`;

            totalCartCount += 1;

            const productName = newBtn.dataset.productName || newBtn.className
                .split(' ')
                .find((className) => className.includes('-'))
                ?.split('-')
                .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ') || 'Coffee item';

            syncProductCartCardItem(productName, currentCount + 1, priceCents);

            if (totalCartCount > 0) {
                cartCount.style.display = "block";
                decreaseCountBtn.style.display = "block";
                addText.style.display = "none";
            }

            cartState.totalCartCount = totalCartCount;
            syncBadgeVisibility();
            dispatchCartUpdate();
        });
    });

    decreaseQuantity.forEach(reduceQuantity => {
        // Remove any existing listener by cloning and replacing
        const newBtn = reduceQuantity.cloneNode(true);
        reduceQuantity.parentNode.replaceChild(newBtn, reduceQuantity);

        newBtn.addEventListener('click', (e) => {
            const cardAction = e.target.closest('.menu-dialog-cart-action');
            if (!cardAction) return;
            const cartCount = cardAction.querySelector('.cart-count');
            const addText = cardAction.querySelector('.add-text');
            const decreaseCountBtn = cardAction.querySelector('.decrease-cart-count-btn');
            const productName = newBtn.dataset.productName || cardAction.dataset.productName || 'Coffee item';

            const productPriceElement = cardAction.closest('.price').querySelector('h3');
            const price = productPriceElement.innerText;
            const clearPrice = price.replace(/[^0-9.]/g, "");
            const priceCents = Math.round(parseFloat(clearPrice) * 100);

            const totalQuantity = document.querySelector('.products-count');
            const totalPriceElement = document.querySelector('.total-price');
            const currentTotalText = totalPriceElement.innerText;
            const cleanTotalPrice = currentTotalText.replace(/[^0-9.]/g, "");
            let totalCents = Math.round(parseFloat(cleanTotalPrice) * 100);
            totalCents -= priceCents;

            totalPriceElement.textContent = `${formatCurrency(totalCents)}`;

            let totalProductQuantity = parseInt(totalQuantity.innerText, 10);
            totalQuantity.innerText = `${totalProductQuantity - 1} items`;
            let currentCount = parseInt(cartCount.innerText, 10);

            if (currentCount > 0) {
                currentCount -= 1;
                cartCount.innerText = currentCount;
                totalCartCount -= 1;
            }

            syncProductCartCardItem(productName, currentCount, priceCents);

            if (currentCount === 0) {
                cartCount.style.display = "none";
                decreaseCountBtn.style.display = "none";
                addText.style.display = "block";
            }

            cartState.totalCartCount = totalCartCount;
            syncBadgeVisibility();
            dispatchCartUpdate();
        });
    });
}

export default function countCartNotificaton(initialTotalCartCount = 0) {
    totalCartCount = initialTotalCartCount;
    cartState.totalCartCount = initialTotalCartCount;

    // Create badges only once
    if (!badgesInitialized) {
        createBadge(wideScreenCartBtn, 'wide-screen-cart-count');
        createBadge(smallScreeCartBtn, 'small-screen-cart-count');
        badgesInitialized = true;
    }

    // Attach cartUpdated listener only once
    if (!cartUpdatedListenerAttached) {
        window.addEventListener('cartUpdated', (event) => {
            const detail = event.detail;
            if (!detail) return;

            totalCartCount = detail.totalCartCount;
            cartState.totalCartCount = totalCartCount;
            cartState.totalItems = detail.totalItems;
            cartState.totalCents = detail.totalCents;
            syncBadgeVisibility();
        });
        cartUpdatedListenerAttached = true;
    }

    // Attach main "Add to Cart" button listeners only once
    addToCartBtn.forEach(cartBtn => {
        // Clone and replace to avoid duplicate listeners
        const newBtn = cartBtn.cloneNode(true);
        cartBtn.parentNode.replaceChild(newBtn, cartBtn);

        newBtn.addEventListener('click', () => {
            const productName = getProductNameFromButton(newBtn);
            const productPriceCents = getProductPriceInCents(newBtn);

            totalCartCount += 1;

            appendProductCartCardItem(productName, productPriceCents, 1);

            // Update badges only — menu dialog elements are synced when dialog opens
            const wideBadge = document.querySelector('.wide-screen-cart-count');
            const smallBadge = document.querySelector('.small-screen-cart-count');
            if (wideBadge) wideBadge.style.display = "block";
            if (smallBadge) smallBadge.style.display = "block";
            if (wideBadge) wideBadge.textContent = totalCartCount;
            if (smallBadge) smallBadge.textContent = totalCartCount;

            cartState.totalCartCount = totalCartCount;
            dispatchCartUpdate();
        });
    });

    syncBadgeVisibility();
    dispatchCartUpdate();
}

