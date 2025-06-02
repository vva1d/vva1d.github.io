import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { WishlistContext } from '../context/WishlistContext';
import { BasketContext } from '../context/Basket_context';
import { useAuth } from '../context/authContext';
import '../css3/User_profile.css';

function User_profile() {
    const { wishlist, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(BasketContext);
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            const fetchUserData = async () => {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            };
            fetchUserData();
        }
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (err) {
            console.error('Помилка виходу:', err);
        }
    };

    const handleAddToCart = (item) => {
        addToCart(item); // Додаємо товар у кошик
        removeFromWishlist(item.id); // Видаляємо товар зі списку бажань
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
            </section>
            <section className="wishlist">
                <h3 className="wishlist_h">Бажані товари</h3>
                <div className="wishlist-grid">
                    <ul>
                        {wishlist.length === 0 ? (
                            <li>Список бажань порожній</li>
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
                                            onClick={() => removeFromWishlist(item.id)}
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
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