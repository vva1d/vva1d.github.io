import '../css3/User_profile.css'

function User_profile() {
    return (
        <div className="user-profile">
            <h2>Мій профіль</h2>
            <section className="profile-info">
                <h3 className="user-info_h">Персональні дані</h3>
                <div className="user-info">
                    <p><strong>Прізвище, ім'я, по батькові:</strong> Козак Владислав Миколайович</p>
                    <p><strong>Email:</strong> vladyslavkozak@gmail.com</p>
                    <p><strong>Телефон:</strong> +380 111 111 111</p>
                </div>
            </section>
            <section className="purchase-history">
                <h3 className="purchase-history_h">Історія покупок</h3>
                <div className="purchase-history_block">
                    <ul>
                        <li><a href="#">100% Whey Gold Standard - Optimum Nutrition</a></li>
                        <li><a href="#">Мікронізований креатин у формі порошку - Optimum Nutrition</a></li>
                    </ul>
                </div>
            </section>
            <section className="wishlist">
                <h3 className="wishlist_h">Бажані товари</h3>
                <div className="wishlist-grid">
                    <ul>
                        <li><a href="#">100% Whey Gold Standard - Optimum Nutrition</a></li>
                        <li><a href="#">Мікронізований креатин у формі порошку - Optimum Nutrition</a></li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default User_profile;