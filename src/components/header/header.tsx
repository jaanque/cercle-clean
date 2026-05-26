import React from 'react';
import { StyleSheet, View } from 'react-native';
import ProfileButton from './profile-button';
import SearchBar from './search-bar';

export default function Header() {
  return (
    <View style={styles.container}>
      <ProfileButton />
      <SearchBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
