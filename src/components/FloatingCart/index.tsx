import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const { price } = products.reduce(
      (accumulator, currentProduct) => {
        accumulator.price +=
          Number(currentProduct.price) * Number(currentProduct.quantity);
        return accumulator;
      },
      {
        price: 0,
        quantity: 0,
      },
    );

    console.log(`cartTotal => price: ${price}`);

    return formatValue(price);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const { quantity } = products.reduce(
      (accumulator, currentProduct) => {
        console.log(
          `totalItensInCart => currentProduct.quantity: ${currentProduct.quantity}`,
        );

        accumulator.quantity += Number(currentProduct.quantity);
        return accumulator;
      },
      {
        quantity: 0,
      },
    );

    console.log(`totalItensInCart => quantity: ${quantity}`);

    return quantity;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
