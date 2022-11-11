const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const useServer = ({ port }) => Hapi.server({
  port,
  host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});

const init = async () => {
  const server = useServer({ port: 5000 });

  server.route(routes);

  await server.start();
  console.log(`Server Running on Port :${server.info.port}`);
};

init();
