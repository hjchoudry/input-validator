import checkInputs from './index.js'

const input = {
    username: "k",
    name: ''
}
const requirement = ["username", "name"]
console.log(checkInputs({ input, requirement }))