import Curd from '../curd'
import {
    request,
    upload_file
} from '../main'

const base_url = '/task'
const task_api = {

    ...new Curd(base_url),

    finish(task_id, data) {
        return request(base_url + '/' + task_id + "/finish","post", data,false)
    },

    cancelFinish(task_id){
        return request(base_url + '/' + task_id + "/cancel","post", "",false)
    },

    uploadFile(task_id, file) {
        return upload_file(base_url + '/' + task_id + '/file', file)
    },
    uploadPhoto(task_id, file) {
        return upload_file(base_url + '/' + task_id + '/photo', {
            path: file,
            name: ""
        })
    },
}

export default task_api