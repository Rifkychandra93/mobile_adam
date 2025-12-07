import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
}

export default function BookDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    loadBookData();
  }, []);

  const loadBookData = async () => {
    try {
      // Parse book data from params
      const bookData: Book = {
        id: params.id as string,
        title: params.title as string,
        author: params.author as string,
        category: params.category as string,
        available: params.available === 'true',
      };
      setBook(bookData);
      
      // Check if book is borrowed
      const borrowed = await AsyncStorage.getItem('borrowedBooks');
      if (borrowed) {
        const borrowedIds = JSON.parse(borrowed);
        setIsAvailable(!borrowedIds.includes(bookData.id));
      }
    } catch (error) {
      console.error('Error loading book:', error);
    }
  };

  const handleBorrowBook = async () => {
    if (!book) return;

    if (!isAvailable) {
      Alert.alert('Tidak Tersedia', 'Buku ini sedang Anda pinjam.');
      return;
    }

    Alert.alert(
      'Pinjam Buku',
      `Yakin ingin meminjam "${book.title}"?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Pinjam',
          onPress: async () => {
            try {
              const borrowed = await AsyncStorage.getItem('borrowedBooks');
              const borrowedBooks = borrowed ? JSON.parse(borrowed) : [];
              
              const currentBorrowed = await AsyncStorage.getItem('currentBorrowed');
              const currentBorrowedList = currentBorrowed ? JSON.parse(currentBorrowed) : [];
              
              borrowedBooks.push(book.id);
              currentBorrowedList.push({
                ...book,
                borrowDate: new Date().toISOString(),
              });
              
              await AsyncStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
              await AsyncStorage.setItem('currentBorrowed', JSON.stringify(currentBorrowedList));
              
              setIsAvailable(false);
              
              Alert.alert('Berhasil', `Anda telah meminjam "${book.title}"`, [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error('Error borrowing book:', error);
              Alert.alert('Error', 'Gagal meminjam buku');
            }
          },
        },
      ]
    );
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Buku</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Buku</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bookCover}>
          <View style={styles.coverIcon}>
            <Ionicons name="book" size={80} color="#6366f1" />
          </View>
        </View>

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>oleh {book.author}</Text>
          
          <View style={styles.badges}>
            <View style={styles.categoryBadge}>
              <Ionicons name="pricetag" size={16} color="#1e40af" />
              <Text style={styles.categoryText}>{book.category}</Text>
            </View>
            
            <View style={[styles.statusBadge, isAvailable ? styles.availableBadge : styles.borrowedBadge]}>
              <Ionicons 
                name={isAvailable ? "checkmark-circle" : "close-circle"} 
                size={16} 
                color={isAvailable ? "#065f46" : "#991b1b"} 
              />
              <Text style={[styles.statusText, isAvailable ? styles.availableText : styles.borrowedText]}>
                {isAvailable ? 'Tersedia' : 'Sedang Dipinjam'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang Buku</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Penulis</Text>
                <Text style={styles.infoValue}>{book.author}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Ionicons name="albums-outline" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Kategori</Text>
                <Text style={styles.infoValue}>{book.category}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{isAvailable ? 'Tersedia untuk dipinjam' : 'Sedang Anda pinjam'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              {book.title} adalah karya luar biasa dari {book.author}. 
              Buku ini termasuk dalam kategori {book.category} dan menjadi salah satu koleksi favorit di perpustakaan kami. 
              {'\n\n'}
              Buku ini sangat direkomendasikan untuk Anda yang menyukai literatur berkualitas dengan cerita yang menarik dan penuh makna.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.borrowButton, !isAvailable && styles.borrowButtonDisabled]}
          onPress={handleBorrowBook}
          disabled={!isAvailable}
        >
          <Ionicons 
            name={isAvailable ? "add-circle" : "checkmark-circle"} 
            size={24} 
            color="#ffffff" 
          />
          <Text style={styles.borrowButtonText}>
            {isAvailable ? 'Pinjam Buku' : 'Sudah Dipinjam'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  bookCover: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
  },
  coverIcon: {
    width: 200,
    height: 280,
    backgroundColor: '#eef2ff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  bookInfo: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  bookTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  availableBadge: {
    backgroundColor: '#d1fae5',
  },
  borrowedBadge: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  availableText: {
    color: '#065f46',
  },
  borrowedText: {
    color: '#991b1b',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  descriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  borrowButton: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  borrowButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowColor: '#9ca3af',
  },
  borrowButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
