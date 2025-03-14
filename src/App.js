import React, { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';

export default function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  // Fetch book data from useBookSearch
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  // 🔹 Add Debugging Logs to Check Data
  console.log('📚 Books:', books);
  console.log('🔄 Loading:', loading);
  console.log('⚠️ Error:', error);
  console.log('📖 Has More:', hasMore);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log('🔄 Fetching more books...');
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      
      {/* 🔹 Debug: Show Message if No Books */}
      {books.length > 0 ? (
        books.map((book, index) => {
          if (books.length === index + 1) {
            return (
              <div ref={lastBookElementRef} key={book}>
                {book}
              </div>
            );
          } else {
            return <div key={book}>{book}</div>;
          }
        })
      ) : (
        <p>🔍 No books found.</p>
      )}
      
      <div>{loading && '⏳ Loading...'}</div>
      <div>{error && '❌ Error fetching books'}</div>
    </>
  );
}


