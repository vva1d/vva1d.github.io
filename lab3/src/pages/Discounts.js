import { useState, useEffect, useContext } from 'react';
import { BasketContext } from '../context/Basket_context';
import Discounts_block from '../components/Discounts_block/Discounts_block';

function Discounts() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(BasketContext);

    useEffect(() => {
        fetch('/data/products.json')
            .then((res) => res.json())
            .then((data) => {
                const availableProducts = data.filter(
                    (product) => product.availability === 'В наявності' && product.discountPrice
                );
                setProducts(availableProducts);
            })
            .catch((error) => console.error('Помилка завантаження:', error));
    }, []);

    const handleAddToCart = (product) => addToCart(product);

    return (
        <div className="discounts-page">
            <h1>Акції</h1>
            <div className="product-grid">
                {products.map((product, index) => (
                    <Discounts_block
                        key={index}
                        product={product}
                        addToCart={handleAddToCart}
                        isInCart={false} // Поки що без перевірки кошика
                    />
                ))}
            </div>
        </div>
    );
}

export default Discounts;