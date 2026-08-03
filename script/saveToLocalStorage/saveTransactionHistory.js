const TRANSACTION_HISTORY_KEY = 'coffeeTransactionHistory';

export function loadTransactionHistory() {
    try {
        const raw = localStorage.getItem(TRANSACTION_HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Failed to load transaction history from localStorage', error);
        return [];
    }
}

export function saveTransactionHistory(transaction) {
    try {
        const history = loadTransactionHistory();
        const updatedHistory = [transaction, ...history];
        localStorage.setItem(TRANSACTION_HISTORY_KEY, JSON.stringify(updatedHistory));
        return true;
    } catch (error) {
        console.error('Failed to save transaction history to localStorage', error);
        return false;
    }
}

export function deleteTransaction(transactionId) {
    try {
        const history = loadTransactionHistory();
        const updatedHistory = history.filter((transaction) => transaction.id !== transactionId);
        localStorage.setItem(TRANSACTION_HISTORY_KEY, JSON.stringify(updatedHistory));
        return true;
    } catch (error) {
        console.error('Failed to delete transaction from localStorage', error);
        return false;
    }
}

export function clearTransactionHistory() {
    try {
        localStorage.removeItem(TRANSACTION_HISTORY_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear transaction history from localStorage', error);
        return false;
    }
}
