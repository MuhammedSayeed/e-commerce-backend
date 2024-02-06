function calcTotalPrice(cart) {
    let totalPrice = 0;
    cart.cartItems.forEach(item => totalPrice += item.quantity * item.price)
    cart.totalPrice = totalPrice;
}
function findProductInCart(cart, product) {
    let item = cart.cartItems.find(item => item.product == product);
    return item;
}
export function calcDisscount(codeDisscount, cart) {
    
    let disscount = (codeDisscount / 100) * cart.totalPrice;
    cart.totalPriceAfterDisscount = cart.totalPrice - disscount;

}
export {
    calcTotalPrice,
    findProductInCart,
}