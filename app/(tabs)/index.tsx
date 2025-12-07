import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      category: 'Fiction',
      available: true,
    },
    {
      id: '2',
      title: '1984',
      author: 'George Orwell',
      category: 'Fiction',
      available: true,
    },
    {
      id: '3',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      category: 'Fiction',
      available: true,
    },
    {
      id: '4',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      category: 'Romance',
      available: true,
    },
    {
      id: '5',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      category: 'Fiction',
      available: true,
    },
    {
      id: '6',
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling',
      category: 'Fantasy',
      available: true,
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
      loadBorrowedBooks();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setUserName(user.fullName);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadBorrowedBooks = async () => {
    try {
      const borrowed = await AsyncStorage.getItem('borrowedBooks');
      if (borrowed) {
        const borrowedIds = JSON.parse(borrowed);
        setBooks(prevBooks =>
          prevBooks.map(book => ({
            ...book,
            available: !borrowedIds.includes(book.id),
          }))
        );
      }
    } catch (error) {
      console.error('Error loading borrowed books:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('currentUser');
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{userName || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={32} color="#3b82f6" />
          <Text style={styles.statNumber}>{books.length}</Text>
          <Text style={styles.statLabel}>Total Books</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={32} color="#60a5fa" />
          <Text style={styles.statNumber}>{books.filter(b => b.available).length}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={32} color="#93c5fd" />
          <Text style={styles.statNumber}>{books.filter(b => !b.available).length}</Text>
          <Text style={styles.statLabel}>Borrowed</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Books</Text>
        <Ionicons name="library-outline" size={24} color="#3b82f6" />
      </View>

      <ScrollView style={styles.booksList} showsVerticalScrollIndicator={false}>
        {books.map((book) => (
          <TouchableOpacity 
            key={book.id} 
            style={styles.bookCard}
            onPress={() => router.push({
              pathname: '/book-detail',
              params: {
                id: book.id,
                title: book.title,
                author: book.author,
                category: book.category,
                available: book.available.toString(),
              },
            })}
            activeOpacity={0.7}
          >
            <View style={styles.bookIcon}>
              <Ionicons name="book" size={32} color="#3b82f6" />
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <View style={styles.bookMeta}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{book.category}</Text>
                </View>
                <View style={[styles.statusBadge, book.available ? styles.availableBadge : styles.borrowedBadge]}>
                  <Text style={[styles.statusText, book.available ? styles.availableText : styles.borrowedText]}>
                    {book.available ? 'Available' : 'Borrowed'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.arrowIcon}>
              <Ionicons name="chevron-forward" size={24} color="#64748b" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  booksList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookIcon: {
    width: 60,
    height: 80,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availableBadge: {
    backgroundColor: '#bfdbfe',
  },
  borrowedBadge: {
    backgroundColor: '#e0e7ff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  availableText: {
    color: '#1e40af',
  },
  borrowedText: {
    color: '#3730a3',
  },
  arrowIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
  },
});
