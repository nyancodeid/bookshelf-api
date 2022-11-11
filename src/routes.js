const {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
} = require('./handler');

const useRoute = (method, path) => ({
  withHandler(handler) {
    return {
      method,
      path,
      handler,
    };
  },
});

const routes = [
  useRoute('GET', '/books').withHandler(getAllBooksHandler),
  useRoute('GET', '/books/{id}').withHandler(getBooksByIdHandler),
  useRoute('POST', '/books').withHandler(addBookHandler),
  useRoute('PUT', '/books/{id}').withHandler(editBooksByIdHandler),
  useRoute('DELETE', '/books/{id}').withHandler(deleteBooksByIdHandler),
];

module.exports = routes;
