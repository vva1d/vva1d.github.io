import './Product_card.css';
import { useState, useContext } from 'react';
import { BasketContext } from '../../context/Basket_context';
import { WishlistContext } from '../../context/WishlistContext';

function Product_card({ product, onAddToCart, onAddToWishlist }) {
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
        <div className="product-card">
            <img src={imageSrc} alt={product.name} onError={handleImageError} className="product-image" />
            <h3>{product.name}</h3>
            {product.discountPrice ? (
                <>
                    <p>
                        Ціна: <strike>{product.price} грн</strike>{' '}
                        <span className="new-price">{product.discountPrice} грн</span>
                    </p>
                </>
            ) : (
                <p>Ціна: {product.price} грн</p>
            )}
            {product.rating && (
                <p>Рейтинг: {renderStars(product.rating)}</p>
            )}
            <p>Наявність: {product.availability}</p>
            <button
                className={`add-to-cart ${isInCart ? 'in-cart' : ''}`}
                onClick={onAddToCart}
                disabled={isInCart}
            >
                {isInCart ? 'Товар у кошику' : 'Додати до кошика'}
            </button>
            <button
                className={`add-to-wishlist ${isInCart || isInWishlist ? 'in-wishlist' : ''}`}
                onClick={onAddToWishlist}
                disabled={isInCart || isInWishlist}
            >
                {isInWishlist ? 'Вподобано' : 'Додати до списку бажань'}
            </button>
        </div>
    );
}

export default Product_card;