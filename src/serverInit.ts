import app from './routeHandlers';

const main = () => {
  app.listen(5004, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:5004');
  });
};

main();
