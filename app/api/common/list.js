import Curd from '../curd'
import {
    request,
} from '../main'
const base_url = '/list'
const list_api = {
    ...new Curd(base_url),
    get_createList() {
        return request(base_url + "s/create", "get", "", false)
    },
    get_joinList() {
        return request(base_url + "s/join", "get", "", false)
    },
    get_listMember(list_id) {
        return request(base_url + "/" + list_id + "/members", "get", "", false)
    },
    add_joinList(data) {
        return request(base_url + "/join", "post", data, false)
    },
};

export default list_api