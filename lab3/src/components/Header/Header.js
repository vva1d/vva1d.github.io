import { Link } from 'react-router-dom';
import { FaBox, FaTags, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useContext } from 'react';
import { BasketContext } from '../../context/Basket_context';
import './Header.css';

function Header() {
    const { cart } = useContext(BasketContext);
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="header">
            <nav>
                <ul className="nav-list">
                    <li>
                        <Link to="/products">
                            <FaBox style={{ marginRight: '5px' }} /> Продукти
                        </Link>
                    </li>
                    <li>
                        <Link to="/discounts">
                            <FaTags style={{ marginRight: '5px' }} /> Акції
                        </Link>
                    </li>
                    <li>
                        <Link to="/basket">
                            <FaShoppingCart style={{ marginRight: '5px' }} /> Кошик
                            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
                        </Link>
                    </li>
                    <li>
                        <Link to="/user-profile">
                            <FaUser style={{ marginRight: '5px' }} /> Профіль
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;