import formatCurrency from "../diloag_menu/dialog-menu.js";
import TransactionFormDialog from "../transaction_history/transaction-form-dialog.js";
import productNotificationMessage from "./product-notification-message.js";
import { revealElement } from "../animation/reveal-on-scroll.js";
import { loadCartFromStorage, saveCartToStorage } from "./cart-local-storage.js";

const heroSection = document.querySelector('.hero-section');
const wideScreenCartBtn = document.querySelector('.wide-screen-cart-btn');
const smallScreenCartBtn = document.querySelector('.small-screen-cart-btn');

const cartDialogState = {
    totalCartCount: 0,
    totalItems: 0,
    totalCents: 0
};

const cartDialogContainer = document.createElement("div");
cartDialogContainer.className = "cart-dialog-container";

const cartDialog = document.createElement("div");
cartDialog.className = "cart-dialog reveal";

const cartHeader = document.createElement("div");
cartHeader.className = "cart-header";

const cartHeaderDetails = document.createElement('div');
cartHeaderDetails.className = "cart-header-details";

const cartIconContainer = document.createElement("div");
cartIconContainer.className = "cart-icon-container";
cartIconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart w-5 h-5 text-accent"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>';

const cartTitle = document.createElement('h2');
cartTitle.className = "cart-title";
cartTitle.textContent = "Your Cart";

const totalCartCount = document.createElement('span');
totalCartCount.className = "total-cart-count";
totalCartCount.textContent = 0;

cartHeaderDetails.append(cartIconContainer,cartTitle,totalCartCount);

const exitCartBtn = document.createElement('button');
exitCartBtn.className = "exit-cart-btn";
exitCartBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

cartHeader.append(cartHeaderDetails,exitCartBtn);

const cartItemsContainer = document.createElement('div');
cartItemsContainer.className = "cart-item-container";

const cartFooter = document.createElement("div");
cartFooter.className ="cart-footer";

const subTotalContainer = document.createElement('div');
subTotalContainer.className = "sub-total-container";

const subTotalText = document.createElement('span');
subTotalText.textContent = 'Subtotal (0 items)';

const computedTotalAmount = document.createElement('span');
computedTotalAmount.textContent = formatCurrency(0);

subTotalContainer.append(subTotalText,computedTotalAmount);

const totalAmountContainer = document.createElement('div');
totalAmountContainer.className = "total-amount-container";

const totalText = document.createElement('span');
totalText.className = "total-text";
totalText.textContent = "Total";

const totalAmount = document.createElement('span');
totalAmount.className = "total-amount";
totalAmount.textContent = formatCurrency(0);

totalAmountContainer.append(totalText,totalAmount);

const confirmOrderBtn = document.createElement('button');
confirmOrderBtn.className = "confirm-order-btn";
confirmOrderBtn.textContent = "Confirm Order";

cartFooter.append(subTotalContainer, totalAmountContainer, confirmOrderBtn);

cartDialog.append(cartHeader,cartItemsContainer,cartFooter);

cartDialogContainer.appendChild(cartDialog);

function renderCartDialog(cartDialogContainer){
    if(!heroSection.contains(cartDialogContainer)){
        heroSection.appendChild(cartDialogContainer);
    }

    cartDialog.classList.remove('is-visible');
    cartDialog.offsetHeight;
    revealElement(cartDialog);
}

function ensureCartDialogPrepared(){
    updateCartDialogDisplay();
    return cartItemsContainer;
}

function updateMenuDialogFooter(totalItems, totalCents){
    const menuItemCount = document.querySelector('.products-count');
    const menuTotalPrice = document.querySelector('.total-price');

    if (menuItemCount) {
        menuItemCount.textContent = `${totalItems} items`;
    }

    if (menuTotalPrice) {
        menuTotalPrice.textContent = formatCurrency(totalCents);
    }
}

function updateCartSummaryFromItems(){
    const itemRows = cartItemsContainer.querySelectorAll('.product-cart-card-item');
    let totalItems = 0;
    let totalCents = 0;

    itemRows.forEach((row) => {
        const quantity = parseInt(row.querySelector('.cart-item-quantity')?.textContent || '0', 10);
        const unitPriceCents = parseInt(row.dataset.unitPriceCents || '0', 10);
        totalItems += quantity;
        totalCents += quantity * unitPriceCents;
    });

    cartDialogState.totalItems = totalItems;
    cartDialogState.totalCents = totalCents;
    cartDialogState.totalCartCount = totalItems;
    updateCartDialogDisplay();
    updateMenuDialogFooter(totalItems, totalCents);
    removeCartFooter();

    // Save cart items to localStorage for persistence across page refreshes
    const cartItems = Array.from(cartItemsContainer.querySelectorAll('.product-cart-card-item')).map((row) => ({
        productName: row.dataset.productName,
        quantity: parseInt(row.querySelector('.cart-item-quantity')?.textContent || '0', 10),
        unitPriceCents: parseInt(row.dataset.unitPriceCents || '0', 10),
    }));
    saveCartToStorage(cartItems);

    window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: {
            totalCartCount: cartDialogState.totalCartCount,
            totalItems: cartDialogState.totalItems,
            totalCents: cartDialogState.totalCents
        }
    }));
}

function updateMenuDialogQuantity(productName, quantity){
    const productSelector = `.menu-dialog-cart-action[data-product-name="${String(productName).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`;
    const action = document.querySelector(productSelector);

    if (!action) return;

    const cartCount = action.querySelector('.cart-count');
    const decreaseCountBtn = action.querySelector('.decrease-cart-count-btn');
    const addText = action.querySelector('.add-text');

    if (!cartCount || !decreaseCountBtn || !addText) return;

    cartCount.textContent = String(quantity);

    if (quantity > 0) {
        cartCount.style.display = "block";
        decreaseCountBtn.style.display = "block";
        addText.style.display = "none";
    } else {
        cartCount.style.display = "none";
        decreaseCountBtn.style.display = "none";
        addText.style.display = "block";
    }
}

export function syncProductCartCardItem(productName, quantity, productPrice){
    ensureCartDialogPrepared();

    const normalizedQuantity = Math.max(parseInt(quantity, 10) || 0, 0);

    if (normalizedQuantity <= 0) {
        const existingItem = Array.from(cartItemsContainer.querySelectorAll('.product-cart-card-item'))
            .find((item) => item.dataset.productName === productName);

        if (existingItem) {
            existingItem.remove();
        }

        updateMenuDialogQuantity(productName, 0);
        updateCartSummaryFromItems();
        return null;
    }

    const existingItem = Array.from(cartItemsContainer.querySelectorAll('.product-cart-card-item'))
        .find((item) => item.dataset.productName === productName);

    if (existingItem) {
        const quantityElement = existingItem.querySelector('.cart-item-quantity');
        const totalElement = existingItem.querySelector('.total-item-price');
        const unitPriceCents = parseInt(existingItem.dataset.unitPriceCents || String(productPrice || 0), 10);

        quantityElement.textContent = normalizedQuantity;
        totalElement.textContent = formatCurrency(normalizedQuantity * unitPriceCents);
        updateMenuDialogQuantity(productName, normalizedQuantity);
        updateCartSummaryFromItems();
        return existingItem;
    }

    const cartItemCard = document.createElement('div');
    cartItemCard.className = "product-cart-card-item reveal";
    cartItemCard.dataset.productName = productName;
    cartItemCard.dataset.unitPriceCents = String(productPrice);

    const cartItemDetails = document.createElement('div');
    cartItemDetails.className = "cart-item-details";

    const cartItemName = document.createElement('h3');
    cartItemName.className = "cart-item-name";
    cartItemName.textContent = productName;

    const cartItemPrice = document.createElement('span');
    cartItemPrice.className = "cart-item-price";
    cartItemPrice.textContent = formatCurrency(productPrice);

    cartItemDetails.append(cartItemName,cartItemPrice);

    const cartItemQuantityWrap = document.createElement('div');
    cartItemQuantityWrap.className = "cart-item-quantity-wrap";

    const decreaseCartCountBtn = document.createElement('button');
    decreaseCartCountBtn.type = "button";
    decreaseCartCountBtn.className = "decrease-cart-count-btn";
    decreaseCartCountBtn.dataset.productName = productName;
    decreaseCartCountBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus w-3 h-3"><path d="M5 12h14"></path></svg>';

    const cartItemQuantity = document.createElement('span');
    cartItemQuantity.className = "cart-item-quantity";
    cartItemQuantity.textContent = normalizedQuantity;
    
    const increaseCartCountBtn = document.createElement('button');
    increaseCartCountBtn.type = "button";
    increaseCartCountBtn.className = "increase-cart-count-btn";
    increaseCartCountBtn.dataset.productName = productName;
    increaseCartCountBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-3 h-3"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>';

    cartItemQuantityWrap.append(decreaseCartCountBtn,cartItemQuantity,increaseCartCountBtn);

    const totalItemPriceWrap = document.createElement('div');
    totalItemPriceWrap.className = "total-item-price-wrap";

    const totalItemPrice = document.createElement('span');
    totalItemPrice.className = "total-item-price";
    totalItemPrice.textContent = formatCurrency(productPrice * normalizedQuantity);

    totalItemPriceWrap.appendChild(totalItemPrice);
    
    const deleteCartItemBtn = document.createElement('button');
    deleteCartItemBtn.className = "delete-cart-item-btn";
    deleteCartItemBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1-2 2v2"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>';

      totalItemPriceWrap.append(totalItemPrice, deleteCartItemBtn);

    deleteCartItemBtn.addEventListener('click', () => {
        const row = deleteCartItemBtn.closest('.product-cart-card-item');
        const deletedProductName = row?.dataset.productName || productName;

        row?.remove();
        updateMenuDialogQuantity(deletedProductName, 0);
        updateCartSummaryFromItems();
        if(!cartItemsContainer.querySelector('.product-cart-card-item')){
            updateCartDialogDisplay();
        }
    });

    decreaseCartCountBtn.addEventListener('click', () => {
        const row = decreaseCartCountBtn.closest('.product-cart-card-item');
        const quantityElement = row?.querySelector('.cart-item-quantity');
        const totalElement = row?.querySelector('.total-item-price');
        const currentQuantity = parseInt(quantityElement?.textContent || '0', 10);

        if(currentQuantity <= 1){
            row?.remove();
            updateMenuDialogQuantity(decreaseCartCountBtn.dataset.productName || productName, 0);
        }else{
            const nextQuantity = currentQuantity - 1;
            quantityElement.textContent = nextQuantity;
            const unitPriceCents = parseInt(row.dataset.unitPriceCents || '0', 10);
            totalElement.textContent = formatCurrency(nextQuantity * unitPriceCents);
            updateMenuDialogQuantity(decreaseCartCountBtn.dataset.productName || productName, nextQuantity);
        }

        updateCartSummaryFromItems();
        if(!cartItemsContainer.querySelector('.product-cart-card-item')){
            updateCartDialogDisplay();
        }
    });

    increaseCartCountBtn.addEventListener('click', () => {
        const row = increaseCartCountBtn.closest('.product-cart-card-item');
        const quantityElement = row?.querySelector('.cart-item-quantity');
        const totalElement = row?.querySelector('.total-item-price');
        const currentQuantity = parseInt(quantityElement?.textContent || '0', 10);
        const nextQuantity = currentQuantity + 1;
        const unitPriceCents = parseInt(row.dataset.unitPriceCents || '0', 10);

        quantityElement.textContent = nextQuantity;
        totalElement.textContent = formatCurrency(nextQuantity * unitPriceCents);
        updateMenuDialogQuantity(increaseCartCountBtn.dataset.productName || productName, nextQuantity);
        updateCartSummaryFromItems();
    });

    cartItemCard.append(cartItemDetails,cartItemQuantityWrap,totalItemPriceWrap);
    cartItemsContainer.appendChild(cartItemCard);
    cartItemCard.classList.remove('is-visible');
    cartItemCard.offsetHeight;
    revealElement(cartItemCard, { delay: 40 });
    updateMenuDialogQuantity(productName, normalizedQuantity);
    updateCartSummaryFromItems();

    return cartItemCard;
}

export function appendProductCartCardItem(productName, productPrice, productQuantity = 1){
    ensureCartDialogPrepared();

    const existingItem = Array.from(cartItemsContainer.querySelectorAll('.product-cart-card-item'))
        .find((item) => item.dataset.productName === productName);
    const currentQuantity = existingItem ? parseInt(existingItem.querySelector('.cart-item-quantity')?.textContent || '0', 10) : 0;
    const nextQuantity = currentQuantity + parseInt(productQuantity, 10);

    return syncProductCartCardItem(productName, nextQuantity, productPrice);
}

function updateCartDialogDisplay(){
    totalCartCount.textContent = cartDialogState.totalCartCount;
    subTotalText.textContent = `Subtotal (${cartDialogState.totalItems} items)`;
    computedTotalAmount.textContent = formatCurrency(cartDialogState.totalCents);
    totalAmount.textContent = formatCurrency(cartDialogState.totalCents);
}

window.addEventListener('cartUpdated', (event)=>{
    const detail = event.detail;
    if (!detail) return;

    cartDialogState.totalCartCount = detail.totalCartCount;
    cartDialogState.totalItems = detail.totalItems;
    cartDialogState.totalCents = detail.totalCents;
    updateCartDialogDisplay();
    updateMenuDialogFooter(detail.totalItems, detail.totalCents);
});

function renderCartStateMessage(){
     const cartStateMessageContainer = document.createElement('div');
     cartStateMessageContainer.className = "cart-state-message-container";

     const cartStateIconWrapper = document.createElement('div');
     cartStateIconWrapper.className = "cart-state-icon-wrapper";
     cartStateIconWrapper.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart w-12 h-12 text-muted-foreground/30 mx-auto mb-3"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>';

     const cartStateMessage = document.createElement('p');
     cartStateMessage.className = "cart-state-message";
     cartStateMessage.textContent = "Your cart is empty";

     const addCartToMenuMessage = document.createElement('p');
     addCartToMenuMessage.className = "add-cart-to-menu-message";
     addCartToMenuMessage.textContent = "Add items to your cart from the menu";

     cartStateMessageContainer.append(cartStateIconWrapper,cartStateMessage,addCartToMenuMessage);
     
     if(!cartItemsContainer.contains(document.querySelector('.cart-state-message-container'))){
          cartItemsContainer.appendChild(cartStateMessageContainer);
     }
}

function removeCartStateMessage(){
    if(cartItemsContainer.contains(document.querySelector('.cart-state-message-container'))){
         const cartStateMessageContainer = document.querySelector('.cart-state-message-container');
         cartItemsContainer.removeChild(cartStateMessageContainer);
    }
}

function removeCartFooter(){
     if(parseInt(totalCartCount.textContent,10) === 0){
          cartFooter.style.display = "none";
          cartItemsContainer.style.height = "100%";
          if(document.querySelector('.total-cart-count')){
            document.querySelector('.total-cart-count').style.display = "none";
          }
          renderCartStateMessage();
     }else{
          cartFooter.style.display = "block";
          cartItemsContainer.style.height = "487px";
          if(document.querySelector('.total-cart-count')){
            document.querySelector('.total-cart-count').style.display = "inline-block"
          }
          removeCartStateMessage();
     }
}
function populateCartFormSummary(formDialog) {
     const productSummaryDiv = formDialog.querySelector('.product-summary');
     const totalPriceSummary = formDialog.querySelector('.form-total-price-summary');

     productSummaryDiv.innerHTML = '';
     let grandTotal = 0;

     const cartItemRows = cartItemsContainer.querySelectorAll('.product-cart-card-item');

     cartItemRows.forEach(row => {
          const productName = row.dataset.productName || 'Item';
          const quantity = parseInt(row.querySelector('.cart-item-quantity')?.textContent || '0', 10);
          const unitPriceCents = parseInt(row.dataset.unitPriceCents || '0', 10);
          const productTotal = unitPriceCents * quantity;
          grandTotal += productTotal;

          const productItem = document.createElement('div');
          productItem.className = 'product-summary-item';
          productItem.innerHTML = `
               <div class="product-info">
                    <span class="product-name">${productName}</span>
                    <span class="product-quantity">Qty: ${quantity}</span>
               </div>
               <span class="product-item-total">${formatCurrency(productTotal)}</span>
          `;

          productSummaryDiv.appendChild(productItem);
     });

     totalPriceSummary.textContent = formatCurrency(grandTotal);
}

export function getCartState() {
    return {
        totalCartCount: cartDialogState.totalCartCount,
        totalItems: cartDialogState.totalItems,
        totalCents: cartDialogState.totalCents
    };
}

export function getCartItems() {
    return Array.from(cartItemsContainer.querySelectorAll('.product-cart-card-item')).map((row) => ({
        productName: row.dataset.productName,
        quantity: parseInt(row.querySelector('.cart-item-quantity')?.textContent || '0', 10),
        unitPriceCents: parseInt(row.dataset.unitPriceCents || '0', 10),
    }));
}

export function syncMenuDialogWithCart() {
    const cartItems = getCartItems();

    // Sync each menu card quantity with cart data
    document.querySelectorAll('.menu-cards').forEach((card) => {
        const productNameEl = card.querySelector('.products-header h3');
        if (!productNameEl) return;
        const productName = productNameEl.textContent;

        const cartItem = cartItems.find((item) => item.productName === productName);
        const quantity = cartItem ? cartItem.quantity : 0;

        const cartCount = card.querySelector('.cart-count');
        const decreaseCountBtn = card.querySelector('.decrease-cart-count-btn');
        const addText = card.querySelector('.add-text');

        if (cartCount) cartCount.textContent = String(quantity);

        if (quantity > 0) {
            if (cartCount) cartCount.style.display = "block";
            if (decreaseCountBtn) decreaseCountBtn.style.display = "block";
            if (addText) addText.style.display = "none";
        } else {
            if (cartCount) cartCount.style.display = "none";
            if (decreaseCountBtn) decreaseCountBtn.style.display = "none";
            if (addText) addText.style.display = "block";
        }
    });

    // Sync the footer with cart state
    updateMenuDialogFooter(cartDialogState.totalItems, cartDialogState.totalCents);
}

function restoreCartFromStorage() {
    const savedItems = loadCartFromStorage();
    if (!savedItems || savedItems.length === 0) return;

    savedItems.forEach((item) => {
        const { productName, quantity, unitPriceCents } = item;
        if (quantity <= 0) return;

        const cartItemCard = document.createElement('div');
        cartItemCard.className = "product-cart-card-item reveal";
        cartItemCard.dataset.productName = productName;
        cartItemCard.dataset.unitPriceCents = String(unitPriceCents);

        const cartItemDetails = document.createElement('div');
        cartItemDetails.className = "cart-item-details";

        const cartItemName = document.createElement('h3');
        cartItemName.className = "cart-item-name";
        cartItemName.textContent = productName;

        const cartItemPrice = document.createElement('span');
        cartItemPrice.className = "cart-item-price";
        cartItemPrice.textContent = formatCurrency(unitPriceCents);

        cartItemDetails.append(cartItemName, cartItemPrice);

        const cartItemQuantityWrap = document.createElement('div');
        cartItemQuantityWrap.className = "cart-item-quantity-wrap";

        const decreaseCartCountBtn = document.createElement('button');
        decreaseCartCountBtn.type = "button";
        decreaseCartCountBtn.className = "decrease-cart-count-btn";
        decreaseCartCountBtn.dataset.productName = productName;
        decreaseCartCountBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus w-3 h-3"><path d="M5 12h14"></path></svg>';

        const cartItemQuantity = document.createElement('span');
        cartItemQuantity.className = "cart-item-quantity";
        cartItemQuantity.textContent = quantity;

        const increaseCartCountBtn = document.createElement('button');
        increaseCartCountBtn.type = "button";
        increaseCartCountBtn.className = "increase-cart-count-btn";
        increaseCartCountBtn.dataset.productName = productName;
        increaseCartCountBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-3 h-3"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>';

        cartItemQuantityWrap.append(decreaseCartCountBtn, cartItemQuantity, increaseCartCountBtn);

        const totalItemPriceWrap = document.createElement('div');
        totalItemPriceWrap.className = "total-item-price-wrap";

        const totalItemPrice = document.createElement('span');
        totalItemPrice.className = "total-item-price";
        totalItemPrice.textContent = formatCurrency(unitPriceCents * quantity);

        totalItemPriceWrap.appendChild(totalItemPrice);

        const deleteCartItemBtn = document.createElement('button');
        deleteCartItemBtn.className = "delete-cart-item-btn";
        deleteCartItemBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1-2 2v2"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>';

        totalItemPriceWrap.append(totalItemPrice, deleteCartItemBtn);

        // Attach event listeners
        deleteCartItemBtn.addEventListener('click', () => {
            const row = deleteCartItemBtn.closest('.product-cart-card-item');
            const deletedProductName = row?.dataset.productName || productName;

            row?.remove();
            updateMenuDialogQuantity(deletedProductName, 0);
            updateCartSummaryFromItems();
            if (!cartItemsContainer.querySelector('.product-cart-card-item')) {
                updateCartDialogDisplay();
            }
        });

        decreaseCartCountBtn.addEventListener('click', () => {
            const row = decreaseCartCountBtn.closest('.product-cart-card-item');
            const quantityEl = row?.querySelector('.cart-item-quantity');
            const totalEl = row?.querySelector('.total-item-price');
            const currentQty = parseInt(quantityEl?.textContent || '0', 10);

            if (currentQty <= 1) {
                row?.remove();
                updateMenuDialogQuantity(decreaseCartCountBtn.dataset.productName || productName, 0);
            } else {
                const nextQty = currentQty - 1;
                quantityEl.textContent = nextQty;
                const unitPrice = parseInt(row.dataset.unitPriceCents || '0', 10);
                totalEl.textContent = formatCurrency(nextQty * unitPrice);
                updateMenuDialogQuantity(decreaseCartCountBtn.dataset.productName || productName, nextQty);
            }

            updateCartSummaryFromItems();
            if (!cartItemsContainer.querySelector('.product-cart-card-item')) {
                updateCartDialogDisplay();
            }
        });

        increaseCartCountBtn.addEventListener('click', () => {
            const row = increaseCartCountBtn.closest('.product-cart-card-item');
            const quantityEl = row?.querySelector('.cart-item-quantity');
            const totalEl = row?.querySelector('.total-item-price');
            const currentQty = parseInt(quantityEl?.textContent || '0', 10);
            const nextQty = currentQty + 1;
            const unitPrice = parseInt(row.dataset.unitPriceCents || '0', 10);

            quantityEl.textContent = nextQty;
            totalEl.textContent = formatCurrency(nextQty * unitPrice);
            updateMenuDialogQuantity(increaseCartCountBtn.dataset.productName || productName, nextQty);
            updateCartSummaryFromItems();
        });

        cartItemCard.append(cartItemDetails, cartItemQuantityWrap, totalItemPriceWrap);
        cartItemsContainer.appendChild(cartItemCard);
        cartItemCard.classList.remove('is-visible');
        cartItemCard.offsetHeight;
        revealElement(cartItemCard, { delay: 40 });
    });

    // Update the summary after all items are restored
    updateCartSummaryFromItems();
}

export function CartDialog(){

      // Restore cart items from localStorage on page load
      restoreCartFromStorage();

      exitCartBtn.addEventListener('click',(e)=>{
          e.stopPropagation();
          if(heroSection.contains(cartDialogContainer)){
               heroSection.removeChild(cartDialogContainer);
          }
      });

      window.addEventListener('click',(e)=>{
          if(!cartDialogContainer.contains(e.target)){
               return;
          }else if(cartDialog.contains(e.target)){
               return;
          }
          if(heroSection.contains(cartDialogContainer)){
               heroSection.removeChild(cartDialogContainer);
          }
      });

       wideScreenCartBtn.addEventListener('click',(e)=>{
            e.stopPropagation();
            renderCartDialog(cartDialogContainer);
            updateCartDialogDisplay();
            removeCartFooter();
       });

       smallScreenCartBtn.addEventListener('click',(e)=>{
            e.stopPropagation();
            renderCartDialog(cartDialogContainer);
            updateCartDialogDisplay();
            removeCartFooter();
       });

       confirmOrderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const itemRows = cartItemsContainer.querySelectorAll('.product-cart-card-item');
            const totalItems = Array.from(itemRows).reduce((sum, row) => {
                 return sum + parseInt(row.querySelector('.cart-item-quantity')?.textContent || '0', 10);
            }, 0);

            if (totalItems === 0) {
                 const message = productNotificationMessage();
                 heroSection.appendChild(message);
                 setTimeout(() => {
                      message.remove();
                 }, 3000);
                 return;
            }

            if (heroSection.contains(cartDialogContainer)) {
                 heroSection.removeChild(cartDialogContainer);
            }

            const formDialog = TransactionFormDialog();

            if (!document.querySelector('.form-dialog-container')) {
                 heroSection.appendChild(formDialog);
                 document.body.style.overflow = 'hidden';

                 // Populate form summary from cart items
                 populateCartFormSummary(formDialog);
            }
       });
}
