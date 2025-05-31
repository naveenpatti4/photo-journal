import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';

const windowWidth = Dimensions.get('window').width;

type PhotoCardProps = {
  uri: string;
  description: string;
  onPress: () => void;
};

export default function PhotoCard({ uri, description, onPress }: PhotoCardProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image source={{ uri }} style={styles.photo} />
      <Text numberOfLines={2} style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  photo: {
    width: (windowWidth - 48) / 2,
    height: (windowWidth - 48) / 2,
  },
  description: {
    padding: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    minHeight: 48,
  },
});
