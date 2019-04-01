//父类
class BaseModel {
    constructor(data, message) {
        if(typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }
        if(data) {
            this.data = data
        }
        if(message) {
            this.message = message
        }
    }
}
//success
class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}
//fail
class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}


module.exports = {
    SuccessModel,
    ErrorModel
}