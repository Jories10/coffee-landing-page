const CART_STORAGE_KEY = 'coffeeCartItems';

export function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Failed to load cart from localStorage', error);
        return [];
    }
}

export function saveCartToStorage(cartItems) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        return true;
    } catch (error) {
        console.error('Failed to save cart to localStorage', error);
        return false;
    }
}

export function clearCartStorage() {
    try {
        localStorage.removeItem(CART_STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear cart from localStorage', error);
        return false;
    }
}

