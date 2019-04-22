import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/cms/articleTag/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/cms/articleTag',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/cms/articleTag/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/cms/articleTag/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/cms/articleTag/' + id,
    method: 'put',
    data: obj
  })
}
