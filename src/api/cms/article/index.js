import fetch from 'utils/fetch';

export function page(query) {
  console.log('log from datatech');
  return fetch({
    url: '/api/cms/article/pagetest',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/cms/article',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/cms/article/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/cms/article/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/cms/article/' + id,
    method: 'put',
    data: obj
  })
}
