import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LetterAvatar = ({ name, size = 110, borderWidth = 3, borderColor = '#fff', style = {} }) => {
  // Generate a random color based on the name (or a random one if no name)
  const backgroundColor = useMemo(() => {
    if (!name) return `hsl(${Math.random() * 360}, 50%, 50%)`;
    
    // Create a more consistent color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return `hsl(${Math.abs(hash) % 360}, 50%, 50%)`;
  }, [name]);

  // Get the first letter of the name, or a fallback
  const letter = useMemo(() => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }, [name]);

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor,
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor,
        },
        style
      ]}
    >
      <Text style={[styles.letter, { fontSize: size * 0.4 }]}>
        {letter}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Lexend-Bold',
  }
});

export default LetterAvatar;