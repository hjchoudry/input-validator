# Input validator
## This function checks input value and match the given requirements

## Installation
Use the package manager [npm](https://docs.npmjs.com/getting-started) to install Input check validator.

```bash
npm install input-checker-validator
```
## usage 
```javascript 
import inputValidator from 'input-checker-validator';

// Yours Input in form of object
const input = {};
// your requirements  
// you can enter Array of required  feilds,
const requirement = ["username","password"] 

// Or Array of object with these feilds 
const requirement = ["username",
    {
      name: "password" //name of feild 
      required: true, // boolean or string
      minLength: 5, // minimum length
      maxLength: 10, // maximum length
      regex: /^([A-Za-z0-9_\-\.])$/, regex
      type: "string" // one of these number, string, boolean, null, undefined, object, symbol
    }
] 
// Or Object 
const requirement = {
defaultRegex:/^([A-Za-z0-9_\-\.])$/, //check on each value required or not
feilds:[ "username",
        {
          name: "password" //name of feild 
          required: true, // boolean or string
          minLength: 5, // minimum length
          maxLength: 10, // maximum length
          regex: /^([A-Za-z0-9_\-\.])$/, regex
          type: "string" // one of these number, string, boolean, null, undefined, object, symbol
       }
      ]
}
// calling function 
const respose = inputValidator({ input, requirement})

// if got error return 
{ feild-name: error vaule }

// if no error return null;

```
## License
ISC
