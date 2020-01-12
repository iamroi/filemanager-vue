// import BootstrapVue from 'bootstrap-vue'
import { BRow, BCol, BCard, BTable, BSpinner, BFormInput, BProgress, BProgressBar,
  BInputGroup,
  BCollapse, BBreadcrumb, BPopover } from 'bootstrap-vue'

// BInputGroupAppend,
// BInputGroup, BFormInput, BButton, BButtonGroup, BDropdown, BDropdownItem,

// import { BContainer, BRow, BCol, BCollapse, BModal, BBreadcrumb, BAlert, BButton, BButtonGroup, BDropdown, BDropdownItem,
//   BPagination, BPopover, BProgress, BProgressBar } from 'bootstrap-vue'

export const bootstrapVue = {
  install (Vue, options) {
    // Vue.use(BootstrapVue)

    // const components = [ BRow, BCol, BCard, BTable, BSpinner,
    //   BFormInput, BInputGroup,
    //   BProgress, BProgressBar, BCollapse, BBreadcrumb, BPopover ]
    //
    // components.forEach(function (comp) {
    //   // console.dir(comp)
    //   const name = comp.options && comp.options.name ? comp.options.name : comp.name
    //   console.log(_.kebabCase(name))
    //   // console.dir(Vue.options.components[_.kebabCase(name)])
    //   if (!Vue.options.components[_.kebabCase(name)]) {
    //     console.log(name)
    //     console.log(comp)
    //     Vue.component(_.kebabCase(name), comp)
    //   }
    // })

    // console.dir(BRow)
    // console.dir(Vue.options.components['b-row'])
    // Vue.component('b-container', BContainer)

    Vue.component(BRow)
    Vue.component(BCol)

    Vue.component(BCard)
    Vue.component(BTable)
    Vue.component(BSpinner)
    Vue.component(BFormInput)
    Vue.component(BCollapse)
    Vue.component(BBreadcrumb)
    Vue.component(BPopover)
    Vue.component(BProgress)
    Vue.component(BProgressBar)
    // Vue.component(BModal)

    // Vue.component('b-alert', BAlert)
    // Vue.component('b-button', BButton)
    // Vue.component('b-button-group', BButtonGroup)
    // Vue.component('b-dropdown', BDropdown)
    // Vue.component('b-dropdown-item', BDropdownItem)
    // Vue.component('b-pagination', BPagination)
  }
}

// Vue.use(bootstrapVue)
export default bootstrapVue
