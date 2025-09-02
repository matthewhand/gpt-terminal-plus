import express, { Request, Response } from 'express';
import { checkAuthToken } from '../middlewares/checkAuthToken';
import { convictConfig } from '../config/convictConfig';

const router = express.Router();

// Apply authentication to all setup routes
router.use(checkAuthToken as any);

/**
 * GET /setup/policy - Policy configuration page
 */
router.get('/policy', (req: Request, res: Response) => {
  const cfg = convictConfig();
  const confirmRegex = cfg.get('safety.confirmRegex') || '';
  const denyRegex = cfg.get('safety.denyRegex') || '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Safety Policy Configuration</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 8px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>Safety Policy</h1>
    <form method="POST" action="/setup/policy">
        <div class="form-group">
            <label for="confirmRegex">Confirm Regex:</label>
            <input type="text" id="confirmRegex" name="confirmRegex" value="${confirmRegex}" placeholder="Regex pattern for commands requiring confirmation">
        </div>
        <div class="form-group">
            <label for="denyRegex">Deny Regex:</label>
            <input type="text" id="denyRegex" name="denyRegex" value="${denyRegex}" placeholder="Regex pattern for denied commands">
        </div>
        <button type="submit">Save Policy</button>
    </form>
</body>
</html>
  `;
  res.send(html);
});

/**
 * POST /setup/policy - Update policy configuration
 */
router.post('/policy', (req: Request, res: Response) => {
  const { confirmRegex, denyRegex } = req.body;

  // In a real implementation, this would update the config
  // For now, just redirect back
  res.redirect('/setup/policy');
});

/**
 * GET /setup - Main setup page
 */
router.get('/', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup</title>
</head>
<body>
    <h1>Setup</h1>
    <ul>
        <li><a href="/setup/policy">Safety Policy</a></li>
        <li><a href="/setup/local">Local Configuration</a></li>
        <li><a href="/setup/ssh">SSH Configuration</a></li>
    </ul>
</body>
</html>
  `;
  res.send(html);
});

/**
 * GET /setup/local - Local configuration page
 */
router.get('/local', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Local Configuration</title>
</head>
<body>
    <h1>Local Configuration</h1>
    <p>Local server configuration options would go here.</p>
</body>
</html>
  `;
  res.send(html);
});

/**
 * GET /setup/ssh - SSH configuration page
 */
router.get('/ssh', (req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSH Configuration</title>
</head>
<body>
    <h1>SSH Configuration</h1>
    <p>SSH server configuration options would go here.</p>
</body>
</html>
  `;
  res.send(html);
});

export default router;