<template>

    <div class="row medias-widget flex-grow-1 clearfix--">

        <div class="col-12 d-flex align-items-center-- justify-content-center" v-if="error">
            <div class="alert alert-warning animated fadeIn w-100 text-center d-flex flex-column align-items-center justify-content-center mt-5 mb-0">
                <p>{{ error }}</p>
                <div>
                    <button @click.prevent="refresh()" class="btn btn-outline-dark btn-icon-left">
                        <font-awesome-icon :icon="['fad', 'sync-alt']" class=""/>
                        Click here to retry
                    </button>
                </div>
            </div>
        </div>

        <template  v-if="!error">

            <!--<div v-if="!loading && files.length==0" class="alert alert-info animated fadeIn">-->
            <!--    This folder is empty.-->
            <!--</div>-->
            <div class="medias-loading w-100 d-flex justify-content-center align-items-center my-10" v-if="loading">
                <b-spinner ></b-spinner>
            </div>

            <b-col class="medias clearfix" v-if="files.length">
                <template  v-if="!loading">
                    <template v-if="view === 'grid' && files.length">
                        <files-grid @browse="browse"></files-grid>
                    </template>

                    <template v-if="view === 'list' && files.length">
                        <files-list @browse="browse" ref="filesList"> </files-list>
                    </template>

<!--                    </transition>-->
                </template>
            </b-col>

            <template v-if="!loading && files.length === 0">
                <b-col class="col-12 d-flex align-items-center justify-content-center" v-if="search">
                    No result found. Try changing the search.
                </b-col>
                <b-col class="col-12 d-flex align-items-center justify-content-center" v-else-if="uploads.length === 0">
                    <span>
                        Drag and drop or <a href="javascript:void(0)" @click="onOpenLocalFileBrowser" class="text-primary">browse</a> to upload some files here.
                    </span>
                </b-col>
            </template>

            <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <div v-if="showContextMenu" class="context-menu" :style="contextMenuStyle">
                    <ul v-if="contextMenuFile.type === 'dir'">
                        <li><a @click.prevent="onMediaClick(contextMenuFile)" href="#"><i class="fa fa-fw fa-folder-open"></i> Open</a></li>
                        <li><a @click.prevent="mmc.toggleDetailsOn(contextMenuFile)" href="#"><i class="fa fa-fw fa-info-circle"></i> Details</a></li>
                    </ul>
                    <ul v-else>
                        <li v-if="mmc.isSelected(contextMenuFile)"><a @click.prevent="mmc.unselectFile(contextMenuFile)" href="#"><i class="fa fa-fw fa-times"></i> Unselect</a></li>
                        <li v-else><a @click.prevent="mmc.selectFile(contextMenuFile)" href="#"><i class="fa fa-fw fa-check"></i> Select</a></li>
                        <li><a @click.prevent="mmc.toggleDetailsOn(contextMenuFile)" href="#"><i class="fa fa-fw fa-info-circle"></i> Details</a></li>
                        <li v-if="api.downloadUrl(contextMenuFile)" ><a :href="api.downloadUrl(contextMenuFile)"><i class="fa fa-fw fa-download"></i> Download</a></li>
                    </ul>
                </div>
            </transition>

        </template>

    </div>

</template>

<script>
/* global $ */
import { mapState } from 'vuex'
import FileWidget from './FileWidget.vue'
import FilesGrid from './FilesGrid.vue'
import FilesList from './FilesList.vue'
import FileActions from './FileActions.vue'
// import { fileManager as fileManagerStore } from '../store/modules/file-manager'

export default {
  components: {
    FilesGrid,
    FilesList,
    FileWidget,
    FileActions
  },
  data () {
    return {
      // files: [],
      // loading: false,
      error: false,

      tableFields: [{ key: 'name' }, { key: 'date' }, { key: 'size' }, { key: 'type' }, { key: 'actions', label: '' }],

      contextMenuFile: {},
      contextMenuX: 0,
      contextMenuY: 0,
      showContextMenu: false
    }
  },
  props: {
    path: {
      type: String,
      default: ''
    },
    view: {
      type: String,
      default: 'grid'
    },
    uploads: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    ...mapState({
      basePath: state => state['file-manager'].options.basePath,
      files: state => state['file-manager'].files,
      loading: state => state['file-manager'].loading,
      search: state => state['file-manager'].search,
      selected: state => state['file-manager'].selected,
    }),
    mmc () {
      return this.$parent
    },
    api () {
      return this.mmc.api
    },
    relPath () {
      return this.path.replace(this.basePath, '')
    },
    pathUp () {
      let path = ''; let index = this.relPath.lastIndexOf('/')
      if (index > -1) {
        path = this.relPath.slice(0, index)
      }
      return this.basePath + path
    },
    contextMenuStyle () {
      return 'left: ' + this.contextMenuX + 'px; top:' + this.contextMenuY + 'px;'
    }
  },
  watch: {
    path: function () {
      this.refresh()
    },
    /* view(currentView, oldView) {
            console.log(currentView, oldView)
            if(currentView === 'list') {
                // console.log(this.$refs)
                // this.$refs.mediasTable.clearSelected();

                if(!this.selected) return;

                this.selected.forEach((i, v) => {
                    // console.log(i, v)
                })
            }
        } */
  },
  mounted () {
    this.refresh()
  },
  methods: {
    isSelected (file) {
      // console.log(file)
      return this.$fileManager.isSelected(file)
    },
    selectAll () {
      if (this.view === 'list') {
        this.$refs.filesList.selectAllRows()
      }
    },
    deSelectAll () {
      if (this.view === 'list') {
        this.$refs.filesList.clearSelected()
      }
    },

    onFilesTableInput (test) {
      const that = this

      if (!this.selected) return

      // console.log('wgweg')
      // console.log(test)
      this.selected.forEach((selectedFile, i) => {
        // console.log(v, i)
        let index = that.files.findIndex(tableFile => tableFile.id === selectedFile.id)
        // console.log(index)
        this.$refs.mediasTable.selectRow(index)
      })
    },
    onFileRowClicked (file, index, event) {
      // this.selected = items
      this.$fileManager.toggleSelected(file)
    },
    onFileRowSelected (files) {
      // this.selected = items
      // this.$fileManager.setSelected(files)

    },
    onMediaClick (file) {
      // console.log(file)
      // if (file.type === 'dir') {
      //     this.browse(file);
      //     // this.$fileManager.setPath(file.path)
      //     // this.$fileManager.refresh()
      //     // return;
      // }

      this.$fileManager.toggleSelected(file)
    },
    browse (file) { // $event,
      // console.log($event)
      if (file.type !== 'dir') return false

      // // this is required to stop the folder to be selected
      // // without this onMediaClick will get called
      // $event.stopPropagation();
      // $event.stopPropagation();

      this.$fileManager.clearSearch()

      this.$fileManager.setPath(file.path)
      // this.$fileManager.refresh()
    },
    // choose(file) {
    //     this.
    // },
    onOpenExternal (file) {
      window.open(file.url, '_blank')
    },

    async refresh () {
      // this.loading = true;
      this.$fileManager.setLoading(true)
      this.error = false

      const [error, response] = await this.$fileManager.refresh()

      if (error) {
        this.error = error.toString()
      }

      // this.loading = false;
      this.$fileManager.setLoading(false)
    },
    onOpenLocalFileBrowser () {
      this.$emit('fm-open-local-file-browser')
    },
    // browse(path) {
    //     this.mmc.path = path;
    // },

    // onMediaClick(file) {
    //     console.log('wgweg')
    //     if (file.type === 'dir') {
    //         this.browse(file.path);
    //     } else {
    //         // let mmc = this.mmc;
    //         if (this.$fileManager.isSelected(file)) {
    //             this.$fileManager.removeSelected(file);
    //         } else {
    //             this.$fileManager.addSelected(file);
    //         }
    //     }
    // },

    onDocumentClick (e) {
      this.toggleContextMenuOff()
    },
    onContextMenu (file, e) {
      let clientRect = this.mmc.$el.getBoundingClientRect()
      this.contextMenuFile = file
      this.contextMenuX = e.clientX - clientRect.left
      this.contextMenuY = e.clientY - clientRect.top
      this.toggleContextMenuOn()
    },
    toggleContextMenuOn () {
      this.showContextMenu = true
      document.addEventListener('click', this.onDocumentClick)
    },
    toggleContextMenuOff () {
      this.contextMenuFile = {}
      this.contextMenuX = 0
      this.contextMenuY = 0
      this.showContextMenu = false
      document.removeEventListener('click', this.onDocumentClick)
    }
  }
}
</script>
