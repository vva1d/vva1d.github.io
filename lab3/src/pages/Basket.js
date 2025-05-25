import { useContext } from 'react';
import { BasketContext } from '../context/Basket_context';
import Basket from '../components/Basket/Basket';

function BasketPage() {
    const { cart } = useContext(BasketContext);

    return (
        <div className="basket-page">
            <h1>Кошик</h1>
            <Basket />
        </div>
    );
}

export default BasketPage;