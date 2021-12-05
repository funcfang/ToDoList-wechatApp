import {
    request,
    upload_file,
} from './main.js'


class Curd {
    baseUrl = ''
    plural = ''
    get_list = this._get_list.bind(this)
    get = this._get.bind(this)
    save = this._save.bind(this)
    delete = this._delete.bind(this)
    upload = this._upload.bind(this)

    constructor(baseUrl, plural = null) {
        this.baseUrl = baseUrl
        this.plural = plural ?? this.baseUrl + 's'
    }

    _get_list(params,isShowModal = false) {
        return request(this.plural, "get", params,isShowModal)
    }

    _get(id,isShowModal = false) {
        return request(this.baseUrl + (id ? '/' + id : ''), "get","",isShowModal)
    }

    _save(id = null, data, isShowModal = false) {
        return request(this.baseUrl + (id ? '/' + id : ''), "post", data, isShowModal)
    }

    _delete(id) {
        return request(this.baseUrl + '/' + id, "delete")
    }

    _upload(id, filePath, fileName) {
        return upload_file(this.baseUrl + '/' + id + '/upload', {
            path: filePath,
            name: fileName
        })
    }
}

export default Curd