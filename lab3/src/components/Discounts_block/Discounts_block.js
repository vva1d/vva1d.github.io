import { useState } from 'react';
import './Discounts_block.css';

function Discounts_block({ product, addToCart, isInCart }) {
    const [imageSrc, setImageSrc] = useState(`/images/${product.image}`);

    const handleImageError = () => setImageSrc('/images/logowebsite.png');

    return (
        <div className="discount-block">
            <img src={imageSrc} alt={product.name} onError={handleImageError} />
            <h3>{product.name}</h3>
            <p><strike>Ціна: {product.price} грн</strike></p>
            <p className="new-price">Нова ціна: {product.discountPrice} грн</p>
            <p>Рейтинг: {'⭐'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}</p>
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