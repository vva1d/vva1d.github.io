import { useState, useEffect, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { BasketContext } from '../context/Basket_context';
import { WishlistContext } from '../context/WishlistContext';
import Product_card from '../components/Product_card/Product_card';
import '../css3/Products.css';

function Products() {
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('none');
    const { addToCart } = useContext(BasketContext);
    const { addToWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsList = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(product => product.availability === 'В наявності' && !product.discountPrice);
                setProducts(productsList);
            } catch (error) {
                console.error('Помилка завантаження продуктів:', error);
            }
        };
        fetchProducts();
    }, []);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-asc') return a.rating - b.rating;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        return 0;
    });

    return (
        <div className="products-page">
            <h1>Перелік товарів</h1>
            <div className="filters">
                <div className="filter-group">
                    <label>Сортувати за ціною:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="none">За замовчуванням</option>
                        <option value="price-asc">Ціна: від низької</option>
                        <option value="price-desc">Ціна: від високої</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Сортувати за рейтингом:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="none">За замовчуванням</option>
                        <option value="rating-asc">Рейтинг: від низького</option>
                        <option value="rating-desc">Рейтинг: від високого</option>
                    </select>
                </div>
            </div>
            <div className="product-grid">
                {sortedProducts.map((product) => (
                    <Product_card
                        key={product.id}
                        product={product}
                        onAddToCart={() => addToCart(product)}
                        onAddToWishlist={() => addToWishlist(product)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Products;