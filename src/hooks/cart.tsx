import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const cartProductsJSON = await AsyncStorage.getItem(
        '@GoMarketplace:cart',
      );
      if (cartProductsJSON) {
        const cartProducts = JSON.parse(cartProductsJSON);

        setProducts([...cartProducts]);
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const updatedProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      );

      setProducts(updatedProducts);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(updatedProducts),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const updatedProducts = products.map(product =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product,
      );

      const filteredCartProducts = updatedProducts.filter(
        ({ quantity }) => quantity > 0,
      );

      setProducts(filteredCartProducts);

      await AsyncStorage.setItem(
        '@GoMarketplace:cart',
        JSON.stringify(filteredCartProducts),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async (product: Product) => {
      const productInCart = products.find(
        (cartProduct: Product) => cartProduct.id === product.id,
      );

      if (!productInCart) {
        const updatedCartProducts = [...products, { ...product, quantity: 1 }];

        setProducts(updatedCartProducts);

        await AsyncStorage.setItem(
          '@GoMarketplace:cart',
          JSON.stringify(updatedCartProducts),
        );
      } else {
        await increment(product.id);
      }
    },
    [increment, products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
