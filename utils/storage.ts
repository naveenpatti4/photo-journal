import AsyncStorage from '@react-native-async-storage/async-storage';
import { Photo } from '../types';

const PHOTOS_KEY = 'PHOTO_JOURNAL_PHOTOS';

export async function savePhotos(photos: Photo[]) {
  try {
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  } catch (error) {
    console.error('Failed to save photos:', error);
  }
}

export async function loadPhotos(): Promise<Photo[]> {
  try {
    const data = await AsyncStorage.getItem(PHOTOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load photos:', error);
    return [];
  }
}
