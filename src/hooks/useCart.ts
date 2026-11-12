import { useEffect, useState, useMemo, useCallback } from "react";
import { getGuitars } from "../api/guitars";

export const useCart = () => {
  //logiica
  //const [data] = useState(db); //entre parentesis estado inicial
  //const [cart, setCart] = useState([]);

  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart"); //se buscar el cart y se guarda en el navegador

    try {
      //el trii es para que se aplique la functio correctamente
      const parsed = localStorageCart ? JSON.parse(localStorageCart) : []; //convie la cadena o guarda aun localtoge objto o vacio
      return Array.isArray(parsed) ? parsed : []; //validamos que sea un [] y si encunetra algo diferente regresa [vacio] para evitar errores
    } catch (error) {
      //campuramos el error
      console.error("Error al leer el carrito de localStorage:", error); //se registra el error y lo muestra en consola
      localStorage.removeItem("cart"); //elimina la clave dañada o el error
      return []; //regresa el carrito vacio[]
    }
  };

  const [data, setData] = useState<Guitar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGuitars = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getGuitars());
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el catálogo. ¿Está encendido el servidor?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuitars();
  }, [loadGuitars]);

  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    //solo recibe cadenas de texto
    localStorage.setItem("cart", JSON.stringify(cart)); //da formato json
  }, [cart]); //guarda carrito convertido a string

  const MIN_ITEMS = 1;
  const MAX_ITEMS = 5;

  function addToCart(item: Guitar) {
    const itemExists = cart.findIndex((guitar: CartItem) => guitar.id == item.id); //regresa el elemento con el mismo id y regresa el idice
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExists] = { ...updatedCart[itemExists], quantity: updatedCart[itemExists].quantity + 1 };
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]); //se copia el carrito
    }
  }

  function decreseQuantity(id: number) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }
  function increaseQuantity(id: number) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  }

  function removeFromCart(id: number) {
    setCart((prevCart) => prevCart.filter((guita) => guita.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const [total, setTotal] = useState(0);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart],
  );

  return {
    //metodos y variables para retornar o compartir

    cart,
    data,
    loading,
    error,
    loadGuitars,
    isEmpty,
    cartTotal,
    addToCart,
    decreseQuantity,
    increaseQuantity,
    removeFromCart,
    clearCart,
    total,
    setTotal,
    useState,
  };
};
