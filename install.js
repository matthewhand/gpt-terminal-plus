module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "npm install",
        ],
        path: "."
      }
    },
    {
      method: "shell.run",
      params: {
        message: [
          "npm run build",
        ],
        path: "."
      }
    }
  ]
}
