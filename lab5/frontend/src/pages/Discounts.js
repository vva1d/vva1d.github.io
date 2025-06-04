import { useState, useEffect, useContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { BasketContext } from '../context/Basket_context';
import { WishlistContext } from '../context/WishlistContext';
import Discounts_block from '../components/Discounts_block/Discounts_block';
import '../css3/Discounts.css';

function Discounts() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(BasketContext);
    const { addToWishlist } = useContext(WishlistContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsList = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(product => product.availability === 'В наявності' && product.discountPrice);
                setProducts(productsList);
            } catch (error) {
                console.error('Помилка завантаження продуктів:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="discounts-page">
            <h1>Акційні пропозиції</h1>
            <div className="product-grid">
                {products.map((product) => (
                    <Discounts_block
                        key={product.id}
                        product={product}
                        addToCart={() => addToCart(product)}
                        addToWishlist={() => addToWishlist(product)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Discounts;