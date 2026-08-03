import {
    loadTransactionHistory,
    deleteTransaction,
    clearTransactionHistory,
} from '../saveToLocalStorage/saveTransactionHistory.js';

const navigateToLandingPage = document.getElementById("navigate-to-landingpage");

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return 'Unknown date';
    }

    return date.toLocaleString();
}

function formatCurrency(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price / 100);
}

function observeCards(container) {
    const cards = container.querySelectorAll('.transaction-card');

    if (!cards.length) {
        return;
    }

    if (typeof IntersectionObserver === 'undefined') {
        cards.forEach((card) => card.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                currentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
    });

    cards.forEach((card) => observer.observe(card));
}

function renderTransactionHistory() {
    const container = document.getElementById('transaction-details');
    if (!container) {
        return;
    }

    const transactions = loadTransactionHistory();
    const header = document.querySelector('.transaction-header');

    if (header) {
        let clearButton = header.querySelector('.clear-all-transactions');
        if (!clearButton && transactions.length > 0) {
            clearButton = document.createElement('button');
            clearButton.type = 'button';
            clearButton.className = 'clear-all-transactions';
            clearButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg> <span>clear all</span>';
            clearButton.addEventListener('click', () => {
                clearTransactionHistory();
                renderTransactionHistory();
            });
            header.appendChild(clearButton);
        } else if (clearButton && transactions.length === 0) {
            clearButton.remove();
        }
    }

    container.innerHTML = '';

    if (transactions.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = '<div class="transaction-state-logo"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-receipt w-16 h-16 text-muted-foreground/30 mx-auto mb-4"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 17.5v-11"></path></svg><div> <p>No transaction history yet.</p>';
        container.appendChild(emptyState);
        return;
    }

    const fragment = document.createDocumentFragment();

    transactions.forEach((transaction) => {
        const card = document.createElement('article');
        card.className = 'transaction-card reveal';

        const headerRow = document.createElement('div');
        headerRow.className = 'transaction-card-header';

        const title = document.createElement('h3');
        title.textContent = transaction.customerName || 'Customer';

        const productPriceAndDeleteBtnContainer = document.createElement("div");
        productPriceAndDeleteBtnContainer.className = "product-price-and-delete-btn-container";


        const totalProductPrice = document.createElement('h3');
        totalProductPrice.innerHTML = `${transaction.totalAmountLabel || formatCurrency(transaction.totalAmount)}`;

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'transaction-delete-btn';
        deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>';
        deleteButton.addEventListener('click', () => {
            deleteTransaction(transaction.id);
            renderTransactionHistory();
        });

        productPriceAndDeleteBtnContainer.append(totalProductPrice,deleteButton);

        headerRow.append(title,productPriceAndDeleteBtnContainer);

        const meta = document.createElement('div');
        meta.className = 'transaction-meta';
        meta.innerHTML = `
            <div class="contact-details">
                <span>${transaction.email || 'N/A'}</span>
                <span>${transaction.phoneNumber || 'N/A'}</span>
                <p>${transaction.deliveryAddress || 'N/A'}</p>
            </div>
            <div class="transaction-date">
                <span>${formatDate(transaction.date)}</span>
            </div>
        `;

        const itemsWrapper = document.createElement('div');
        itemsWrapper.className = 'transaction-items';
        const itemsTitle = document.createElement('strong');
        itemsTitle.textContent = 'Products';
        const list = document.createElement('ul');

        (transaction.items || []).forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} — Qty: ${item.quantity} — ${item.totalPriceLabel || formatCurrency(item.totalPrice)}`;
            list.appendChild(listItem);
        });

        itemsWrapper.append(itemsTitle, list);
        card.append(headerRow, meta, itemsWrapper);
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
    observeCards(container);
}

renderTransactionHistory();
