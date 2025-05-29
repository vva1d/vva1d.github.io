import { useContext } from 'react';
import { BasketContext } from '../../context/Basket_context';
import './Basket.css';

function Basket() {
    const { cart, updateQuantity, removeFromCart } = useContext(BasketContext);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0, cart);

    return (
        <div className="basket">
            <h2>Кошик</h2>
            {cart.length === 0 ? (
                <p>Кошик порожній</p>
            ) : (
                <>
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index} className="cart-item">
                                <span className="cart-item-name">{item.name} - {item.price} грн</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                                    className="quantity-input"
                                />
                                <span className="cart-item-total">Сума: {item.price * item.quantity} грн</span>
                                <button onClick={() => removeFromCart(index)} className="remove-item">Видалити</button>
                            </li>
                        ))}
                    </ul>
                    <p>Загальна сума: {total} грн</p>
                </>
            )}
        </div>
    );
}

export default Basket;