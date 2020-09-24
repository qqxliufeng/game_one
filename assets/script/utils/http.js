// let xhr = new XMLHttpRequest();
//  xhr.onreadystatechange = function () {
//      if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
//          var response = xhr.responseText;
//          console.log(response);
//      }
//  };
//  xhr.open("GET", url, true);
//  xhr.send();

var baseURL = 'http://ht.youcanedu.net:8881'

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

function isAbsoluteURL(url) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (Object.prototype.toString.call(obj) === '[object Array]') {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

function post({ url, data = null, headers = [] }) {
  if (!url) return
  if (!isAbsoluteURL(url)) {
    url = combineURLs(baseURL, url)
  }
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest()
    request.onreadystatechange = function () {
      if (request.readyState !== 4 || request.status !== 200) {
        return
      }
      resolve(JSON.parse(request.responseText))
    }
    request.onerror = function (error) {
      reject(new Error('请求失败，请重试……'))
    }
    request.timeout = 10000
    request.ontimeout = function () {
      reject(new Error('timeout', '请求超时'))
    }
    request.open('POST', url, true)
    request.withCredentials = true
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
    if (!data) {
      request.send(null)
    } else {
      const urlParams = new URLSearchParams(data)
      request.send(urlParams.toString())
    }
  })
}

function get({ url, data = null, headers = [] }) {
  if (!url) return
  if (!isAbsoluteURL(url)) {
    url = combineURLs(baseURL, url)
  }
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest()
    request.onreadystatechange = function () {
      if (request.readyState !== 4 || request.status !== 200) {
        return
      }
      resolve(JSON.parse(request.responseText))
    }
    request.onerror = function (error) {
      reject(new Error('请求失败，请重试……'))
    }
    request.timeout = 10000
    request.ontimeout = function () {
      reject(new Error('timeout', '请求超时'))
    }
    request.open('GET', buildURL(url, data), true)
    request.withCredentials = true
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
    request.send(null)
  })
}

function buildURL(url, params, paramsSerializer) {
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (typeof URLSearchParams !== 'undefined' && params instanceof URLSearchParams) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (Object.prototype.toString.call(val) === '[object Array]') {
        key = key + '[]';
      } else {
        val = [val];
      }

      forEach(val, function parseValue(v) {
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

