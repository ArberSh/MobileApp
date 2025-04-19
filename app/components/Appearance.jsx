import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  StatusBar
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Slider from '@react-native-community/slider';

// Import the useTheme hook from the correct location
import { useTheme } from './ThemeContext';

const Appearance = () => {
  const navigation = useNavigation();
  const { colors, isDark, toggleTheme } = useTheme();
  const { width } = Dimensions.get('window');

  const [fontsLoaded] = useFonts({
    'Lexend': require('../assets/fonts/Lexend/static/Lexend-Regular.ttf'),
    'Lexend-Medium': require('../assets/fonts/Lexend/static/Lexend-Medium.ttf'),
    'Lexend-Bold': require('../assets/fonts/Lexend/static/Lexend-Bold.ttf'),
    'Lexend-SemiBold': require('../assets/fonts/Lexend/static/Lexend-SemiBold.ttf')
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'Lexend-Bold' }]}>Appearance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subText, fontFamily: 'Lexend-SemiBold' }]}>Theme</Text>
            <View style={styles.themeOptions}>
              <TouchableOpacity 
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.cardBackground },
                  isDark && styles.selectedOption
                ]}
                onPress={() => !isDark && toggleTheme()}
              >
                <View style={[styles.themePreview, styles.darkPreview]}>
                  <Feather name="moon" size={24} color="#fff" />
                </View>
                <Text style={[styles.themeLabel, { color: colors.text, fontFamily: 'Lexend-Medium' }]}>Dark</Text>
                {isDark && (
                  <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.cardBackground },
                  !isDark && styles.selectedOption
                ]}
                onPress={() => isDark && toggleTheme()}
              >
                <View style={[styles.themePreview, styles.lightPreview]}>
                  <Feather name="sun" size={24} color="#000" />
                </View>
                <Text style={[styles.themeLabel, { color: colors.text, fontFamily: 'Lexend-Medium' }]}>Light</Text>
                {!isDark && (
                  <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.themeDescription, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.descriptionText, { color: colors.text, fontFamily: 'Lexend' }]}>
              Choose between dark and light mode for your interface.
            </Text>
            <Text style={[styles.descriptionText, { color: colors.text, fontFamily: 'Lexend' }]}>
              Your theme preference will be saved and applied across all your devices.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.subText, fontFamily: 'Lexend-SemiBold' }]}>Font Size</Text>
            <View style={[styles.fontSizeControl, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.fontSizeLabel, styles.small, { color: colors.text, fontFamily: 'Lexend-Bold' }]}>A</Text>
              
              {/* If you have the slider component, uncomment this */}
              <View style={styles.slider}>
                {/* Placeholder for slider */}
                <Slider
  style={{width: '100%', height: 40}}
  minimumValue={0}
  maximumValue={4}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#000000"
/>
              </View>
              
              <Text style={[styles.fontSizeLabel, styles.large, { color: colors.text, fontFamily: 'Lexend-Bold' }]}>A</Text>
            </View>
            <Text style={[styles.settingNote, { color: colors.subText, fontFamily: 'Lexend' }]}>
              This feature will be available soon.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    paddingLeft: 8,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#2e71e5',
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  darkPreview: {
    backgroundColor: '#121212',
  },
  lightPreview: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  themeDescription: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 14,
    marginBottom: 8,
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  fontSizeLabel: {
    fontWeight: 'bold',
  },
  small: {
    fontSize: 14,
  },
  large: {
    fontSize: 22,
  },
  slider: {
    flex: 1,
    marginHorizontal: 12,
    height: 40,
    justifyContent: 'center',
  },
  settingNote: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default Appearance;