import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  category: string;
  borrowDate: string;
}

interface HistoryBook extends BorrowedBook {
  returnDate: string;
}

export default function BorrowingScreen() {
  const [currentBorrowed, setCurrentBorrowed] = useState<BorrowedBook[]>([]);
  const [history, setHistory] = useState<HistoryBook[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  useFocusEffect(
    useCallback(() => {
      loadBorrowedBooks();
      loadHistory();
    }, [])
  );

  const loadBorrowedBooks = async () => {
    try {
      const borrowed = await AsyncStorage.getItem('currentBorrowed');
      if (borrowed) {
        setCurrentBorrowed(JSON.parse(borrowed));
      } else {
        setCurrentBorrowed([]);
      }
    } catch (error) {
      console.error('Error loading borrowed books:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('borrowHistory');
      if (historyData) {
        setHistory(JSON.parse(historyData));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleReturnBook = async (book: BorrowedBook) => {
    Alert.alert(
      'Return Book',
      `Are you sure you want to return "${book.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Return',
          onPress: async () => {
            try {
              // Remove from borrowed books
              const borrowed = await AsyncStorage.getItem('borrowedBooks');
              const borrowedBooks = borrowed ? JSON.parse(borrowed) : [];
              const updatedBorrowedBooks = borrowedBooks.filter((id: string) => id !== book.id);
              await AsyncStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));

              // Remove from current borrowed
              const updatedCurrentBorrowed = currentBorrowed.filter(b => b.id !== book.id);
              await AsyncStorage.setItem('currentBorrowed', JSON.stringify(updatedCurrentBorrowed));
              setCurrentBorrowed(updatedCurrentBorrowed);

              // Add to history
              const historyData = await AsyncStorage.getItem('borrowHistory');
              const historyList: HistoryBook[] = historyData ? JSON.parse(historyData) : [];
              historyList.unshift({
                ...book,
                returnDate: new Date().toISOString(),
              });
              await AsyncStorage.setItem('borrowHistory', JSON.stringify(historyList));
              setHistory(historyList);

              Alert.alert('Success', `You have returned "${book.title}"`);
            } catch (error) {
              console.error('Error returning book:', error);
              Alert.alert('Error', 'Failed to return book');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Peminjaman Buku</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
            Sedang Dipinjam ({currentBorrowed.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Riwayat ({history.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'current' ? (
          currentBorrowed.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={80} color="#cbd5e1" />
              <Text style={styles.emptyText}>Belum ada buku yang dipinjam</Text>
              <Text style={styles.emptySubtext}>Pinjam buku dari halaman Library</Text>
            </View>
          ) : (
            currentBorrowed.map((book) => (
              <View key={book.id} style={styles.bookCard}>
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
                    <View style={styles.dateBadge}>
                      <Ionicons name="calendar-outline" size={12} color="#64748b" />
                      <Text style={styles.dateText}>{formatDate(book.borrowDate)}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.returnButton}
                  onPress={() => handleReturnBook(book)}
                >
                  <Ionicons name="return-up-back" size={24} color="#3b82f6" />
                  <Text style={styles.returnButtonText}>Kembalikan</Text>
                </TouchableOpacity>
              </View>
            ))
          )
        ) : (
          history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={80} color="#cbd5e1" />
              <Text style={styles.emptyText}>Belum ada riwayat peminjaman</Text>
              <Text style={styles.emptySubtext}>Riwayat akan muncul setelah mengembalikan buku</Text>
            </View>
          ) : (
            history.map((book, index) => (
              <View key={`${book.id}-${index}`} style={styles.historyCard}>
                <View style={styles.historyIcon}>
                  <Ionicons name="checkmark-circle" size={32} color="#3b82f6" />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <View style={styles.historyDates}>
                    <View style={styles.dateRow}>
                      <Ionicons name="arrow-down-circle-outline" size={14} color="#64748b" />
                      <Text style={styles.historyDateLabel}>Dipinjam: </Text>
                      <Text style={styles.historyDateValue}>{formatDate(book.borrowDate)}</Text>
                    </View>
                    <View style={styles.dateRow}>
                      <Ionicons name="arrow-up-circle-outline" size={14} color="#3b82f6" />
                      <Text style={styles.historyDateLabel}>Dikembalikan: </Text>
                      <Text style={styles.historyDateValue}>{formatDate(book.returnDate)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )
        )}
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
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
    alignItems: 'center',
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
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#64748b',
  },
  returnButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  returnButtonText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },
  historyCard: {
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
  historyIcon: {
    width: 60,
    height: 80,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  historyDates: {
    marginTop: 8,
    gap: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyDateLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  historyDateValue: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '500',
  },
});
