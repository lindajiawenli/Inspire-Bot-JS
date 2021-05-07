const express = require("express")

const server = express()

server.all("/", (req, res) => {
  res.send("Bot is running")
})

function keepRun() {
  server.listen(3000, () => {
    console.log("Server is up and ready")
  })
}

module.exports = keepRun
