const { v4: uuid } = require('uuid');
const books = require('./books');
const { useFilterOn } = require('./helpers/filters');
const { response, bookResultMapper } = require('./helpers/response');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */

/**
 * Get All Books Handler
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns {ResponseObject}
 */
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  const items = Array.from(books.values());

  if (name !== undefined) {
    const filtered = useFilterOn(items).byName(name);

    return response(h).success({
      data: {
        books: filtered,
      },
    });
  }

  if (reading !== undefined) {
    const isReading = !!Number(reading);
    const filtered = useFilterOn(items).byReadingStatus(isReading);

    return response(h).success({
      data: {
        books: filtered,
      },
    });
  }

  if (finished !== undefined) {
    const isFinished = !!Number(finished);
    const filtered = useFilterOn(items).byFinishedStatus(isFinished);

    return response(h).success({
      data: {
        books: filtered,
      },
    });
  }

  return response(h).success({
    data: {
      books: items.map((book) => bookResultMapper(book)),
    },
  });
};

/**
 * Get Books by ID Handler
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns {ResponseObject}
 */
const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.get(id);

  if (book) return response(h).success({ data: { book } });

  return response(h, 404).fail({ message: 'Buku tidak ditemukan' });
};

/**
 * Add Book Handler
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns {ResponseObject}
 */
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = uuid();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    return response(h, 400)
      .fail({
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
  }

  if (readPage > pageCount) {
    return response(h, 400)
      .fail({
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
  }

  const book = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.set(id, book);

  const isSuccess = Boolean(books.get(id));

  if (isSuccess) {
    return response(h, 201).success({
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
  }

  return response(h, 500).error({
    message: 'Buku gagal ditambahkan',
  });
};

/**
 * Edit Books by ID Handler
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns {ResponseObject}
 */
const editBooksByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const book = books.get(id);

  if (name === undefined) {
    return response(h, 400)
      .fail({ message: 'Gagal memperbarui buku. Mohon isi nama buku' });
  }

  if (readPage > pageCount) {
    return response(h, 400)
      .fail({ message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' });
  }

  if (book) {
    books.set(id, {
      ...book,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    });

    return response(h)
      .success({ message: 'Buku berhasil diperbarui' });
  }

  return response(h, 404)
    .fail({ message: 'Gagal memperbarui buku. Id tidak ditemukan' });
};

/**
 * Delete Books by ID Handler
 * @param {Request} request
 * @param {ResponseToolkit} h
 * @returns {ResponseObject}
 */
const deleteBooksByIdHandler = (request, h) => {
  const { id: bookId } = request.params;
  const book = books.has(bookId);

  if (book) {
    books.delete(bookId);

    return response(h)
      .success({ message: 'Buku berhasil dihapus' });
  }

  return response(h, 404)
    .fail({ message: 'Buku gagal dihapus. Id tidak ditemukan' });
};

module.exports = {
  getAllBooksHandler,
  getBooksByIdHandler,
  addBookHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
