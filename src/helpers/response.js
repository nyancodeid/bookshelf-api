/**
 * @typedef {import('@hapi/hapi').ResponseToolkit} ResponseToolkit
 */

/**
 * Response helper
 * @param {ResponseToolkit} res
 * @param {number} code HTTP Code
 * @returns {ResponseObject}
 */
const Response = (res, code = 200) => ({
  success(data) {
    return res.response({
      status: 'success',
      ...data,
    }).code(code);
  },
  fail(data) {
    return res.response({
      status: 'fail',
      ...data,
    }).code(code);
  },
  error(data) {
    return res.response({
      status: 'error',
      ...data,
    }).code(code);
  },
});

const bookResultMapper = (book) => ({
  id: book.id,
  name: book.name,
  publisher: book.publisher,
});

module.exports = {
  response: Response,
  bookResultMapper,
};
