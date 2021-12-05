import {
    request,
    upload_file
} from '../main'
const base_url = '/user'

const user_api = {

    login(data){
        return request("/login","post",data,false)
    },

    info() {
        return request(base_url+"/info", "get")
    },

    update_user_info(data) {
        return request(base_url+"/info", "post", data,false)
    },

    upload_avatar(filePath) {
        return upload_file(base_url+'/avatar', {
            path: filePath,
            name: ""
        })
    },

}

export default user_api