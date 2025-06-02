import { createContext, useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            const fetchWishlist = async () => {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setWishlist(userDoc.data().wishlist || []);
                } else {
                    await setDoc(userDocRef, { wishlist: [] });
                    setWishlist([]);
                }
            };
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [currentUser]);

    const addToWishlist = async (product) => {
        if (!currentUser) return;
        // Перевіряємо, чи товар уже є в списку бажань
        const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
        if (isAlreadyInWishlist) return; // Якщо товар уже є, не додаємо

        const userDocRef = doc(db, 'users', currentUser.uid);
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        await updateDoc(userDocRef, {
            wishlist: arrayUnion(product)
        });
    };

    const removeFromWishlist = async (productId) => {
        if (!currentUser) return;
        const userDocRef = doc(db, 'users', currentUser.uid);
        const productToRemove = wishlist.find(item => item.id === productId);
        const newWishlist = wishlist.filter(item => item.id !== productId);
        setWishlist(newWishlist);
        await updateDoc(userDocRef, {
            wishlist: arrayRemove(productToRemove)
        });
    };

    const addToCartFromWishlist = async (product) => {
        if (!currentUser) return;
        removeFromWishlist(product.id);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, addToCartFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}