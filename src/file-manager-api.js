
/* DEPRECATED */

import axios from 'axios'
import to from 'await-to-js'

export default class FileManagerApi {
  static get defaultOptions () {
    return {
      baseUrl: null,
      listUrl: null,
      downloadUrl: null,
      uploadUrl: null,
      deleteUrl: null,
      axiosOptions: {}
    }
  }

  constructor (opts) {
    this.options = { ...this.constructor.defaultOptions, ...opts }

    // console.log(this.options)
    if (this.options.baseUrl) {
      this.options.axiosOptions.baseURL = this.options.baseUrl
    }

    this.axios = axios.create(this.options.axiosOptions)

    // if(this.options.axios) {
    //     this.axios = this.options.axios;
    // } else {
    //     this.axios = axios.create(this.options.axiosOptions);
    // }
  }

  // todo remove
  list (path, search, page, limit) {
    let conf = this.computeConfig({ params: { path: path, search: search, page: page, limit: limit } })
    let result = this.axios.get(this.options.listUrl, conf)
    // console.log(result)
    return result.data ? result.data : result
  }

  // upload(data, config) {
  //     let conf = this.computeConfig(config);
  //     return this.axios.post(this.options.uploadUrl, data, conf);
  // }

  // todo remove
  async newFolder (path, config) {
    // if (!this.options.folderUrl)
    //     return false;

    // console.log(path)
    let bodyFormData = new FormData()

    bodyFormData.set('path', path)

    // path = Array.isArray(path) ? path : [path];
    //
    // path.forEach((singlePath) => {
    //     bodyFormData.set('path[]', singlePath);
    // })

    let conf = this.computeConfig(config)

    const [err, response] = await to(this.axios.post(this.options.folderUrl, bodyFormData, conf))

    // console.log(err)
    // console.log(err, response, 'api')

    return [err, response]
  }

  // todo remove
  delete (path) {
    let conf = this.computeConfig({ params: { path: path } })
    // console.log(this.options)
    // console.log(conf)
    // return;
    return this.axios.delete(this.options.deleteUrl, conf)
  }

  computeConfig (conf) {
    if (!this.options.requestConfig) {
      return conf
    }
    let overrideConf = this.options.requestConfig
    if (overrideConf instanceof Function) {
      overrideConf = overrideConf()
    }
    return { ...conf, ...overrideConf }
  }

  downloadUrl (file) {
    // TODO : proper
    if (this.options.downloadUrl)
    { return this.options.downloadUrl + '?path=' + file.path }
  }
}
