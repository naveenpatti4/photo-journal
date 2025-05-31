import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Button,
  Modal,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import PhotoCard from '../components/PhotoCard';
import { useNavigation } from '@react-navigation/native';
import { Photo } from '../types';
import { loadPhotos, savePhotos } from '../utils/storage';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    // Load photos from storage on mount
    loadPhotos().then(setPhotos);
  }, []);

  // Filter photos by description
  const filteredPhotos = photos.filter(p =>
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler to add new photo returned via navigation params or context could be added here.
  // For demo, navigation param method:

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // reload photos each time screen focuses
      loadPhotos().then(setPhotos);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          placeholder="Search photos..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
         <View style={styles.addButton}>
          <Button title="Add New Photo" onPress={() => navigation.navigate('AddPhoto' as never)} color="#4a90e2" />
        </View>
        {filteredPhotos.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No photos found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPhotos}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <PhotoCard
                uri={item.uri}
                description={item.description}
                onPress={() => setSelectedPhoto(item)}
              />
            )}
          />
        )}

        {/* Fullscreen photo modal */}
        <Modal visible={!!selectedPhoto} transparent animationType="fade" onRequestClose={() => setSelectedPhoto(null)}>
          <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.modalCloseArea} onPress={() => setSelectedPhoto(null)} />
            {selectedPhoto && (
              <View style={styles.modalContent}>
                <Image source={{ uri: selectedPhoto.uri }} style={styles.fullscreenPhoto} />
                <Text style={styles.modalDescription}>{selectedPhoto.description}</Text>
                <Button title="Close" onPress={() => setSelectedPhoto(null)} color="#4a90e2" />
              </View>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16
  },
  searchInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 80,
  },
  addButton: {
    marginTop: 12,
    marginBottom: 16,
  },
  noResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  noResultsText: {
    fontSize: 18,
    color: '#999',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  fullscreenPhoto: {
    width: windowWidth - 64,
    height: windowWidth - 64,
    borderRadius: 16,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});
