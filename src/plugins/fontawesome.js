// import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
// import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { faExternalLink as fadExternalLink, faHome as fadHome, faTrashAlt as fadTrashAlt,
  faCheckDouble as fadCheckDouble, faFolder as fadFolder, faFolderOpen as fadFolderOpen,
  faSyncAlt as fadSyncAlt } from '@fortawesome/pro-duotone-svg-icons'

// import { fas } from '@fortawesome/free-solid-svg-icons'
import { faCircle as fasCircle, faFolder as fasFolder, faFolderOpen as fasFolderOpen,
  faTrashAlt as fasTrashAlt,
  faUpload as fasUpload } from '@fortawesome/free-solid-svg-icons'

// import { fal } from '@fortawesome/pro-light-svg-icons'
import { faChevronRight as falChevronRight, faSearch as falSearch,
  faTimes as falTimes,
  faCheckDouble as falCheckDouble } from '@fortawesome/pro-light-svg-icons'

// import { faCoffee as fasCoffee } from '@fortawesome/pro-solid-svg-icons'
// import { faCoffee as farCoffee } from '@fortawesome/pro-regular-svg-icons'
// import { faCoffee as falCoffee } from '@fortawesome/pro-light-svg-icons'
// import customQuill from '@/plugins/custom-quill'

export const fontAwesome = {
  install (Vue, options) {
      // This is important, we are going to let Nuxt.js worry about the CSS
      config.autoAddCss = false

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
//       library.add(fas)
//       library.add(fad)
//       library.add(fal)

    library.add(fasCircle, fasUpload,
      fasTrashAlt
    )

    library.add(fadExternalLink, fadHome, fadFolder, fadFolderOpen,
      fadSyncAlt, fadTrashAlt
    )

    library.add(falChevronRight, falSearch, falCheckDouble,
      falTimes
    )

// Register the component globally
      Vue.component('font-awesome-icon', FontAwesomeIcon)
      Vue.component('font-awesome-layers', FontAwesomeLayers)
      Vue.component('font-awesome-layers-text', FontAwesomeLayersText)
  }
}

// Vue.use(fontAwesome)
export default fontAwesome
