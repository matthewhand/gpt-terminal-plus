module.exports = {
    run: [
      // Edit this step to customize the git repository to use
      // {
      //   method: "shell.run",
      //   params: {
      //     message: [
      //       "git clone https://github.com/matthewhand/gpt-terminal-plus app",
      //     ]
      //   }
      // },
      // // Delete this step if your project does not use torch
      // {
      //   method: "script.start",
      //   params: {
      //     uri: "torch.js",
      //     params: {
      //       venv: "env",                // Edit this to customize the venv folder path
      //       path: "app",                // Edit this to customize the path to start the shell from
      //       // xformers: true   // uncomment this line if your project requires xformers
      //     }
      //   }
      // },
      // Edit this step with your custom install commands
      {
        method: "shell.run",
        params: {
          venv: "env",                // Edit this to customize the venv folder path
          path: ".",                // Edit this to customize the path to start the shell from
          message: [
            
          ]
        }
      },

      {
        "method": "shell.run",
        "params": {
          "message": [
            "npm install",
          ],
          "path": "."
        }
      },

      {
        "method": "shell.run",
        "params": {
          "message": [
            "npm run build",
          ],
          "path": "."
        }
      }

    ]
  }