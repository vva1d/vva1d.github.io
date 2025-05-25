import { useContext } from 'react';
import { BasketContext } from '../../context/Basket_context';
import './Basket.css';

function Basket() {
    const { cart, updateQuantity, removeFromCart } = useContext(BasketContext);

    if (cart.length === 0) return <p>Кошик порожній</p>;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="basket">
            <h2>Кошик</h2>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        <span>{item.name} - {item.price} грн</span>
                        <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                        />
                        <span>Сума: {item.price * item.quantity} грн</span>
                        <button onClick={() => removeFromCart(index)}>Видалити</button>
                    </li>
                ))}
            </ul>
            <p>Загальна сума: {total} грн</p>
        </div>
    );
}

export default Basket;