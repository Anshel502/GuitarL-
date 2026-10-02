import Header from "./Components/Header";
import { useState, useMemo } from "react";
import { db } from "./data/db.js";
import Guitar from "./Components/Guitar";

function App() {
  const [data, setData] = useState(db);
  const [cart, setCart] = useState(initialCart());

  const cartTotal = useMemo(() => cart.reduce((acc, guitar) => acc + (guitar.price * guitar.quantity), 0), [cart]);

  function handlerClick(item) {
    const guitarExists = cart.findIndex((guitar) => guitar.id === item.id);

    if (guitarExists >= 0) {
      if (cart[guitarExists].quantity >= 5) return;
      const updatedCart = [...cart];
      updatedCart[guitarExists].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    }
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity < 5) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > 0) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCart(updatedCart);
  }

  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }
function initialCart() {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
}
  return (
    <>
      <Header
        cart={cart}
        total={cartTotal}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              guitar={guitar}
              handlerClick={handlerClick}
              key={guitar.id}
            />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;