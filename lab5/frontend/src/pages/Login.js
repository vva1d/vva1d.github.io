import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { useAuth } from '../context/authContext';
import '../css3/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Якщо користувач уже увійшов, перенаправляємо на профіль
    if (userLoggedIn) {
        navigate('/user-profile');
        return null;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/user-profile'); // Перенаправлення після входу
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Вхід</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Електронна пошта"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    required
                />
                <button className="login-button"type="submit">Увійти</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;