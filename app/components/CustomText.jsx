import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

const Text = (props) => {
  const { style, ...rest } = props;
  return <RNText style={[styles.defaultText, style]} {...rest} />;
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Lexend', // Your default font
  },
});

export default Text;