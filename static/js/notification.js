export function notificationMessage() {
    this.status = '';
    this.messageContent = '';
    this.setStatus = (status) => {
        return this.status = status;
    }
    this.setMessage = (message) => {

        return this.messageContent = '<div class="close">' +
            '<i class="message_btn_close btn bx bx-x" ></i>' +
            '</div>' +
            `<div class="message">${message}</div>`;
    }
    this.getMessage = () => {
        return this.message;
    }
    this.getMessageElement = () => {
        let nodeElement = document.createElement('div');

        nodeElement.setAttribute('class', `modal_message ${this.status}`);
        nodeElement.innerHTML = this.messageContent;

        return nodeElement;
    }

}

export function hideNotificationBlock(removeTimeOut) {
    let notificationElement = document.querySelector('.notification_block');

    if (notificationElement) {
        notificationElement.classList.toggle('hide');
    }

    setTimeout(() => {
        if (notificationElement) {
            notificationElement.remove();
        }
    }, setTimeout);
}