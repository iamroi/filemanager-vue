import { Module, VuexModule, getModule, Action, Mutation, MutationAction } from 'vuex-module-decorators'
import axios, { AxiosInstance } from 'axios'
// import Vue from 'vue'
// import _ from 'lodash'
// import {
//     FM_SET_OPTIONS, FM_SET_API, FM_SET_PATH, FM_SET_FILES, FM_DELETE_FILES, FM_RESET_SELECTED,
//     // FM_SET_DROPZONE_REF,
//     FM_CREATE_NEW_FOLDER, FM_SET_SEARCH, FM_SET_LOADING,
//     FM_SET_CURRENT_PAGE, FM_SET_PER_PAGE, FM_SET_TOTAL_ROWS,
//     FM_ADD_SELECTED, FM_REMOVE_SELECTED, FM_TOGGLE_SELECTED, FM_SET_DELETING
// } from "@/utils/file-manager-mutation-types";

// import * as FM from '../../utils/file-manager-mutation-types'
import * as FM from '../../utils/mutation-types'

// import {IMjmlElement} from "~/store/email-builder";
// import {ISelectedElement} from "~/store/email-builder";
// import {  } from './mutation-types'
import to from 'await-to-js'
import { Store } from 'vuex'

// import { fmApi } from '@/components/zeb-settings.js'
// import { $axios } from '@/utils/api'
// import store from "@/store";

// import {Store} from "vuex"; // use the vue plugin passed store

export interface IFileManagerApi {
    listUrl: string
    uploadUrl: string
    folderUrl: string
    deleteUrl: string
    options?: {}
}

export interface IFileManagerOptions {
    multipleSelection?: boolean
    basePath?: string
    path?: string
    api?: {} | {
        baseUrl: string | null
        listUrl: string | null
        downloadUrl: string | null
        uploadUrl: string | null
        options: {}
    }
    input?: string
    onCreated?: null
    onMounted?: null
    onSelect?: null
    showBreadcrumb?: boolean
    height?: number | null
    // vue?: Vue
    // asVueComponenet?: boolean
}

export interface IFileManagerFile {
    path: string
    basename: string
    dirname: string
    extension: string
    filename: string
    id: number
    size: string
    thumb: string
    timestamp: number
    type: string
    url: string
}

export interface IFileManagerModuleConfig {
    store: Store<any>
    axios?: AxiosInstance
    fmApi: IFileManagerApi
}

export const fileManager = (config: IFileManagerModuleConfig) => {
    const $axios = config.axios ? config.axios : axios.create()
    const store = config.store
    const fmApi = config.fmApi
    // console.log($axios)

    @Module({
        namespaced: true,
        dynamic: true,
        store,
        // stateFactory: false,
        name: 'file-manager'
    })
    class FileManager extends VuexModule {
        mm = {}

        options: IFileManagerOptions = {
            basePath: '',
        }

        path = '' // options.basePath + options.path,

        search = ''

        currentPage = 1

        totalRows = 0

        perPage = 9

        totalPages = null

        selected: IFileManagerFile | IFileManagerFile[] | null = null;

        chosen: IFileManagerFile | IFileManagerFile[] | null = null;

        config = {
            height: 'auto'
        }

        files: IFileManagerFile[] | [] = []

        api: any = fmApi

        loading: boolean = false

        // deleting: boolean = false

        // dropzoneRef: any = null

        get isSelected () {
            return (file: IFileManagerFile): boolean => {
                // if (!this.options.input) return false;
                if (this.options.multipleSelection) {
                    if (!Array.isArray(this.selected)) return false
                    let index = this.selected.findIndex(element => {
                        return element.path === file.path
                    })
                    return index > -1
                } else {
                    return (this.selected !== null && !Array.isArray(this.selected) && this.selected.path === file.path)
                }
            }
        }

        get nbSelected () {
            if (Array.isArray(this.selected)) return this.selected.length
            if (this.selected) return 1
            return 0
        }

        @Mutation
        private [FM.FM_SET_OPTIONS] (payload) {
            this.options = payload
        }

        // @Mutation
        // private [FM.FM_SET_API] (payload) {
        //     // console.log('wegwegweg')
        //     // console.log(payload)
        //     this.api = payload;
        // }

        // @Mutation
        // private [FM.FM_SET_DROPZONE_REF] (payload) {
        //     this.dropzoneRef = payload;
        // }

        @Mutation
        private [FM.FM_SET_PATH] (payload) {
            this.path = payload
            // this.selected = null;
        }

        @Mutation
        private [FM.FM_SET_FILES] (payload) {
            this.files = payload
        }

        @Mutation
        private [FM.FM_SET_LOADING] (payload) {
            this.loading = payload
        }

        // @Mutation
        // private [FM.FM_SET_DELETING] (payload) {
        //     this.deleting = payload;
        // }

        @Mutation
        private [FM.FM_DELETE_FILES] (payload) {
            payload = Array.isArray(payload) ? payload : [payload]
            // console.log(payload)
            this.files = this.files.filter(file => {
                return !payload.includes(file.path)
            })

            // if(this.selected !== null) {
            //     this.selected = this.files.filter(file => {
            //         return Array.isArray(this.selected) && this.selected.includes(file)
            //     })
            // }
            // this.mm.onSelect({ selected: this.selected });
        }

        @Mutation
        private [FM.FM_SET_SELECTED] (payload) {
            if (this.options.multipleSelection) {
                if (!Array.isArray(payload)) {
                    payload = [payload]
                }
            }

            // Vue.set(this, 'selected', payload)

            // console.log(payload)
            this.selected = payload
        }

        @Mutation
        private [FM.FM_RESET_SELECTED] (payload = null) {
            this.selected = null
        }

        @Mutation
        private [FM.FM_ADD_SELECTED] (payload) {
            if (this.options.multipleSelection) {
                if (!Array.isArray(this.selected)) {
                    this.selected = []
                } else {
                    let index = this.selected.findIndex(element => {
                        return element.path === payload.path
                    })
                    if (index > -1) return
                }
                this.selected.push(payload)
            } else {
                this.selected = payload
            }

            // this.mm.onSelect({ selected: this.selected });
        }

        @Mutation
        private [FM.FM_REMOVE_SELECTED] (payload) {
            if (this.options.multipleSelection) {
                if (!Array.isArray(this.selected)) return
                let index = this.selected.findIndex(element => {
                    return element.path === payload.path
                })
                if (index > -1) {
                    this.selected.splice(index, 1)
                }
            } else {
                this.selected = null
            }

            // this.mm.onSelect({ selected: this.selected });
        }

        // TODO remove
        @Mutation
        private [FM.FM_TOGGLE_SELECTED] (payload) {
            // console.log(this.context);
            // console.log(this.context.getters.isSelected);
            // // return;
            // // console.log('webweb')
            // if(payload.type !== 'file') return;
            //
            // // console.log('wgegweg')
            // // console.log(this)
            // if (this.context.getters.isSelected(payload)) {
            //     this.context.dispatch('removeSelected', payload);
            // } else {
            //     // this.addSelected(payload);
            //     this.context.dispatch('addSelected', payload);
            // }
        }

        @Mutation
        private [FM.FM_SET_CHOSEN] (payload) {
            this.chosen = payload
        }

        @Mutation
        private [FM.FM_SET_SEARCH] (payload) {
            this.search = payload
        }

        @Mutation
        private [FM.FM_SET_CURRENT_PAGE] (payload) {
            this.currentPage = payload
        }

        @Mutation
        private [FM.FM_SET_PER_PAGE] (payload) {
            this.perPage = payload
        }

        @Mutation
        private [FM.FM_SET_TOTAL_ROWS] (payload) {
            this.totalRows = payload
        }

        @Mutation
        private [FM.FM_SET_TOTAL_PAGES] (payload) {
            this.totalPages = payload
        }

        @Action({ rawError: true })
        async refresh (payload: any = null) {
            // if(this.api === null) return [new DOMException('API is not set'), null];
            if (fmApi.listUrl === '') return [new DOMException('API listUrl is not set'), null]

            payload = payload || { showLoadinIndicator: true }

            if (payload.showLoadinIndicator) {
                this.context.commit(FM.FM_SET_LOADING, true)
            }

            // const [err, response] = await to(this.api.list(this.path, this.search, this.currentPage, this.perPage))
            const [err, response] = await to($axios.get(fmApi.listUrl, {
                params: {
                    path: this.path,
                    search: this.search,
                    page: this.currentPage,
                    limit: this.perPage
                }
            }))

            if (err) {
                this.setFiles([])
                return [err, response]
            }

            // console.log(response)
            let data = response.data.data ? response.data.data : response.data
            if (Array.isArray(data)) {
                data.sort((a, b) => {
                    let as = a.type + '/' + a.basename
                    let bs = b.type + '/' + b.basename
                    return as.localeCompare(bs)
                })
                // this.files = data;
                this.setFiles(data)
            }

            let pagination = response.data.pagination ? response.data.pagination : null
            // console.log(pagination)
            if (pagination) {
                // this.setCurrentPage(pagination.currentPage)
                // this.setPerPage(pagination.perPage)
                if (typeof pagination.count !== 'undefined') {
                    this.setTotalRows(pagination.count)
                }

                if (pagination.totalPages) {
                    this.setTotalPages(pagination.totalPages)
                }
            }

            // what if current page is > 1 and no results retrieved?
            // refresh again with page - 1 // todo is this dangerous when attacker set current page to 99999?
            if (this.currentPage > 1 && data.length === 0) {
                this.setCurrentPage(1)
                return this.refresh()
            }

            this.context.commit(FM.FM_SET_LOADING, false)

            return [err, response]
        }

        @Action
        setOptions (payload) {
            this.context.commit(FM.FM_SET_OPTIONS, payload)
        }

        // @Action
        // setApi (payload) {
        //     this.context.commit(FM.FM_SET_API, payload)
        // }

        // @Action
        // setDropzoneRef (payload) {
        //     console.log(payload)
        //     console.log('weg')
        //     this.context.commit(FM.FM_SET_DROPZONE_REF, payload)
        //     // this.context.commit(FM.FM_SET_DROPZONE_REF, 'test')
        // }

        @Action
        setPath (payload) {
            this.context.commit(FM.FM_SET_PATH, payload)
            this.context.commit(FM.FM_RESET_SELECTED, null)
        }

        @Action
        setFiles (payload) {
            this.context.commit(FM.FM_SET_FILES, payload)
        }

        @Action
        setLoading (payload) {
            this.context.commit(FM.FM_SET_LOADING, payload)
        }

        // @Action
        // setDeleting (payload) {
        //     this.context.commit(FM.FM_SET_DELETING, payload)
        // }

        @Action
        async newFolder (payload) {
            // if(this.api === null) return [new DOMException('API is not set'), null];
            if (fmApi.folderUrl === '') return [new DOMException('API folderUrl is not set'), null]

            payload = Array.isArray(payload) ? payload : [payload]

            let bodyFormData = new FormData()

            bodyFormData.set('path', payload)

            // path = Array.isArray(path) ? path : [path];
            //
            // path.forEach((singlePath) => {
            //     bodyFormData.set('path[]', singlePath);
            // })

            // let conf = this.computeConfig(config);

            // console.log($axios)
            const [err, response] = await to($axios.post(fmApi.folderUrl, bodyFormData))
            // const [err, response] = await (this.api.newFolder(payload))

            // console.log(err)
            // console.log(err, response, 'store')

            // if(err) {
            //     // this.setFiles([]);
            //     return [err, response];
            // }
            //
            // // this.refresh(null);
            // // this.context.dispatch('refresh')

            return [err, response]
        }

        @Action
        async deleteFiles (payload) {
            // if(this.api === null) return [new DOMException('API is not set'), null];
            if (fmApi.deleteUrl === '') return [new DOMException('API deleteUrl is not set'), null]

            payload = Array.isArray(payload) ? payload : [payload]

            // console.log(payload)
            const [err, response] = await to($axios.delete(fmApi.deleteUrl, { params: { path: payload } }))
            // const [err, response] = await to(this.api.delete(payload))
            // const [err, response] = await (this.api.delete(payload))

            if (err) {
                // this.setFiles([]);
                return [err, response]
            }

            this.context.commit(FM.FM_DELETE_FILES, payload)

            return [err, response]
        }

        @Action
        setSelected (payload) {
            this.context.commit(FM.FM_SET_SELECTED, payload)
        }

        @Action
        resetSelected (payload) {
            this.context.commit(FM.FM_RESET_SELECTED, payload)
        }

        @Action
        addSelected (payload) {
            this.context.commit(FM.FM_ADD_SELECTED, payload)
        }

        @Action
        removeSelected (payload) {
            this.context.commit(FM.FM_REMOVE_SELECTED, payload)
        }

        @Action // ({rawError: true})
        toggleSelected (payload) {
            // console.log(this.context)
            // if(payload.type !== 'file') return;

            // console.log('wgegweg')
            // console.log(this)
            if (this.context.getters.isSelected(payload)) {
                this.context.dispatch('removeSelected', payload)
            } else {
                // this.addSelected(payload);
                this.context.dispatch('addSelected', payload)
            }

            // context.commit(FM.FM_TOGGLE_SELECTED, payload)
        }

        @Action
        setChosen (payload = null) {
            this.context.commit(FM.FM_SET_CHOSEN, payload)
        }

        @Action
        setSearch (payload = '') {
            this.context.commit(FM.FM_SET_SEARCH, payload)
        }

        @Action
        clearSearch (payload) {
            this.context.commit(FM.FM_SET_SEARCH, '')
        }

        @Action
        setCurrentPage (payload: string | number = '') {
            this.context.commit(FM.FM_SET_CURRENT_PAGE, payload)
        }

        @Action
        setPerPage (payload = '') {
            this.context.commit(FM.FM_SET_PER_PAGE, payload)
        }

        @Action
        setTotalRows (payload = '') {
            this.context.commit(FM.FM_SET_TOTAL_ROWS, payload)
        }

        @Action
        setTotalPages (payload = '') {
            this.context.commit(FM.FM_SET_TOTAL_PAGES, payload)
        }
    }
    // export const fileManager = getModule(FileManager)
    return getModule(FileManager)
    // return (FileManager)
}
