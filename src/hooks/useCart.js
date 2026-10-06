import { useState, useMemo, useEffect } from "react";
import { db } from "../data/db.js";

const getInitialCart = () => {
  if (typeof window === "undefined") return [];
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

export const useCart = () => {
  const [data] = useState(db);
  const [cart, setCart] = useState(getInitialCart);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  const cartTotal = useMemo(
    () => cart.reduce((acc, guitar) => acc + guitar.price * guitar.quantity, 0),
    [cart]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const guitarExists = prevCart.findIndex((guitar) => guitar.id === item.id);

      if (guitarExists >= 0) {
        const currentItem = prevCart[guitarExists];
        if (currentItem.quantity >= 5) return prevCart;

        const updatedCart = [...prevCart];
        updatedCart[guitarExists] = { ...currentItem, quantity: currentItem.quantity + 1 };
        return updatedCart;
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id && item.quantity < 5) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id && item.quantity > 0) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return {
    data,
    cart,
    isEmpty, 
    cartTotal, 
    addToCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    clearCart,
  };
};

export default useCart;