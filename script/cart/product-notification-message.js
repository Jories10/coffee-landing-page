export default function productNotificationMessage(){
    const messageContainer = document.createElement('div');
    messageContainer.className = "product-message-container";
    messageContainer.innerHTML = '<span>!</span><p>Please add at least one item</p>';

    return messageContainer;
}