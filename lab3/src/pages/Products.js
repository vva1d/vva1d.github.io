import { useState, useEffect, useContext } from 'react';
import { BasketContext } from '../context/Basket_context';
import Product_card from '../components/Product_card/Product_card';
import '../css3/Products.css'

function Products() {
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('none');
    const { addToCart } = useContext(BasketContext);

    useEffect(() => {
        fetch('/data/products.json')
            .then((res) => res.json())
            .then((data) => {
                const availableProducts = data.filter(
                    (product) => product.availability === 'В наявності' && !product.discountPrice
                );
                setProducts(availableProducts);
            })
            .catch((error) => console.error('Помилка завантаження:', error));
    }, []);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-asc') return a.rating - b.rating;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        return 0;
    });

    const handleAddToCart = (product) => addToCart(product);

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
                {sortedProducts.map((product, index) => (
                    <Product_card key={index} product={product} />
                ))}
            </div>
        </div>
    );
}

export default Products;