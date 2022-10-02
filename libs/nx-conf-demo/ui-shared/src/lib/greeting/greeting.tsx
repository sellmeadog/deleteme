/* eslint-disable jsx-a11y/accessible-emoji */
import React, { FC } from 'react';

import { View, Text, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface GreetingProps {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Greeting: FC<GreetingProps> = ({ containerStyle, textStyle }) => {
  return (
    <View style={containerStyle}>
      <Text accessibilityRole="header" style={textStyle}>
        Welcome to Nx Conf 👋
      </Text>
    </View>
  );
};
