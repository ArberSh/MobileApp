import { StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import Text from '../CustomText';
import { useTheme } from '../ThemeContext';

const GroupCard = ({name, photo, description, color}) => {
  const { colors } = useTheme();
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';

  const darkenColor = (color) => {
    // If we have a hex color
    if (color && color.startsWith('#')) {
      // Extract RGB values
      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);
      
      // Darken by reducing RGB values by 30%
      r = Math.max(0, Math.floor(r * 0.8));
      g = Math.max(0, Math.floor(g * 0.8));
      b = Math.max(0, Math.floor(b * 0.8));
      
      // Convert back to hex, ensuring 2 digits
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    // Default dark color if input is not a hex color
    return '#2a5d5e';
  };
  
  // Get original color with fallback
  const originalColor = color || '#4ea4a6';
  
  // Create darkened version
  const darkColor = darkenColor(originalColor);

  return (
    <TouchableOpacity style={{
      height: 120,
      borderRadius: 16,
      marginTop: 10,
    }}>
      <View style={{
        backgroundColor: color,
        height: '59%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 10
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <View style={[styles.letterAvatar, { backgroundColor: darkColor || '#4ea4a6' }]}>
            <Text style={styles.letterText}>{firstLetter}</Text>
          </View>
          <Text style={{
            fontSize: 20,
            marginLeft: 10,
            color: colors.text
          }}>
            {name}
          </Text>
        </View>
      </View>
      <View style={{
        backgroundColor: colors.cardBackground,
        height: '41%',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16
      }}>
        <View style={{
          padding: 10
        }}>
          <Text style={{
            color: colors.subText
          }}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default GroupCard

const styles = StyleSheet.create({
  letterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1
  },
  letterText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
})