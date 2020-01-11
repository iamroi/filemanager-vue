// import Vue from 'vue'
import { VueConstructor } from 'vue/types/vue'
import FileManager from './components/FileManager.vue'
// import FileManagerComponent from './components/FileManager.vue'
// import {fileManager as fileManagerStore} from './store/modules/file-manager'
import { fileManager as fileManagerStore } from './store/modules/file-manager'
// import {getModule} from "vuex-module-decorators";
import vueFilterPrettyBytes from 'vue-filter-pretty-bytes'
import vueDebounce from 'vue-debounce'

declare global {
    interface Window {
        Vue?: VueConstructor<Vue>
    }
}

const install = (Vue, config) => {
    if (!config.store) {
        throw new Error('Roi File Manager: Please provide vuex store.')
    }

    if (!config.fmApi) {
        throw new Error('Roi File Manager: Please provide file manager api endpoints.')
    }

    // console.dir(fileManagerStore(config))
    // register your own vuex module

    const fileManagerModule = fileManagerStore(config)
    // config.store.registerModule('file-manager', fileManagerStore(config))

    Vue.prototype.$fileManager = fileManagerModule

    Vue.use(vueFilterPrettyBytes)

    Vue.use(vueDebounce)

    Vue.use(require('vue-moment'))
}

if (
    // process.env.ROLLUP_BUILD_MODE === 'umd' &&
    typeof window !== 'undefined' &&
    window.Vue &&
    // @ts-ignore
    // window.Vue === Vue
    'Vue' in window
) {
    window.Vue.component('file-manager', FileManager)
}

const RoiFileManager = { install } // FileManager,

export default RoiFileManager
export { fileManagerStore, FileManager, install }

// if (typeof exports == "object") {
//     module.exports = roiFileManager
// } else if (typeof define == "function" && define.amd) {
//     define([], function(){ return roiFileManager })
// } else if (window.Vue) {
//     window.Vue.component("file-manager", FileManager);
// }
