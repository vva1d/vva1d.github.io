import { useState } from 'react';
import { useContext } from 'react';
import { BasketContext } from '../../context/Basket_context';
import './Product_card.css';

function Product_card({ product }) {
    const [imageSrc, setImageSrc] = useState(`/images/${product.image}`);
    const { cart, addToCart } = useContext(BasketContext);
    const isInCart = cart.some(item => item.name === product.name);

    const handleImageError = () => setImageSrc('/images/logowebsite.png');
    const priceToShow = product.discountPrice || product.price;

    return (
        <div className="product-card">
            <img src={imageSrc} alt={product.name} onError={handleImageError} />
            <h3>{product.name}</h3>
            {product.discountPrice && <p><strike>Ціна: {product.price} грн</strike></p>}
            <p className={product.discountPrice ? 'new-price' : ''}>Ціна: {priceToShow} грн</p>
            <p>{product.availability}</p>
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

export default Product_card;