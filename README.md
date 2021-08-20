# input-validator

# This function checks input value,

# input should be a object;

const input = {
username: "",
password: "",
key: {
user: "",
email: ""
}
}

# requirement can be array object, string

# requirement as array of strings only

const requirement = ["email", "password", "username"]

# requirement as array of object and strings

const requirement = [
"password",
{
name: "username"
required: true,
minLength: 5,
maxLength: 10,
regex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
type: "string"
},
]

# requirement as object with object and array

const requirement = {
defaultRegex: /\(_.\^_.\$_._.\(/i;
fields:[
"password",
{
name: "password"
required: false,
}
]
}

# requirement as object with these properties only

# name string only

# required string and boolean only

# minLength number only

# maxLength number only

# regex regex only

# type can be one of the following:

'number', 'string', 'boolean', 'null', 'undefined', 'object', 'symbol';
