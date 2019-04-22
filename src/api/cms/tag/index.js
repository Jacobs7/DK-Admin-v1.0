import fetch from 'utils/fetch';

export function page(query) {
return fetch({
url: '/api/cms/tag/page',
method: 'get',
params: query
});
}

export function addObj(obj) {
return fetch({
url: '/api/cms/tag',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/cms/tag/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/cms/tag/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/cms/tag/' + id,
method: 'put',
data: obj
})
}
