import { Link } from 'react-router-dom';
import "./Header.css";

function Header() {
    return (
        <header>
            <nav>
                <ul className="nav-list">
                    <li><Link to="/products">Продукти</Link></li>
                    <li><Link to="/discounts">Акції</Link></li>
                    <li><Link to="/cart">Кошик</Link></li>
                    <li><Link to="/profile">Профіль</Link></li>
                </ul>
            </nav>
        </header>
    );
}
export default Header;