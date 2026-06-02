import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

interface StoreHeroProps {
  imageUri: string;
  logoUri?: string;
}

export default function StoreHero({ imageUri, logoUri }: StoreHeroProps) {
  return (
    <View style={styles.heroContainer}>
      {/* Banner Image */}
      <View style={styles.bannerContainer}>
        <Image 
          source={{ uri: imageUri || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800' }} 
          style={styles.bannerImage} 
        />
        <View style={styles.gradientOverlay} />
      </View>

      {/* Overlapping Logo */}
      <View style={styles.logoWrapper}>
        <Image 
          source={{ uri: logoUri || imageUri || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=100' }} 
          style={styles.logoImage} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    width: '100%',
  },
  bannerContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  logoWrapper: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    marginTop: -40, // Overlap logo on banner
    marginBottom: 12,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
