const axios = require("axios");
const db = require("../models");

// Defining methods for the googleController

// findAll searches the Google Books API and returns only the entries we haven't already saved

// It also makes sure that the books returned from the API all contain a title, author, link, description, and image
module.exports = {
  findAll: function (req, res) {
    const { query: params } = req;
    console.log(params.q);
    console.log("https://www.googleapis.com/books/v1/volumes?q=" + params.q);
    axios
      .get("https://www.googleapis.com/books/v1/volumes?q=" + params.q)
      .then(results =>
        // console.log(results.data.items);
        results.data.items.filter(
          result =>
            result.volumeInfo.title &&
            result.volumeInfo.infoLink &&
            result.volumeInfo.authors &&
            result.volumeInfo.description &&
            result.volumeInfo.imageLinks
          // result.volumeInfo.imageLinks.thumbnail
        )
      )
      .then(apiBooks => 
        // console.log(apiBooks);
        db.Book.find().then(dbBooks =>
          apiBooks.filter(apiBook =>
            dbBooks.every(dbBook => dbBook.googleId.toString() !== apiBook.id)
          )
        )
      )
      .then(books => res.json(books))
      .catch(err => res.status(422).json(err));
  }
};
