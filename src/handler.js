const { v4: uuid } = require('uuid');
const books = require('./books');

/**
 * @typedef {import('@hapi/hapi').Request} Request
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 * @typedef {import('@hapi/hapi').ResponseObject} ResponseObject
 */

/**
 * Response helper
 * @param {ResponseToolkit} h
 * @param {number} code HTTP Code
 * @returns {ResponseObject}
 */
const Response = (h, code = 200) => {
  const response = h;

  return {
    success(data) {
      return response.response({
        status: 'success',
        ...data,
      }).code(code);
    },
    fail(data) {
      return response.response({
        status: 'fail',
        ...data,
      }).code(code);
    },
    error(data) {
      return response.response({
        status: 'error',
        ...data,
      }).code(code);
    },
  };
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
    return Response(h, 400)
      .fail({
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
  }

  if (readPage > pageCount) {
    return Response(h, 400)
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

  const isSuccess = !!books.get(id);

  if (isSuccess) {
    return Response(h, 201).success({
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
  }

  return Response(h, 500).error({
    message: 'Buku gagal ditambahkan',
  });
};

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
    const keyword = name.toLowerCase();
    const results = items
      .filter((book) => book.name.toLowerCase().includes(keyword));

    return Response(h).success({
      data: {
        books: results.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  }

  if (reading !== undefined) {
    const isReading = !!Number(reading);
    const results = items.filter(
      (book) => book.reading === isReading,
    );

    return Response(h).success({
      data: {
        books: results.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  }

  if (finished !== undefined) {
    const isFinished = !!Number(finished);
    const results = items.filter(
      (book) => book.finished === isFinished,
    );

    return Response(h).success({
      data: {
        books: results.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  }

  return Response(h).success({
    data: {
      books: items.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
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

  if (book) {
    return Response(h).success({ data: { book } });
  }

  return Response(h, 404).fail({ message: 'Buku tidak ditemukan' });
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
    return Response(h, 400)
      .fail({ message: 'Gagal memperbarui buku. Mohon isi nama buku' });
  }

  if (readPage > pageCount) {
    return Response(h, 400)
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

    return Response(h)
      .success({ message: 'Buku berhasil diperbarui' });
  }

  return Response(h, 404)
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

    return Response(h)
      .success({ message: 'Buku berhasil dihapus' });
  }

  return Response(h, 404)
    .fail({ message: 'Buku gagal dihapus. Id tidak ditemukan' });
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
