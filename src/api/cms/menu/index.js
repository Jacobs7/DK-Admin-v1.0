import fetch from 'utils/fetch';

export function page(query) {
return fetch({
url: '/api/cms/menu/page',
method: 'get',
params: query
});
}

export function addObj(obj) {
return fetch({
url: '/api/cms/menu',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/cms/menu/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/cms/menu/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/cms/menu/' + id,
method: 'put',
data: obj
})
}
