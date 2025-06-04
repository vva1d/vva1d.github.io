import { createContext, useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

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
        const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
        if (isAlreadyInWishlist) return;

        const userDocRef = doc(db, 'users', currentUser.uid);
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        await updateDoc(userDocRef, {
            wishlist: arrayUnion(product)
        });
    };

    const removeFromWishlist = async (productId) => {
        if (!currentUser || !productId) return;

        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) throw new Error('User document not found');

        const currentWishlist = userDoc.data().wishlist || [];
        const productToRemove = currentWishlist.find(item => item.id === productId);

        if (!productToRemove) {
            console.warn(`Product with id ${productId} not found in wishlist`);
            return;
        }

        const newWishlist = currentWishlist.filter(item => item.id !== productId);
        setWishlist(newWishlist);
        await updateDoc(userDocRef, {
            wishlist: arrayRemove(productToRemove)
        }).catch(err => {
            console.error('Error removing from wishlist:', err);
            throw err; // Повторне викидання помилки для обробки в компоненті
        });
    };

    const addToCartFromWishlist = async (product) => {
        if (!currentUser) return;
        await removeFromWishlist(product.id);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, addToCartFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}