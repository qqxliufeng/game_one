document.addEventListener('WeixinJSBridgeReady', function () {
  setTimeout(() => {
    cc.director.emit('wxload')
  }, 1000)
})

/**
 * 加载进度对话框
 */
function getLoading() {
  return new Promise(function (resolve, reject) {
    cc.resources.load('prefab/loading', cc.Prefab, (error, assets) => {
      if (error) {
        reject(new Error('加载对话框加载失败'))
      } else {
        const loading = cc.instantiate(assets)
        const canvas = cc.director.getScene().getChildByName('Canvas')
        if (canvas) {
          canvas.addChild(loading)
          resolve(loading.getChildByName('loading').getComponent('loading'))
        } else {
          reject(new Error('没有Canvan容器', '加载对话框加载失败'))
        }
      }
    })
  })
}

/**
 * 显示toast
 */
function showToast(text = '', duration = 4) {
  cc.resources.load('prefab/toast', cc.Prefab, (error, assets) => {
    if (error) {
      return
    } else {
      const toast = cc.instantiate(assets)
      const canvas = cc.director.getScene().getChildByName('Canvas')
      canvas.addChild(toast)
      const script = toast.getComponent('toast')
      script.show(text, duration)
    }
  })
}

/**
 * 加载闯关成功对话框
 */
function getSuccessDialog() {
  return new Promise(function (resolve, reject) {
    cc.resources.load('prefab/level_success_tip', cc.Prefab, (error, assets) => {
      if (error) {
        reject('对话框加载失败…')
      } else {
        const item = cc.instantiate(assets)
        const canvas = cc.director.getScene().getChildByName('Canvas')
        canvas.addChild(item)
        resolve(item.getChildByName('SuccessDialog').getComponent(cc.Component))
      }
    })
  })
}

// var baseURL = 'http://segeg.free.idcfengye.com'
var baseURL = 'http://syadmin.qjia.tech/user-api/'

// localStorage.setItem('token', 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjlkODlkMWEyLWVmMGQtNDcxZi1hOTI4LWE4NDMzMzVmNGY1YiJ9.YkKee3U_rQjtXwaM2FyvaLhpcJIQgWqdCybVyKm4aFl1q8t6udaqnfiPHXvQl_q0JdvXcofyGbqudN9DGvDmTw')

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

function post({ url, data = null, beforeRequest = null, afterRequest = null }) {
  if (!url) return
  if (!isAbsoluteURL(url)) {
    url = combineURLs(baseURL, url)
  }
  return new Promise(function (resolve, reject) {
    (beforeRequest && typeof beforeRequest === 'function') && beforeRequest()
    const request = new XMLHttpRequest()
    request.onreadystatechange = function () {
      if (request.readyState !== 4 || request.status !== 200) {
        return
      }
      (afterRequest && typeof afterRequest === 'function') && afterRequest()
      resolve(JSON.parse(request.responseText))
    }
    request.onerror = function (error) {
      (afterRequest && typeof afterRequest === 'function') && afterRequest()
      reject(new Error('请求失败，请重试……'))
    }
    request.timeout = 10000
    request.ontimeout = function () {
      (afterRequest && typeof afterRequest === 'function') && afterRequest()
      reject(new Error('timeout', '请求超时'))
    }
    request.open('POST', url, true)
    request.withCredentials = true
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    if (localStorage.getItem('token')) {
      request.setRequestHeader('Authorization', 'token_' + localStorage.getItem('token'))
    }
    if (!data) {
      request.send(null)
    } else {
      // const urlParams = new URLSearchParams(data)
      request.send(JSON.stringify(data))
    }
  })
}

function get({ url, data = null, beforeRequest = null, afterRequest = null }) {
  if (!url) return
  if (!isAbsoluteURL(url)) {
    url = combineURLs(baseURL, url)
  }
  return new Promise(function (resolve, reject) {
    (beforeRequest && typeof beforeRequest === 'function') && beforeRequest()
    const request = new XMLHttpRequest()
    request.onreadystatechange = function () {
      if (request.readyState !== 4 || request.status !== 200) {
        return
      }
      (afterRequest && typeof afterRequest === 'function') && afterRequest()
      resolve(JSON.parse(request.responseText))
    }
    request.onerror = function (error) {
      (afterRequest && typeof afterRequest === 'function') && afterRequest()
      reject(new Error('请求失败，请重试……'))
    }
    request.timeout = 10000
    request.ontimeout = function () {
      (afterRequest && typeof afterRequest === 'function') && afterRequest()
      reject(new Error('timeout', '请求超时'))
    }
    request.open('GET', buildURL(url, data), true)
    request.withCredentials = true
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
    if (localStorage.getItem('token')) {
      request.setRequestHeader('Authorization', 'token_' + localStorage.getItem('token'))
    }
    request.send(null)
  })
}

function playRemoteAudio(path = '') {
  path && cc.assetManager.loadRemote(path, (error, asset) => {
    error && console.log(error)
    cc.audioEngine.playEffect(asset)
  })
}