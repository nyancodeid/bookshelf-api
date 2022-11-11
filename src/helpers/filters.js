const { bookResultMapper } = require('./response');

/**
 * Filtering on Array of Book
 * @param {Array} books
 */
const useFilterOn = (books) => ({
  byName(keyword) {
    const results = books
      .filter((book) => book.name.toLowerCase().includes(keyword.toLowerCase()));

    return results.map((book) => bookResultMapper(book));
  },
  byReadingStatus(isReading) {
    const results = books.filter(
      (book) => book.reading === isReading,
    );

    return results.map((book) => bookResultMapper(book));
  },
  byFinishedStatus(isFinished) {
    const results = books.filter(
      (book) => book.finished === isFinished,
    );

    return results.map((book) => bookResultMapper(book));
  },
});

module.exports = {
  useFilterOn,
};
