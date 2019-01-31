import React, { Component } from 'react';

class Book extends Component {

  render() {

    let className;
    //transform the shelf name into className 
    if(this.props.book.shelf === "currentlyReading") {
      className = "currently-reading";
    } else if(this.props.book.shelf === "wantToRead") {
      className = "want-to-read";
    } else if(this.props.book.shelf === "read") {
      className = "read";
    } else {
      className = "";
    }

    return(
      <li>
        <div className="book">
          <div className="book-top">
            {this.props.book.imageLinks !== undefined && 
              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${this.props.book.imageLinks.thumbnail})` }}></div>}
            {this.props.book.imageLinks === undefined &&
              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: "none" }}></div>}
            <div className={`book-shelf-changer ${className}`}>
              <select onChange = {(e)=>this.props.changeShelf(e, this.props.book)}>
                <option value="move" disabled>Move to...</option>
                <option value="none">None</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
          <div className="book-title">{this.props.book.title}</div>
          <div className="book-authors">{this.props.book.authors}</div>
        </div>
      </li>      
    )
  }
}

export default Book;