import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from "./Book"
import { Route,Link } from "react-router-dom";

class BooksApp extends React.Component {
  state = {
    userInput: "",
    books: [],
    searchBooks: []
  }
  //load default books with className read or want-to-read or currently-reading
  componentDidMount() {
    const books = BooksAPI.getAll();
    books.then(values => {
      let b = [];

      for (const book of values) {
        b.push(book);
      }

      this.setState({
        books: b
      })
    }).catch(error => console.log(error));
  }
  //control components on user input
  handleChange = (e) => {
    this.setState({
      userInput: e.target.value,
    })

    this.searchBooks(e.target.value);
  }
  //search for books according to user input
  searchBooks = (query) => {
    if (query !== "") {
      const search = BooksAPI.search(query);
      search.then(values => {
        let books = [];
        if (values !== undefined) {
          for (const book of values) {
            books.push(book);
          }
        } else {
          throw new Error();
        }

        this.setState({
          searchBooks: books
        })

      }).catch(() => {
        this.clearSearchBooks();
      });
    } else {
      this.clearSearchBooks();
    }
  }
  //change the className of the book
  changeShelf = (e, book) => {
    let newbooks = this.state.books;
    for (const b of newbooks) {
      if (b.id === book.id) {
        b.shelf = e.target.value;
      }
    }

    BooksAPI.update(book, e.target.value);

    this.setState({
      books: newbooks
    })
  }
  
  clearSearchBooks = () => {
    this.setState({
      searchBooks: []
    })
  }

  clearSearch = () => {
    this.setState({
      userInput: "",
      searchBooks: []
    })
  }

  render() {
    //concatenate books and searchBooks properties of the state while removing duplicates
    let allBooks = [];
    allBooks = [...this.state.books]
    for(const book of this.state.searchBooks) {
      if(this.state.books.find(b=> b.id === book.id )){
        //do nothing
      } else {
        allBooks.push(book);
      }
    }
 
    return (
      <div className="app">
        <Route exact path="/" render={()=>
          <div >
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Currently Reading</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">
                      {this.state.books.filter(b => b.shelf === "currentlyReading").map(b=><Book 
                        key={b.id} 
                        book = {b}
                        changeShelf = {this.changeShelf}
                        />)}
                      </ol>
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Want to Read</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">
                        {this.state.books.filter(b => b.shelf === "wantToRead").map(b=><Book 
                          key={b.id} 
                          book = {b}
                          changeShelf = {this.changeShelf}
                          />)}
                      </ol>
                    </div>
                  </div>
                  <div className="bookshelf">
                    <h2 className="bookshelf-title">Read</h2>
                    <div className="bookshelf-books">
                      <ol className="books-grid">
                      {this.state.books.filter(b => b.shelf === "read").map(b=><Book 
                        key={b.id} 
                        book = {b} 
                        changeShelf = {this.changeShelf}
                        />)}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              <div className="open-search">
              <Link to= "/search"><button>Add a book</button></Link>
                
              </div>
            </div>
          </div>
          } />

        <Route exact path="/search" render={()=>
          <div >                
            <div className="search-books">
              <div className="search-books-bar">
                <Link to= "/" onClick={this.clearSearch}><button className="close-search" >Close</button></Link>              
                <div className="search-books-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Search by title or author"
                    value={this.state.userInput}
                    onChange={this.handleChange} 
                    />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                {this.state.searchBooks.length > 0 &&
                  allBooks.map(b=><Book 
                    key={b.id} 
                    book = {b}
                    changeShelf = {this.changeShelf}
                />)}
                {this.state.searchBooks.length === 0 && this.state.userInput !== "" &&
                  <div>No matches. Please try some different terms.</div>}
                </ol>
              </div>
            </div>
          </div>
        } />
      </div>
    )
  }
}

export default BooksApp