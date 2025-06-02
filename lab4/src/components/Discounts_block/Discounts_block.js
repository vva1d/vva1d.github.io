import './Discounts_block.css';
import { useState, useContext } from 'react';
import { BasketContext } from '../../context/Basket_context';
import { WishlistContext } from '../../context/WishlistContext';

function Discounts_block({ product, addToCart, addToWishlist }) {
    const [imageSrc, setImageSrc] = useState(`/images/${product.image}`);
    const { cart } = useContext(BasketContext);
    const { wishlist } = useContext(WishlistContext);
    const isInCart = cart.some(item => item.id === product.id);
    const isInWishlist = wishlist.some(item => item.id === product.id);

    const handleImageError = () => setImageSrc('/images/logowebsite.png');

    const renderStars = (rating) => {
        const maxStars = 5;
        const fullStars = Math.floor(rating);
        const emptyStars = maxStars - fullStars;
        return (
            <>
                {'⭐'.repeat(fullStars)}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    return (
        <div className="discount-block">
            <img src={imageSrc} alt={product.name} onError={handleImageError} className="discount-image" />
            <h3>{product.name}</h3>
            <p>Звичайна ціна: <strike>{product.price} грн</strike></p>
            <p className="new-price">Акційна ціна: {product.discountPrice} грн</p>
            <p>Наявність: {product.availability}</p>
            {product.rating && (
                <p>Рейтинг: {renderStars(product.rating)}</p>
            )}
            <button
                className={`add-to-cart ${isInCart ? 'in-cart' : ''}`}
                onClick={addToCart}
                disabled={isInCart}
            >
                {isInCart ? 'Товар у кошику' : 'Додати до кошика'}
            </button>
            <button
                className={`add-to-wishlist ${isInCart || isInWishlist ? 'in-wishlist' : ''}`}
                onClick={addToWishlist}
                disabled={isInCart || isInWishlist}
            >
                {isInWishlist ? 'Вподобано' : 'Додати до списку бажань'}
            </button>
        </div>
    );
}

export default Discounts_block;