const checkInputs = require('./index')
const input = {
    username: "u1",
}
const requirement = ["username"]
console.log(checkInputs({ input, requirement }))