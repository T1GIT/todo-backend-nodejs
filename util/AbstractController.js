const { BadRequest } = require("./http-error");
const _ = require('lodash')

class AbstractController {
    static checkFields(obj, name, fields) {
        const missingFields = []
        for (const field of fields)
            if (!_.has(obj, field))
                missingFields.push(field)
        if (missingFields.length > 0)
            throw new BadRequest(`Missed fields ${
                missingFields.map(el => `"${ el }"`).join(', ')
            } in ${ name }`)
    }
}


module.exports = AbstractController
