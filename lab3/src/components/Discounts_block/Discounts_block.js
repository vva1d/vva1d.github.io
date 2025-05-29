import { useState, useContext } from 'react';
import { BasketContext } from '../../context/Basket_context';
import './Discounts_block.css';
import '../../css3/Discounts.css';

function Discounts_block({ product, addToCart }) {
    const [imageSrc, setImageSrc] = useState(`/images/${product.image}`);
    const { cart } = useContext(BasketContext);
    const isInCart = cart.some(item => item.name === product.name);

    const handleImageError = () => setImageSrc('/images/logowebsite.png');

    return (
        <div className="discount-block">
            <img src={imageSrc} alt={product.name} onError={handleImageError} />
            <h3>{product.name}</h3>
            <p className="old-price"><strike>Ціна: {product.price} грн</strike></p>
            <p className="new-price">Нова ціна: {product.discountPrice} грн</p>
            <p className="Rating">Рейтинг: {'⭐'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</p>
            <button
                className={`add-to-cart ${isInCart ? 'in-cart' : ''}`}
                onClick={() => addToCart(product)}
                disabled={isInCart}
            >
                {isInCart ? 'Товар у кошику' : 'Додати до кошика'}
            </button>
        </div>
    );
}

export default Discounts_block;