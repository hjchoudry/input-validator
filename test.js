const checkInputs = require('./index')
const input = {
    username: "",
    password: "",
    key: {
        user: "",
        email: ""
    }
}

const requirement = ["email", "password", "username"]

console.log(checkInputs({ input, requirement }))