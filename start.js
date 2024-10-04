module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        path: ".",               // Customize the path if needed
        message: [
          "npm start"             // Run the npm start command for Node.js
        ],
        on: [{
          // Pattern to monitor for "Server running on http://localhost:5004"
          "event": "/Server running on http:\\/\\/localhost:\\d+/",

          // "done": true will move to the next step while keeping the shell alive.
          "done": true
        }]
      }
    }
    // Uncomment and customize the following section if you want to set a local variable (like URL) after the app starts
    /*
    {
      method: "local.set",
      params: {
        // Use the matched event from the previous step to set the URL.
        url: "{{input.event[0]}}"
      }
    }
    */
  ]
};
