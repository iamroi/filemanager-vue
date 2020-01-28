// import BootstrapVue from 'bootstrap-vue'
import { BRow, BCol, BCard, BTable, BSpinner,
  BFormInput, BInputGroup,
  BProgress, BProgressBar, BAlert,
  BPagination,
  BCollapse, BBreadcrumb, BPopover } from 'bootstrap-vue'
import kebabCase from 'lodash/kebabCase'

// BInputGroupAppend,
// BInputGroup, BFormInput, BButton, BButtonGroup, BDropdown, BDropdownItem,

// import { BContainer, BRow, BCol, BCollapse, BModal, BBreadcrumb, BAlert, BButton, BButtonGroup, BDropdown, BDropdownItem,
//   BPagination, BPopover, BProgress, BProgressBar } from 'bootstrap-vue'

export const bootstrapVue = {
  install (Vue, options) {
    // Vue.use(BootstrapVue)

    const components = [ BRow, BCol, BCard, BTable, BSpinner,
      BFormInput, BInputGroup,
      BProgress, BProgressBar, BCollapse, BBreadcrumb, BPopover ]

    components.forEach(function (comp) {
      // console.dir(comp)
      const name = comp.options && comp.options.name ? comp.options.name : comp.name
      // console.log(kebabCase(name))
      // console.dir(Vue.options.components[_.kebabCase(name)])
      if (!Vue.options.components[kebabCase(name)]) {
        // console.log(name)
        // console.log(comp)
        Vue.component(kebabCase(name), comp)
      }
    })

    // console.dir(BRow)
    // console.dir(Vue.options.components['b-row'])
    // Vue.component('b-container', BContainer)

    // Vue.component('b-row', BRow)
    // Vue.component('b-col', BCol)
    //
    // Vue.component('b-card', BCard)
    // Vue.component('b-table', BTable)
    // Vue.component('b-spinner', BSpinner)
    //
    // // Vue.component('b-collapse', BCollapse)
    // // Vue.component('b-modal', BModal)
    // Vue.component('b-breadcrumb', BBreadcrumb)
    // // Vue.component('b-alert', BAlert)
    //
    // // Vue.component('b-button', BButton)
    // // Vue.component('b-button-group', BButtonGroup)
    // // Vue.component('b-form-input', BFormInput)
    // // Vue.component('b-dropdown', BDropdown)
    // // Vue.component('b-dropdown-item', BDropdownItem)
    // // Vue.component('b-form-checkbox', BFormCheckbox)
    //
    // Vue.component('b-pagination', BPagination)
    // // Vue.component('b-popover', BPopover)
    // Vue.component('b-progress', BProgress)
    // Vue.component('b-progress-bar', BProgressBar)
    //
    // // Vue.component(BModal)
    //
    // // Vue.component('b-alert', BAlert)
    // // Vue.component('b-button', BButton)
    // // Vue.component('b-button-group', BButtonGroup)
    // // Vue.component('b-dropdown', BDropdown)
    // // Vue.component('b-dropdown-item', BDropdownItem)
    // // Vue.component('b-pagination', BPagination)
  }
}

// Vue.use(bootstrapVue)
export default bootstrapVue
