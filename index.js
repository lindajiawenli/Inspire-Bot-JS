// FULL DISCLAIMER: I followed a FreeCodeCamp tutorial to make this bot! I only changed some minor things.

const Discord = require("discord.js")
const fetch = require("node-fetch")
const keepRun = require("./server")
const Database = require("@replit/database")

const client = new Discord.Client()
const db = new Database()

const mySecret = process.env['TOKEN']

const invokeKungFuPanda = ["Po", "Tigress", "Monkey", "Viper", "Crane", "Mantis", "Shifu", "Oogway"]

const starterKungFuPandaQuotes = ["'One often meets his destiny on the road he takes to avoid it.' -Master Oogway", 
"'Don't Quit.' -Master Oogway", 
"'You are too concerned with what was and what will be.'' -Master Oogway", 
"'There is a saying: Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.' -Master Oogway", 
"'A real warrior never quits' -Po", 
"'There are no accidents' -Master Oogway", 
"'Look at this tree. I cannot make it blossom when it suits me, nor make it bear fruit before its time. No matter what you do that seed will grow to be a peach tree. You may wish for an apple or an orange, but you will get a peach.' -Master Oogway", 
"'The mark of a true hero is humility.' -Shifu", 
"'There is no secret ingredient. Don't have to. To make something special, you just believe it's special.' -Mr. Ping",
"'You gotta let go of that stuff from the past because it just doesn't matter. The only thing that matters is what you choose to be now.' -Po", 
"'The more you take, the less you have.' -Master Oogway", 
"'There is always something more to learn, even for a master.' -Po", 
"'If you only do what you can do, you will never be more than you are now.' -Shifu", 
"'Sometimes, we do the wrong things for the right reasons.' -Mr. Ping"]

db.get("responding").then(val => {
  if (val == null) {
    db.set("responding", true)
  }
})

db.get("kungFuPandaQuotes").then(kungFuPandaQuotes => {
  if (!kungFuPandaQuotes || kungFuPandaQuotes.length < 1) {
    db.set("kungFuPandaQuotes", starterKungFuPandaQuotes)
  }
})

function updateKFP(KFPquote) {
  db.get("kungFuPandaQuotes").then(kungFuPandaQuotes => {
    kungFuPandaQuotes.push([KFPquote])
    db.set("kungFuPandaQuotes", kungFuPandaQuotes)
  })
}

function deleteKFP(index) {
  db.get("kungFuPandaQuotes").then(kungFuPandaQuotes => {
    if (kungFuPandaQuotes.length > index) {
      kungFuPandaQuotes.splice(index, 1)
      db.set("kungFuPandaQuotes", kungFuPandaQuotes)
    }
  })
}

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
  .then(res => {
    return res.json()
  })
  .then(data => {
    return data[0]["q"] + " -" + data[0]["a"]
  })
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.author.bot) return

  // if a user types **inspire, a random quote from ZenQuotes is generated
  if (msg.content === "**inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  // is this function turned on? If so, get a Kung Fu Panda Quote if a character's name has been invoked
  db.get("responding").then(responding => {
    if (responding && invokeKungFuPanda.some(word => msg.content.includes(word))) {
      db.get("kungFuPandaQuotes").then(kungFuPandaQuotes => {
      const kfpquote = kungFuPandaQuotes[Math.floor (Math.random() * kungFuPandaQuotes.length)]
      msg.reply(kfpquote)
    })
   }
  })
  
  // add a new quote to kungFuPandaQuotes
  if (msg.content.startsWith("**new")) {
    newKFPquote = msg.content.split("**new ")[1]
    updateKFP(newKFPquote)
    msg.channel.send("New Kung Fu Panda quote added")
    }

  // delete some quote in kungFuPandaQuotes
   if (msg.content.startsWith("**del")) {     index = parseInt(msg.content.split("**del ")[1])
     deleteKFP(index)
    msg.channel.send("Kung Fu Panda quote deleted")
    }
  
  // list all quotes in kungFuPandaQuotes
  if (msg.content.startsWith("**list")) {
    db.get("kungFuPandaQuotes").then(kungFuPandaQuotes => {
      msg.channel.send(kungFuPandaQuotes)
    })
  }

  // turning kung fu panda quotes on and off
  if (msg.content.startsWith("**responding")) {
    val = msg.content.split("**responding ")[1]
    if (val.toLowerCase() == "true") {
      db.set("responding", true)
      msg.channel.send("Responding is on.")
    } else {
      db.set("responding", false)
      msg.channel.send("Responding is off.")
    }
  }
})

// before our client logs in, we'll be running our server
keepRun()
client.login(mySecret)