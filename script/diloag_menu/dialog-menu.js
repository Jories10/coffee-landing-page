import { menusData } from "./menus-data.js";
import { attachMenuDialogListeners } from "../cart/cart.js";
import { syncMenuDialogWithCart } from "../cart/cart-dialog.js";
import TransactionFormDialog from "../transaction_history/transaction-form-dialog.js";
import productNotificationMessage  from "../cart/product-notification-message.js";

const heroSection = document.getElementById('hero');
const headerAction = document.querySelector('.header-actions .primary-button');
const mobileResponsivePrimaryButton = document.querySelector('.mobile-responsive-nav-container .primary-button');
const orderNow = document.querySelector('.order-now');

export default function formatCurrency(price){
    const formatter = new Intl.NumberFormat("en-US", {style:"currency", currency:"USD"}).format(price / 100);
    return formatter;
}

function renderMenuDialog(divContainerDialog , menus, exitBtn,totalCartCount){
   
    let totalItems = 0;
    let totalAmount = 0;

    menus.replaceChildren();
    divContainerDialog.replaceChildren();

    const menuHeader = document.createElement('div');
    menuHeader.className = "menus-header";

    const title = document.createElement('h2');
    title.innerText = "Choose Your Order";

    

    menuHeader.append(title, exitBtn);

    const productListContainer = document.createElement('div');
    productListContainer.className = "product-cards-container";

    const cardFooter = document.createElement('div');
    cardFooter.className = 'product-card-footer';

    const orderSummary = document.createElement('div');
    orderSummary.className = "product-price product-count"

    const itemCountLabel = document.createElement('h3');
    itemCountLabel.innerText = `${totalItems} items`;
    itemCountLabel.className = "products-count total-quantity";

    const totalPriceLabel  = document.createElement('h3');
    totalPriceLabel.textContent = `$${totalAmount.toFixed(2)}`;
    totalPriceLabel.className = "total-price";

    orderSummary.append(itemCountLabel, totalPriceLabel );

    const confirmOrderButton = document.createElement('button');
    confirmOrderButton.id = "confirm-order";
    confirmOrderButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag w-4 h-4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        confirm order
    `;

    cardFooter.append(orderSummary, confirmOrderButton);

    menusData.forEach(data =>{
        const productCard  = document.createElement('article');
        productCard .className = "menu-cards"
        productCard .innerHTML = '';
        productCard .innerHTML = `
                            <div class="product-img">
                                <img src=${data.img} alt=${data.description}/>
                            </div>
                            <div class="product-details">
                                <div class="products-header">
                                    <h3>${data.productName}</h3>
                                     <p>${data.description}</p>
                                </div>
                                <div class="price increase-quantity">
                                    <h3 class="product-price">${formatCurrency(data.price)}</h3>
                                    <div class="menu-dialog-cart-action">
                                    </div>
                                </div>
                            </div>
        `;
        const menuAction = productCard.querySelector('.menu-dialog-cart-action');
        menuAction.dataset.productName = data.productName;

        const decreaseCartCountBtn = document.createElement('button');
            decreaseCartCountBtn.type = "button";
            decreaseCartCountBtn.className = "decrease-cart-count-btn";
            decreaseCartCountBtn.dataset.productName = data.productName;
            decreaseCartCountBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus w-3 h-3"><path d="M5 12h14"></path></svg>'

        const cartCount = document.createElement('p');
            cartCount.className = "cart-count";
            cartCount.dataset.productName = data.productName;
            cartCount.innerText = totalCartCount;

        
        const increaseCartCountBtn = document.createElement('button');
            increaseCartCountBtn.className = `${data.productName.split(" ").join('-')} increase-cart-count-btn`;
            increaseCartCountBtn.dataset.productName = data.productName;
            increaseCartCountBtn.innerHTML = ' <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus w-3 h-3"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg><span class="add-text">add</span>';

        menuAction.append(decreaseCartCountBtn,cartCount,increaseCartCountBtn);

        productListContainer.appendChild(productCard);
    });
    
    menus.append(menuHeader, productListContainer, cardFooter);
    divContainerDialog.appendChild(menus);
    heroSection.appendChild(divContainerDialog);

    divContainerDialog.style.display = 'flex';
}

export function menuDialog(){
    let totalCartCount = 0;

    const divContainerDialog = document.createElement('div');
    divContainerDialog.className = "menus-container-dialog";

    const menus = document.createElement('div');
    menus.className = "menus";
    
    const exitBtn = document.createElement('button');
    exitBtn.id = "exit-btn-dialog";
    exitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

   


    window.addEventListener('click', (e)=>{

      const dialog = document.querySelector('.menus-container-dialog');

      if(dialog && dialog.contains(e.target) && !menus.contains(e.target)){
        dialog.style.display = 'none';
        document.body.style.overflow = 'auto';
      }

      if(menus.contains(e.target)){
         document.body.style.overflow = 'hidden';
      }

    });

    const attachConfirmOrderHandler = () => {
        const cartCount = document.querySelector('.cart-count');
        const confirOrderBtn = document.querySelector('#confirm-order');
        if (confirOrderBtn) {
            confirmedOrder(confirOrderBtn, divContainerDialog, cartCount);
        }
    };

    mobileResponsivePrimaryButton.addEventListener('click',(e)=>{
            e.stopPropagation();

            if(!document.querySelector('.menus-container-dialog')){
                renderMenuDialog(divContainerDialog, menus,exitBtn,totalCartCount);
                attachMenuDialogListeners();
                syncMenuDialogWithCart();
                attachConfirmOrderHandler();

            }else{
                document.querySelector('.menus-container-dialog').style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
    });


    headerAction.addEventListener('click',(e)=>{
            e.stopPropagation();

            if(!document.querySelector('.menus-container-dialog')){
                renderMenuDialog(divContainerDialog, menus,exitBtn,totalCartCount);
                attachMenuDialogListeners();
                syncMenuDialogWithCart();
                attachConfirmOrderHandler();

            }else{
                document.querySelector('.menus-container-dialog').style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
    });



orderNow.addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation();

            const existingDialog = document.querySelector('.menus-container-dialog');

            if(!existingDialog){
                renderMenuDialog(divContainerDialog, menus,exitBtn,totalCartCount);
                attachMenuDialogListeners();
                syncMenuDialogWithCart();

                 const cartCountEl = document.querySelector('.cart-count');
                 const confirOrderBtn = document.querySelector('#confirm-order');
                 confirmedOrder(confirOrderBtn,divContainerDialog,cartCountEl);
                 
            }else{
                existingDialog.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }

    });


    exitBtn.addEventListener('click',(e)=>{
        e.stopPropagation();
        document.querySelector('.menus-container-dialog').style.display = 'none';
        document.body.style.overflow = 'auto';
   });
   

}


function populateProductSummary(formDialog) {
    const productSummaryDiv = formDialog.querySelector('.product-summary');
    const totalPriceSummary = formDialog.querySelector('.form-total-price-summary');
    
    const updateSummary = () => {
        productSummaryDiv.innerHTML = '';
        let grandTotal = 0;
        
        // Get all menu cards from the menu dialog
        const menuCards = document.querySelectorAll('.menu-cards');
        
        menuCards.forEach(card => {
            const cartCount = card.querySelector('.cart-count');
            if (!cartCount) return;
            
            const quantity = parseInt(cartCount.textContent, 10);
            
            // Only add products with quantity > 0
            if (quantity > 0) {
                const productName = card.querySelector('.products-header h3').textContent;
                const priceText = card.querySelector('.product-price').textContent;
                const priceCents = Math.round(parseFloat(priceText.replace(/[^0-9.]/g, '')) * 100);
                const productTotal = priceCents * quantity;
                
                grandTotal += productTotal;
                
                // Create product summary item wrapper
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
            }
        });
        
        // Update total price
        totalPriceSummary.textContent = formatCurrency(grandTotal);
    };
    
    // Initial population
    updateSummary();
    
    // Update when cart changes (from menu dialog or cart dialog)
    const cartUpdateHandler = () => {
        const formContainer = document.querySelector('.form-dialog-container');
        if (formContainer) {
            updateSummary();
        }
    };
    
    window.addEventListener('cartUpdated', cartUpdateHandler);
    
    // Clean up listener when form is closed
    const exitFormBtn = formDialog.querySelector('.exit-form-btn');
    if (exitFormBtn) {
        exitFormBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            window.removeEventListener('cartUpdated', cartUpdateHandler);

            if (formDialog.parentElement) {
                formDialog.remove();
            }
            document.body.style.overflow = "";
            window.dispatchEvent(new CustomEvent('formClosed'));
        });
    }
}

function confirmedOrder(confirmOrderBtn,divContainerDialog,cartCount){
    confirmOrderBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        e.stopImmediatePropagation();

        // Get the total items count from the menu dialog footer instead of a single product's count
        const totalQuantityEl = document.querySelector('.products-count');
        const totalItems = totalQuantityEl ? parseInt(totalQuantityEl.textContent, 10) : 0;

        if(totalItems === 0){
            const message = productNotificationMessage();
            heroSection.appendChild(message);
            setTimeout(()=>{
                message.remove();
            },3000);
            return;
        }else{
            divContainerDialog.style.display= "none";
        }
        
        const formDialog = TransactionFormDialog();

       if(!document.querySelector(".form-dialog-container")){
             // Set flag to prevent outside-click listener from removing form immediately
             isFormBeingOpened = true;
             
             heroSection.appendChild(formDialog);
             document.body.style.overflow = "hidden";
             
             // Populate product summary with current cart items
             populateProductSummary(formDialog);
             
             // Release flag after a short delay to allow event propagation to settle
             setTimeout(() => {
                 isFormBeingOpened = false;
             }, 100);
       }

    });
}

// Flag to prevent outside-click listeners from immediately removing the form
let isFormBeingOpened = false;

// Attach the outside-click-to-close-form listener only once
(function attachFormOutsideClickListener() {
    window.addEventListener('click',(e)=>{
        // Skip removal if we are in the middle of opening the form dialog
        if (isFormBeingOpened) return;

        const formDialogContainer = document.querySelector('.form-dialog-container');
        if(formDialogContainer){
            const form = formDialogContainer.querySelector('form');
            // Only remove if clicking outside the form
            if(!form.contains(e.target)){
                formDialogContainer.remove();
                document.body.style.overflow = "";
                window.dispatchEvent(new CustomEvent('formClosed'));
            }else{
                document.body.style.overflow = "hidden";
            }
        }
    });
})();

