'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { searchCards } from '@/lib/services/pokemonService';
import { PokemonCard } from '@/types/pokemon';
import { addCommunityRequest, hasUserRequested } from '@/lib/services/communityRequestService';
import { MagnifyingGlass, Spinner, Plus, Check } from '@phosphor-icons/react';
import Modal from '@/components/Modal';

export default function SearchCards() {
  // Use session ID instead of wallet address
  const [userId, setUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [allCards, setAllCards] = useState<PokemonCard[]>([]); // Store all cards
  const [filteredCards, setFilteredCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true); // Start true to load cards on mount
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [requestedCards, setRequestedCards] = useState<Set<string>>(new Set());
  const [requestingCard, setRequestingCard] = useState<string | null>(null);
  
  // Filter states
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<string>('none');
  
  // Modal states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletError, setWalletError] = useState('');
  
  // Real-time notifications
  const [realtimeNotification, setRealtimeNotification] = useState<string>('');

  // Generate or retrieve user ID on mount
  useEffect(() => {
    let id = localStorage.getItem('guestUserId');
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guestUserId', id);
    }
    setUserId(id);
  }, []);

  // Load all cards from Firebase on mount
  useEffect(() => {
    const loadAllCards = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, getDocs } = await import('firebase/firestore');
        
        const cardsRef = collection(db, 'allPokemonCards');
        const snapshot = await getDocs(cardsRef);
        
        if (!snapshot.empty) {
          const allCardsData = snapshot.docs.map(doc => doc.data() as PokemonCard);
          setAllCards(allCardsData);
          setCards(allCardsData); // Show all cards initially
          setFilteredCards(allCardsData);
          setTotalCount(allCardsData.length);
        }
      } catch (err) {
        console.error('Error loading cards:', err);
        setError('Could not load cards from database');
      } finally {
        setLoading(false);
      }
    };

    loadAllCards();
  }, []);

  // Real-time listener for pool joins - runs for ALL users
  useEffect(() => {
    if (!userId) return;
    
    const setupRealtimeListener = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const { collection, onSnapshot } = await import('firebase/firestore');
        
        const poolsRef = collection(db, 'communityRequests');
        
        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(poolsRef, (snapshot) => {
          // Update requestedCards state for current user
          if (userId) {
            const userPools = new Set<string>();
            snapshot.docs.forEach(doc => {
              const data = doc.data();
              if (data.requestedBy?.includes(userId)) {
                // Use cardId (the Pokemon card ID) not doc.id (Firestore document ID)
                userPools.add(data.cardId);
              }
            });
            setRequestedCards(userPools);
          }
          
          // Show notifications for ALL users (both authenticated and non-authenticated)
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const data = change.doc.data();
              const cardData = data.cardData;
              const requesters = data.requestedBy || [];
              const newCount = requesters.length;
              
              // Helper function to shorten address
              const shortenAddress = (address: string) => {
                if (!address) return '';
                return `${address.slice(0, 4)}...${address.slice(-4)}`;
              };
              
              // Only show notification if there are requesters (avoid initial load spam)
              if (newCount > 0 && change.type === 'modified') {
                // Get the most recent joiner (last in array)
                const latestJoiner = requesters[requesters.length - 1];
                const shortAddr = shortenAddress(latestJoiner);
                setRealtimeNotification(`${shortAddr} joined the ${cardData.name} pool! (${newCount} members)`);
                setTimeout(() => setRealtimeNotification(''), 5000);
              } else if (change.type === 'added' && newCount > 0) {
                const firstJoiner = requesters[0];
                const shortAddr = shortenAddress(firstJoiner);
                setRealtimeNotification(`${shortAddr} created pool for ${cardData.name}! (${newCount} member)`);
                setTimeout(() => setRealtimeNotification(''), 5000);
              }
            }
          });
        });
        
        return unsubscribe;
      } catch (err) {
        console.error('Error setting up real-time listener:', err);
      }
    };

    const unsubscribeProm = setupRealtimeListener();
    
    return () => {
      unsubscribeProm?.then(unsub => unsub?.());
    };
  }, [userId]);

  // Apply filters whenever cards, rarity, or price sort changes
  useEffect(() => {
    let filtered = [...cards];
    
    // Filter by rarity
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(card => card.rarity === selectedRarity);
    }
    
    // Sort by price
    if (priceSort !== 'none') {
      filtered.sort((a, b) => {
        const priceA = a.tcgplayer?.prices?.holofoil?.market || 
                      a.tcgplayer?.prices?.normal?.market || 
                      a.tcgplayer?.prices?.reverseHolofoil?.market || 0;
        const priceB = b.tcgplayer?.prices?.holofoil?.market || 
                      b.tcgplayer?.prices?.normal?.market || 
                      b.tcgplayer?.prices?.reverseHolofoil?.market || 0;
        
        return priceSort === 'high' ? priceB - priceA : priceA - priceB;
      });
    }
    
    setFilteredCards(filtered);
  }, [cards, selectedRarity, priceSort]);

  // Get unique rarities from current cards
  const rarities = Array.from(new Set(cards.map(card => card.rarity).filter(Boolean))).sort();

  const handleOpenRequestModal = async (card: PokemonCard) => {
    setSelectedCard(card);
    setShowRequestModal(true);
    setSuccessMessage('');
    setWalletAddress('');
    setWalletError('');
  };

  // Validate Solana wallet address
  const validateSolanaAddress = (address: string): boolean => {
    // Solana addresses are base58 encoded and typically 32-44 characters
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressRegex.test(address.trim());
  };

  const handleConfirmRequest = async () => {
    if (!selectedCard) return;

    // Validate wallet address
    const trimmedAddress = walletAddress.trim();
    if (!trimmedAddress) {
      setWalletError('Please enter your Solana wallet address');
      return;
    }

    if (!validateSolanaAddress(trimmedAddress)) {
      setWalletError('Invalid Solana wallet address format');
      return;
    }

    setIsProcessing(true);
    setWalletError('');
    
    try {
      // Check if this wallet has already joined this pool
      const { db } = await import('@/lib/firebase');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      
      const requestsRef = collection(db, 'communityRequests');
      const q = query(requestsRef, where('cardId', '==', selectedCard.id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const existingData = querySnapshot.docs[0].data();
        const requestedBy = existingData.requestedBy || [];
        
        if (requestedBy.includes(trimmedAddress)) {
          setWalletError('This wallet address has already joined this pool');
          setIsProcessing(false);
          return;
        }
      }

      // Add to community requests with the wallet address
      const result = await addCommunityRequest(
        selectedCard.id,
        selectedCard,
        trimmedAddress
      );
      
      if (result.success) {
        setRequestedCards(prev => new Set(prev).add(selectedCard.id));
        setSuccessMessage(`Successfully joined the pool with wallet ${trimmedAddress.slice(0, 4)}...${trimmedAddress.slice(-4)}!`);
        setShowRequestModal(false);
        setWalletAddress('');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        if (result.message) {
          setWalletError(result.message);
        } else {
          setShowRequestModal(false);
        }
      }
    } catch (error) {
      console.error('Error processing request:', error);
      setWalletError('Failed to join pool. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async () => {
    // If search is empty, show all Firebase cards again
    if (!searchQuery.trim()) {
      setCards(allCards);
      setTotalCount(allCards.length);
      setHasSearched(false);
      // Reset filters when clearing search
      setSelectedRarity('all');
      setPriceSort('none');
      return;
    }
    
    setLoading(true);
    setError('');
    setHasSearched(true);
    // Reset filters when starting new search
    setSelectedRarity('all');
    setPriceSort('none');
    
    try {
      // Always use API for search
      const response = await fetch(`/api/pokemon/search?name=${encodeURIComponent(searchQuery)}&pageSize=50`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      setCards(result.data || []);
      setTotalCount(result.totalCount || (result.data?.length || 0));
      console.log('API Response:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search cards. Check console for details.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Real-time Notification Banner */}
      {realtimeNotification && (
        <div className="bg-blue-600 text-white py-2 px-6 text-center text-sm font-semibold animate-fade-in">
          {realtimeNotification}
        </div>
      )}
      
      <main className="mx-auto max-w-7xl px-6 py-6">
        {/* Header with Search */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Card Sets</h1>
            <p className="text-sm text-gray-500">
              {totalCount.toLocaleString()} cards 
              {hasSearched && ` • Search results for "${searchQuery}"`}
              {selectedRarity !== 'all' && ` • ${selectedRarity}`}
              {priceSort !== 'none' && ` • Sorted by price (${priceSort === 'high' ? 'high to low' : 'low to high'})`}
            </p>
          </div>
          
          {/* Compact Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, set, or ID..."
              className="w-72 pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={handleSearch}
              disabled={loading && hasSearched}
              className="absolute right-2 p-1 text-gray-600 hover:text-gray-900 transition-colors disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading && hasSearched ? (
                <Spinner size={20} className="animate-spin" />
              ) : (
                <MagnifyingGlass size={20} weight="bold" />
              )}
            </button>
          </div>
        </div>
        
        {/* Search Status/Error Messages */}
        {loading && hasSearched && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex items-center gap-2">
            <Spinner size={16} className="animate-spin" />
            <span>Searching Pokemon TCG API... this may take a moment</span>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-semibold">
            {successMessage}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Rarity:</label>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <option value="all">All</option>
              {rarities.map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Price:</label>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <option value="none">No Sort</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500 ml-auto">
            Showing {filteredCards.length} of {cards.length} cards
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCards.map((card) => {
            const prices = card.tcgplayer?.prices;
            const price = prices?.holofoil?.market || 
                         prices?.normal?.market || 
                         prices?.reverseHolofoil?.market ||
                         prices?.['1stEditionHolofoil']?.market ||
                         prices?.['1stEditionNormal']?.market ||
                         prices?.['1stEdition']?.market ||
                         prices?.unlimited?.market ||
                         0;

            return (
              <div 
                key={card.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col overflow-hidden cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={card.images.small} 
                    alt={card.name}
                    className="w-full rounded-t-xl"
                  />
                  {card.hp && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                      {card.hp} HP
                    </div>
                  )}
                </div>
                
                <div className="p-3 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 truncate" title={card.name}>
                    {card.name}
                  </h3>
                  
                  <div className="text-xs text-gray-600 space-y-1 mb-2">
                    <p className="truncate font-medium" title={card.set.name}>
                      {card.set.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">#{card.number || 'N/A'}</span>
                      {card.rarity && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {card.rarity}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">Market Price:</span>
                      <span className="text-sm font-bold text-green-600">
                        {price > 0 ? `$${price.toFixed(2)}` : 'N/A'}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRequestModal(card);
                      }}
                      disabled={requestedCards.has(card.id)}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        requestedCards.has(card.id)
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                          : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md active:scale-95 cursor-pointer'
                      } disabled:opacity-50`}
                    >
                      {requestedCards.has(card.id) ? (
                        <span>Joined</span>
                      ) : (
                        <>
                          <Plus size={14} weight="bold" />
                          <span>Join Pool</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && cards.length === 0 && hasSearched && (
          <div className="text-center py-12">
            <p className="text-gray-500">No cards found for "{searchQuery}"</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-500">Loading cards...</p>
          </div>
        )}

        <Modal 
          isOpen={showRequestModal} 
          onClose={() => setShowRequestModal(false)} 
          onSubmit={handleConfirmRequest}
          title="Join Acquisition Pool"
          subtitle="Enter your Solana wallet address to join this pool and receive rewards when the card is acquired."
          buttonText="Join Pool"
          processingText="Processing..."
          isCreating={isProcessing}
        >
          {selectedCard && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <img 
                  src={selectedCard.images.small} 
                  alt={selectedCard.name}
                  className="w-20 h-auto rounded-lg shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 mb-1 truncate">{selectedCard.name}</h3>
                  <p className="text-xs text-gray-600 truncate">{selectedCard.set.name}</p>
                  {selectedCard.rarity && (
                    <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {selectedCard.rarity}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Solana Wallet Address *
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setWalletError('');
                  }}
                  placeholder="Enter your Solana wallet address (e.g., 7xKXtg2CW87d...)"
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    walletError 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {walletError && (
                  <p className="mt-1 text-xs text-red-600">{walletError}</p>
                )}
                {!walletError && (
                  <p className="mt-1 text-xs text-gray-500">
                    This wallet will receive rewards when the pool acquisition is complete
                  </p>
                )}
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
