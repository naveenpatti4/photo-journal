import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Photo } from '../types';
import { loadPhotos, savePhotos } from '../utils/storage';
import uuid from 'react-native-uuid';

export default function AddPhotoScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission denied', 'Permission to access photos is required!');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const savePhoto = async () => {
    if (!imageUri || !description.trim()) {
      Alert.alert('Oops!', 'Please select a photo and add a description.');
      return;
    }

    const newPhoto: Photo = {
      id: uuid.v4().toString(),
      uri: imageUri,
      description: description.trim(),
      date: new Date().toISOString(),
    };

    try {
      const existingPhotos = await loadPhotos();
      await savePhotos([newPhoto, ...existingPhotos]);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo. Try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Pick a Photo" onPress={pickImage} color="#4a90e2" />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      <TextInput
        placeholder="Add a description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <Button title="Save Photo" onPress={savePhoto} color="#4a90e2" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
    flexGrow: 1,
  },
  preview: {
    width: '100%',
    height: 300,
    marginVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
