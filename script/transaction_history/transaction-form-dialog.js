import formatCurrency from "../diloag_menu/dialog-menu.js";
import { saveTransactionHistory } from "../saveToLocalStorage/saveTransactionHistory.js";
import { clearCartStorage } from "../cart/cart-local-storage.js";

function FormHeader(){
    const formHeaderContainer = document.createElement('fieldset');
    formHeaderContainer.className = "form-header";

    const headerIconText = document.createElement("div");
    headerIconText.className = "header-icon-text";
    headerIconText.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag w-5 h-5 text-accent"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>';

    const formHeaderLabel = document.createElement('h2');
    formHeaderLabel.className = "form-header-label";
    formHeaderLabel.textContent = "Complete your order";

    headerIconText.appendChild(formHeaderLabel);

    const exitBtnWrapper = document.createElement('div');
    exitBtnWrapper.className = "exit-btn-wrapper";

    const exitBtn = document.createElement('button');
    exitBtn.type = "button";
    exitBtn.className ="exit-form-btn";
    exitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
    
    exitBtnWrapper.appendChild(exitBtn);

    formHeaderContainer.append(headerIconText,exitBtnWrapper);

    return formHeaderContainer;
}

function FormProductsSummary(){
    const formOrderSummaryContainer = document.createElement("fieldset");
    formOrderSummaryContainer.className = "form-order-summary-container";

    const formLabelSummary = document.createElement('h2');
    formLabelSummary.className = "label-summary";
    formLabelSummary.textContent = "Order Summary";

    const formProductSummaryWrapper = document.createElement('div');
    formProductSummaryWrapper.className = "form-product-summary-wrapper";

    const productSummary = document.createElement('div');
    productSummary.className = "product-summary";


    const formTotalSummary = document.createElement('div');
    formTotalSummary.className = "form-total-summary";

    const totalLabel = document.createElement("h3");
    totalLabel.className = "total-label-summary";
    totalLabel.textContent = "Total";

    const totalPriceSummary = document.createElement('span');
    totalPriceSummary.className = "form-total-price-summary";
    totalPriceSummary.textContent = formatCurrency(0);

    formTotalSummary.append(totalLabel,totalPriceSummary);
    formProductSummaryWrapper.append(productSummary,formTotalSummary);

    formOrderSummaryContainer.append(formLabelSummary,formProductSummaryWrapper);

    return formOrderSummaryContainer;
}


function FormFields(){
    const formFields = document.createElement('fieldset');
    formFields.className = "form-fields";

    const fullNameField = document.createElement('input');
    fullNameField.type = "text";
    fullNameField.id = "full-name";
    fullNameField.placeholder = "Full Name";

    const emailAddressField = document.createElement('input');
    emailAddressField.type = "email";
    emailAddressField.id = "email";
    emailAddressField.placeholder = "Email Address";

    const contactNumberField = document.createElement('input');
    contactNumberField.type = "text";
    contactNumberField.id = "contact-number";
    contactNumberField.placeholder = "Contact Number";

    const deliveryAddressField = document.createElement('input');
    deliveryAddressField.type = "text";
    deliveryAddressField.id = "delivery-address";
    deliveryAddressField.placeholder = "Delivery Address";

    const placeOrderSubmit = document.createElement('button');
    placeOrderSubmit.type = "submit";
    placeOrderSubmit.textContent = "Place Order";

    formFields.append(fullNameField,emailAddressField,contactNumberField,deliveryAddressField,placeOrderSubmit);
    
    return formFields;

}

export default function TransactionFormDialog(){
    const formDialogContainer = document.createElement('div');
    formDialogContainer.className = "form-dialog-container";

    const form = document.createElement('form');
    form.id = "transaction-form";
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullNameField = form.querySelector('#full-name');
        const emailAddressField = form.querySelector('#email');
        const contactNumberField = form.querySelector('#contact-number');
        const deliveryAddressField = form.querySelector('#delivery-address');
        const totalAmountEl = form.querySelector('.form-total-price-summary');
        const productSummary = form.querySelector('.product-summary');

        const orderItems = Array.from(productSummary?.children || []).map((item) => {
            const productName = item.querySelector('.product-name')?.textContent?.trim() || '';
            const quantity = item.querySelector('.product-quantity')?.textContent?.replace(/Qty:\s*/i, '')?.trim() || '0';
            const totalText = item.querySelector('.product-item-total')?.textContent?.trim() || '$0.00';
            const totalPrice = Math.round(parseFloat(totalText.replace(/[^0-9.]/g, '')) * 100);

            return {
                name: productName,
                quantity: Number(quantity),
                totalPrice,
                totalPriceLabel: totalText,
            };
        }).filter((item) => item.quantity > 0);

        const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const transaction = {
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            customerName: fullNameField?.value?.trim() || 'Unknown Customer',
            email: emailAddressField?.value?.trim() || '',
            phoneNumber: contactNumberField?.value?.trim() || '',
            deliveryAddress: deliveryAddressField?.value?.trim() || '',
            totalAmount,
            totalAmountLabel: totalAmountEl?.textContent?.trim() || formatCurrency(0),
            date: new Date().toISOString(),
            items: orderItems,
        };

        saveTransactionHistory(transaction);

        // Clear cart from localStorage since the order has been placed
        clearCartStorage();

        if (formDialogContainer.parentElement) {
            formDialogContainer.remove();
        }

        document.body.style.overflow = '';
        window.dispatchEvent(new CustomEvent('formClosed'));

        const historyPageUrl = window.location.pathname.includes('/pages/')
            ? './transaction-history.html'
            : './pages/transaction-history.html';

        window.location.assign(historyPageUrl);
    });
    
    const formHeader = FormHeader();
    const formOrderSummaryContainer = FormProductsSummary(); 
    const formFields = FormFields();

    form.append(formHeader,formOrderSummaryContainer,formFields);
    formDialogContainer.appendChild(form);
    
    return formDialogContainer;
}