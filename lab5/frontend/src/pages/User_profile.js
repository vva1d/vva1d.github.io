import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { WishlistContext } from '../context/WishlistContext';
import { BasketContext } from '../context/Basket_context';
import { useAuth } from '../context/authContext';
import '../css3/User_profile.css';

function User_profile() {
    const { removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(BasketContext);
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            fetchUserData();
            fetchWishlist();
        }
    }, [currentUser]);

    const fetchUserData = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setUserData(data);
            setError(null);
        } catch (err) {
            console.error('Fetch user data error:', err);
            setError(err.message);
        }
    };

    const fetchWishlist = async () => {
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/wishlist', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setWishlist(data);
            setError(null);
        } catch (err) {
            console.error('Fetch wishlist error:', err);
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error('Помилка виходу:', err);
        }
    };

    const handleAddToCart = async (item) => {
        try {
            addToCart(item); // Додаємо до кошика локально
            const token = await currentUser.getIdToken();
            const response = await fetch('http://localhost:5000/api/move-to-cart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: item.id }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setWishlist(data.wishlist); // Оновлюємо список бажань
            setError(null);
        } catch (err) {
            console.error('Add to cart error:', err);
            setError(err.message);
        }
    };

    const handleRemoveFromWishlist = async (itemId) => {
        if (!itemId) {
            setError('Invalid item ID');
            return;
        }
        try {
            await removeFromWishlist(itemId);
            fetchWishlist(); // Оновлюємо список після видалення
            setError(null);
        } catch (err) {
            console.error('Remove from wishlist error:', err);
            setError(err.message);
        }
    };

    if (!currentUser) {
        navigate('/login');
        return null;
    }

    return (
        <div className="user-profile">
            <h2>Мій профіль</h2>
            <section className="profile-info">
                <h3 className="user-info_h">Персональні дані</h3>
                <div className="user-info-card">
                    <p><strong>Email:</strong> {userData?.email || 'Невідомо'}</p>
                    <p><strong>Прізвище:</strong> {userData?.lastName || 'Невідомо'}</p>
                    <p><strong>Ім'я:</strong> {userData?.firstName || 'Невідомо'}</p>
                    <p><strong>По-батькові:</strong> {userData?.middleName || 'Невідомо'}</p>
                    <p><strong>Номер телефону:</strong> {userData?.phoneNumber || 'Невідомо'}</p>
                </div>
                {error && <p style={{ color: 'red' }}>Помилка: {error}</p>}
            </section>
            <section className="wishlist">
                <h3 className="wishlist_h">Бажані товари</h3>
                <div className="wishlist-grid">
                    <ul>
                        {wishlist.length === 0 ? (
                            <li className="wishlist_is_empty">Список бажань порожній</li>
                        ) : (
                            wishlist.map((item) => (
                                <li key={item.id} className="wishlist-item">
                                    <span>{item.name} - {item.price} грн</span>
                                    <div className="wishlist-buttons">
                                        <button
                                            className="cart-button"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            До кошика
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleRemoveFromWishlist(item.id)}
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
                {error && <p style={{ color: 'red' }}>Помилка: {error}</p>}
            </section>
            <div className="logout-section">
                <button className="logout-button" onClick={handleLogout}>
                    Вийти
                </button>
            </div>
        </div>
    );
}

export default User_profile;