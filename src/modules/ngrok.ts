import { connect } from '@ngrok/ngrok';
import debug from 'debug';

// Initialize debug instance for Ngrok
const ngrokDebug = debug('app:ngrok');

// Load environment variables with default values
const NGROK_ENABLED = process.env.NGROK_ENABLED === 'true';
const NGROK_PORT = process.env.NGROK_PORT || '8080';
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN; // Explicit token handling

ngrokDebug(`NGROK_ENABLED: ${NGROK_ENABLED}`);
ngrokDebug(`NGROK_PORT: ${NGROK_PORT}`);
ngrokDebug(`NGROK_AUTHTOKEN is ${NGROK_AUTHTOKEN ? 'provided' : 'not provided'}`);

if (NGROK_ENABLED) {
    console.log("Ngrok module loaded and executing...");

    (async function setupNgrok() {
        // Guard: Check if the required port is a valid number
        if (isNaN(Number(NGROK_PORT))) {
            const errorMessage = `Invalid NGROK_PORT: ${NGROK_PORT}. Must be a number.`;
            ngrokDebug(errorMessage);
            throw new Error(errorMessage);
        }

        // Guard: Ensure the Ngrok auth token is provided
        if (!NGROK_AUTHTOKEN) {
            const errorMessage = 'Ngrok authtoken is required but not provided.';
            ngrokDebug(errorMessage);
            throw new Error(errorMessage);
        }

        try {
            // Attempt to establish the Ngrok tunnel
            const listener = await connect({
                addr: NGROK_PORT,
                authtoken: NGROK_AUTHTOKEN,
            });

            const url = listener.url();
            ngrokDebug(`Ngrok tunnel successfully established at: ${url}`);
            console.log(`Ngrok tunnel successfully established at: ${url}`);
        } catch (error) {
            // Error handling with detailed logging
            const errorMessage = `Ngrok setup failed: ${error instanceof Error ? error.message : String(error)}`;
            ngrokDebug(errorMessage);
            console.error(errorMessage);
        }
    })();
} else {
    // Ngrok is disabled, log the status
    ngrokDebug('Ngrok is disabled by NGROK_ENABLED environment variable.');
    console.log('Ngrok is disabled.');
}
