// import Vue from 'vue'
import { VueConstructor } from 'vue/types/vue'
import FileManager from './components/FileManager.vue'
// import FileManagerComponent from './components/FileManager.vue'
// import {fileManager as fileManagerStore} from './store/modules/file-manager'
import { fileManager as fileManagerStore } from './store/modules/file-manager'
// import {getModule} from "vuex-module-decorators";
import vueFilterPrettyBytes from 'vue-filter-pretty-bytes'
import vueDebounce from 'vue-debounce'
// import customBootstrapVue from './plugins/bootstrap-vue'
import fontawesome from './plugins/fontawesome'
import vueMoment from 'vue-moment'

declare global {
    interface Window {
        Vue?: VueConstructor<Vue>
    }
}

const install = (Vue, config) => {
    if (!config.store) {
        throw new Error('Roi File Manager: Please provide vuex store.')
    }

    // if (!config.fmApi) {
    //     throw new Error('Roi File Manager: Please provide file manager api endpoints.')
    // }

    // Vue.use(customBootstrapVue)

    const fileManagerModule = fileManagerStore(config)
    // config.store.registerModule('file-manager', fileManagerStore(config))

    Vue.prototype.$fileManager = fileManagerModule

    Vue.use(vueFilterPrettyBytes)

    Vue.use(vueDebounce)

    Vue.use(fontawesome)

    if (!Vue.prototype.$moment) {
        Vue.use(vueMoment)
    }

    // console.log(Vue)

    // Vue.component(require('vue2-dropzone'))
}

if (typeof window !== 'undefined' && (window as any).Vue) {
    (window as any).Vue.component('file-manager', FileManager)
}

// if (
//     // process.env.ROLLUP_BUILD_MODE === 'umd' &&
//     typeof window !== 'undefined' &&
//     window.Vue &&
//     // @ts-ignore
//     window.Vue === Vue
//     // 'Vue' in window
// ) {
//     // @ts-ignore
//     window.Vue.component('file-manager', FileManager)
// }

const RoiFileManager = { install } // FileManager,

export default RoiFileManager
export { FileManager, install } // fileManagerStore,

// if (typeof exports == "object") {
//     module.exports = roiFileManager
// } else if (typeof define == "function" && define.amd) {
//     define([], function(){ return roiFileManager })
// } else if (window.Vue) {
//     window.Vue.component("file-manager", FileManager);
// }
