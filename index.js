const getInputFields = ({ input, fields, fieldAndValue }) => {
    for (const [key, value] of Object.entries(input)) {
        fields.push(key);
        fieldAndValue.push({ key, value });
        if (typeof value === 'object' && value) getInputFields({ input: value, fields, fieldAndValue })
    };
    return { fields, fieldAndValue };
};

const checkingRequiredFields = ({ input, requiredFields }) => {
    const fields = getInputFields({ input, fields: [], fieldAndValue: [] });
    const fieldProps = requiredFields.requirements;
    if (requiredFields.fields) {
        for (const element of requiredFields.fields) {
            const message = fieldProps[element] && fieldProps[element].required.length ? fieldProps[element].required : null;
            if (!fields.fields.includes(element)) {
                if (message) return { [element]: message }
                else return { [element]: `${element} is required! ` }
            } else {
                for (const [key, value] of Object.entries(fields.fieldAndValue)) {
                    if ((value.key === element) && (!value.value || value.value.length < 1)) {
                        if (message) return { [element]: message }
                        else return { [element]: `${element} is required! ` }
                    }
                }
            }
        }
    }
    return false;
};

const validInput = ({ value, key, type, requiredFields }) => {
    let regex = requiredFields.regex;
    const types = ['number', 'string', 'boolean', 'null', 'undefined', 'object', 'symbol'];
    const fieldProps = requiredFields.requirements;
    if (types.includes(type)) {
        if ((type === 'string') && (regex && regex.test(value)))
            return `Invalid value for ${key} field!`;
        const val = fieldProps[key] ? fieldProps[key] : null;
        if (val) {
            if (val.type && val.type != type) return { [key]: `Type ${val.type} is required but got ${type}` }
            if ((val.minLength) && type === 'string') {
                if (value.length < val.minLength) return { [key]: `Minium ${val.minLength} characters required but got ${value.length}.` }
            }
            if (val.maxLength && type === 'string')
                if (value.length > val.maxLength) return { [key]: `Maximum ${val.maxLength} characters allowed but got ${value.length}.` }
            if (val.regex) {
                if (!val.regex.test(value)) return { [key]: `${key} is not a valid!` }
            }
            if (val.required) {
                if (!value || (type === 'string' && value.trim().length < 1)) {
                    if (val.required.length) return { [key]: val.required }
                    else return { [key]: `${key} is required! ` }
                }
                else if (!value.length && type === 'object') {
                    if (val.required.length) return { [key]: val.required.length }
                    else return { [key]: `${key} is required! ` }
                }
            }
        }
    } else return `Invalid type ${type} for ${key} field!`;
    return false;
};
const checking = ({ input, requiredFields }) => {
    if (!input) return "Input of type object is required";
    for (const [key, value] of Object.entries(input)) {
        const type = typeof (value)
        if (type === 'object') {
            if (value != null) checking(value)
            const res = validInput({ value, key, type, requiredFields })
            if (res) return res
        }
        else if (type === 'boolean') { }
        else {
            const res = validInput({ value, key, type, requiredFields })
            if (res) return res
        }
    }
};

const fieldValidator = ({ fieldValue, requiredFields }) => {
    if (fieldValue) {
        if (typeof fieldValue != 'object') return "Fields must be arrays of objects";
        const types = ['name', 'required', 'minLength', 'maxLength', 'regex', 'type'];
        const dataTypes = ['number', 'string', 'boolean', 'null', 'undefined', 'object', 'symbol'];
        for (const [key, value] of Object.entries(fieldValue)) {
            if (!types.includes(key)) {
                return `Invalid field ${key}, only these ${types} allowed!`;
            } else if (key === 'name' && (!value || value.length < 1 || typeof value != 'string')) return 'Name for field is required';
            else if (!dataTypes.includes(typeof value)) {
                return `Invalid type ${typeof value} for ${key}`;
            } else if (key === 'required' && !['boolean', 'string'].includes(typeof value)) {
                return `Invalid type for ${key}, only string or boolean values allowed!`;
            } else if (['minLength', 'maxLength'].includes(key) && typeof value != 'number') {
                return `Invalid type for ${key}, only numbers allowed!`;
            } else if ((key === 'type') && !dataTypes.includes(value)) {
                return `only these ${dataTypes} data types are allowed!`;
            }
        };
        if (fieldValue.required) {
            requiredFields.fields.push(fieldValue.name)
        }
        const require = {
            required: fieldValue.required,
            minLength: fieldValue.minLength,
            maxLength: fieldValue.maxLength,
            regex: fieldValue.regex,
            type: fieldValue.type
        };
        requiredFields.requirements = {
            ...requiredFields.requirements,
            [fieldValue.name]: {
                ...require
            }

        };
    }
    return false;
}

const requirementValidator = ({ requirement, requiredFields }) => {
    for (const [key, value] of Object.entries(requirement)) {
        if (typeof value === 'string') {
            requiredFields.fields.push(value);
        } else if (typeof value === 'object' && key != 'defaultRegex') {
            if (value && !value.length) {
                const fieldVal = fieldValidator({ fieldValue: value, requiredFields });
                if (fieldVal) return fieldVal
            }
            else if (value && value.length) {
                const res = requirementValidator({ requirement: value, requiredFields })
                if (res) return res;
            }
        }
    };
    return false;
};

const checkInputs = ({ input, requirement }) => {
    if (typeof input != 'object' || !input) return "Input of type object is required";
    if (typeof requirement != 'object') return "Requirements must be an object or array!";

    const regex = requirement && requirement.defaultRegex ?
        requirement.defaultRegex : /\(*.\^*.\$*.*.\(/i;
    if (regex && typeof regex != 'object') return "Regex is invalid!";

    let requiredFields = { fields: [], requirements: {}, regex: regex };
    if (requirement) {
        const response = requirementValidator({ requirement, requiredFields })
        if (response) return response;
    }
    if (requirement) {
        const res = checkingRequiredFields({ input, requiredFields })
        if (res) return res;
    };
    const resp = checking({ input, requiredFields })
    if (resp) return resp;
    return true;
}

return checkInputs({ input, requirement })