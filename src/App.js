import './css/App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import * as Operation from './util/BooksAPI';
import { useState, useEffect } from 'react';
import Search from './Pages/Search';
import MyReads from './Pages/MyReads';
import About from './Pages/About';


function App() {
  const [Searched, setSearched] = useState([]);
  const [Books, setBooks] = useState([]);
  const [BookID, setBookID] = useState('');

  const onChangeShelf = async (shelf, bookObj, exist) => {
    if (exist) {
      const book = Books.filter((b) => b['id'] === bookObj['id']);
      const updatedBooks = Books.filter((b) => b['id'] !== bookObj['id']);
      book[0]['shelf'] = shelf;
      setBooks([...updatedBooks, ...book]);
    } else {
      setBooks([...Books, bookObj]);
    }
    Operation.update(bookObj, shelf);
  };

  const onHandleSearch = async (query) => {
    if (query.trim() !== '') {
      // make sure the query doesn't fully consist of spaces
      const books = await Operation.search(query);
      if (books.length !== undefined) {
        // make sure that there is a serach results before updating
        setSearched([...books]);
      } else {
        // else Searched = []
        setSearched([]);
      }
    } else {
      // else Searched = []
      setSearched([]);
    }
  };

  const onHandleLookup = (BookID) => {
    setBookID(BookID);
  };

 /* const logout = () => {
    localStorage.token = Math.random().toString(36).substring(-8);
  };*/

  useEffect(() => {
    let mounted = true;

    const getBooks = async () => {
      const books = await Operation.getAll();
      if (mounted) {
        setBooks(books);
      }
    };

    // Make sure that user is authenticated first before data fetching
    //   localStorage.loggedIn === 'true' && getBooks();
   getBooks();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/search"
        element={
          <Search
            booksSearched={Searched}
            existingBooks={Books}
            onHandleSearch={onHandleSearch}
            onChangeShelf={onChangeShelf}
            onHandleLookup={onHandleLookup}
          />
        }
      />
      <Route
        exact
        path="/"
        element={
          <MyReads
            Books={Books}
            onChangeShelf={onChangeShelf}
            onHandleLookup={onHandleLookup}
          />
        }
      />
    </Routes>
  );
}

export default App;