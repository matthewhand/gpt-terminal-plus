import { Router } from 'express';
// import { ServerConfigManager } from '../managers/ServerConfigManager';
// import { getSelectedServer } from '../utils/GlobalStateHelper';
import debug from 'debug';

const log = debug('server-routes');
const router = Router();

// Define your routes here
router.get('/some-route', (req, res) => {
  res.send('Hello World');
});

router.post('/set-server', (req, res) => {
  const { server } = req.body;
  // Assuming there is logic to check if the server is in the list
  if (!isServerInList(server)) {
    log('Server not in predefined list: ' + server);
    return res.status(500).json({
      message: `Error retrieving system info for server: ${server}`,
      error: 'Server not in predefined list.',
    });
  }
  // Other logic...
});

// Other routes...

function isServerInList(server: string): boolean {
  // Implement the logic to check if the server is in the list
  return false; // Example logic
}

export default router;
