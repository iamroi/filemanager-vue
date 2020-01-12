<template>
    <div class="z-file-manager media-manager" :id="id">
        <div class="mm" :class="{ 'mm-fixed-height': options.height }" :style="options.height ? 'height:'+options.height : ''">

            <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                <details-widget
                    v-if="showDetails"
                    :file="file"
                    ref="details"
                    key="details"
                ></details-widget>
            </transition>

            <div class="panel panel-default">

                <!--<div class="panel-heading">-->
                <!--    <div class="btn-group btn-group-xs">-->
                <!--    <button @click="toggleUpload" class="btn btn-default">-->
                <!--        <i class="fa fa-upload" aria-hidden="true"></i>-->
                <!--    </button>-->
                <!--    <button class="btn btn-default">-->
                <!--        <i class="fa fa-plus-circle" aria-hidden="true"></i>-->
                <!--        <i class="fa fa-folder-open" aria-hidden="true"></i>-->
                <!--    </button>-->
                <!--    </div>-->
                <!--</div>-->

                <div class="panel-body">
                    <notification-widget>
                    </notification-widget>

                    <div class="fm-sub-header d-flex justify-content-between">
                        <ol v-if="options.showBreadcrumb" class="breadcrumb flex-grow-1">
                            <li class="breadcrumb-item--" v-for="(item, i) in breadcrumb" :key="i">
    <!--                            v-html="item.label"-->
                                <template v-if="item.path !== ''">
                                    <font-awesome-icon :icon="['fal', 'chevron-right']" />
                                </template>

                                <template v-if="breadcrumb.length === 1 || (i + 1) < breadcrumb.length">
                                    <a @click.prevent="onBreadcrumbClick(item.path)"
                                       :class="[item.path === '' ? 'home' : '']"
                                       href="javascript:void(0)">
                                        <template v-if="item.path === ''">
                                            <font-awesome-layers class="d-flex justify-content-center button-block-svg-layer fa-lg fa-fw">
                                                <font-awesome-icon size="lg" icon="circle" />
                                                <font-awesome-icon size="xs" :icon="['fad', 'home']" />
                                            </font-awesome-layers>
                                        </template>
                                        <template v-else>
                                            {{ item.label }}
                                        </template>
                                    </a>
                                </template>
                                <template v-else>
                                    <span class="active">{{ item.label }}</span>
                                </template>
                            </li>
                        </ol>

                        <div class="file-actions-bulk d-flex">
                            <vue-ladda
                                button-class="btn btn-sm btn-danger btn-bulk-delete btn-icon-left"
                                v-if="selected && selected.length"
                                @click="onDeleteMultiple"
                                :loading="isDeletingMultiple"
                            >
                                <font-awesome-icon :icon="['fas', 'trash-alt']" class="" size="sm"/>
                                Delete
                            </vue-ladda>

<!--                            <b-button variant="danger" size="sm"-->
<!--                                      class="px-3"-->
<!--                                      v-if="selected && selected.length"-->
<!--                                      @click="onDeleteMultiple"-->
<!--                            >-->
<!--                                <font-awesome-icon :icon="['fas', 'trash-alt']" class="" size="sm"/>-->
<!--                                Delete-->
<!--                            </b-button>-->

                            <b-button variant="dark" size="sm"
                                      class="px-3 btn-icon-left"
                                      v-if="files && files.length"
                                      @click="onSelectAllToggle"
                            >
                                <font-awesome-icon :icon="['fal', isAllSelected ? 'times' : 'check-double']"/>
                                {{ isAllSelected ? 'Unselect all' : 'Select all' }}
                            </b-button>
                        </div>

                        <span class="separator" v-if="!isEmptyFiles || !isEmptySelected">|</span>

                        <div class=" d-flex mr-3">

                            <a class="d-flex align-items-center mr-2" ref="" href="javascript:void(0);"
                               @click="onSwitchView('grid')"
                            >
                                <img src="@/assets/images/fileManager/grid-view.svg" alt="">
<!--                                <font-awesome-icon :icon="['fas', 'th']"/>-->
                            </a>

                            <a class="d-flex align-items-center " ref="" href="javascript:void(0);"
                               @click="onSwitchView('list')"
                            >
                                <img src="@/assets/images/fileManager/list-view.svg" alt="">

                                <!--                                <font-awesome-layers class="d-flex justify-content-center button-block-svg-layer fa-lg fa-fw text-dark"-->
<!--                                                     style="    font-size: 20px;"-->
<!--                                >-->
<!--                                    <font-awesome-icon :icon="['fal', 'horizontal-rule']" transform="up-1" size="2x"/>-->
<!--                                    <font-awesome-icon :icon="['fal', 'horizontal-rule']" transform="down-2" />-->
<!--                                    <font-awesome-icon :icon="['fal', 'horizontal-rule']" transform="down-5" />-->
<!--                                </font-awesome-layers>-->
                            </a>

                            <!--                            <button class="btn btn-sm btn-danger"-->
<!--                                    v-if="selected && selected.length"-->
<!--                                    @click="onDeleteMultiple"-->
<!--                            >Delete</button>-->
                        </div>

                        <div class="file-search-wrapper form-group has-icon mb-0">
                            <b-form-input v-model="folderSearch"
                                          placeholder="Search in folder"
                                          v-debounce:400="onFolderSearch"
                                          debounce-events="keyup"
                                          @keyup="setLoading"
                            >
                            </b-form-input>
                            <span class="form-control-feedback">
                                <font-awesome-icon :icon="['fal', 'search']" @click="onFolderSearch"/>
                            </span>
                        </div>
                    </div>

<!--                    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">-->
<!--                        <upload-status-widget-->
<!--                            v-if="showUploadStatus"-->
<!--                            :uploads="uploads"-->
<!--                            ref="details"-->
<!--                            key="details"-->
<!--                        ></upload-status-widget>-->
<!--                    </transition>-->

                    <div class="mm-content">
                        <div class="dz-upload-status" v-if="uploads.length">
                            <h6 class="dz-upload-status__title">Upload in progress</h6>
                            <p class="dz-upload-status__subtitle">{{successUploads.length}}/{{uploads.length}} completed</p>
                            <hr>
                            <template v-if="file.status !== 'error'">
                                <div class="dz-upload-status__item"
                                     v-for="(file, i) in uploads"
                                     :key="i">
                                    <div class="thumbnail">
                                        <img data-dz-thumbnail :src="file.dataURL" v-if="file.dataURL"/>
                                    </div>
                                    <b-progress
                                        class=""
                                        :value="file.upload.progress"
                                        :max="100" show-progress animated
                                        :label="file.upload.progress >= 1 ? `${((file.upload.progress / 100) * 100).toFixed(0)}%` : ''"
                                        v-if="file.upload.progress <= 100 && file.status !== 'error'"
                                    ></b-progress>

    <!--                                <div class="progress" v-if="file.upload.progress < 100 && file.status !== 'error'">-->
    <!--                                    <div role="progressbar" aria-valuemin="0" aria-valuemax="100"-->
    <!--                                         class="progress-bar progress-bar-striped progress-bar-animated"-->
    <!--                                         :style="{width: file.upload.progress + '%'}"-->
    <!--                                         data-dz-uploadprogress-->
    <!--                                    >-->
    <!--                                    </div>-->
    <!--                                </div>-->
                                </div>
                            </template>
                        </div>

<!--                        <upload-widget-->
<!--                            v-if="api.options.uploadUrl"-->
<!--                            :path="path"-->
<!--                            v-show="showUpload"-->
<!--                            @upload-success="onUploadSuccess"-->
<!--                            @upload-error="onUploadError"-->
<!--                            ref="upload"-->
<!--                            key="upload"-->
<!--                            class="animated fadeIn"-->
<!--                        ></upload-widget>-->

<!--                        @vdropzone-files-added="onDropzoneFileAdded"-->
                        <vue2-dropzone
                            :id="`file-manager-dropzone`"
                            :class="[isDragging ? 'active' : '']"
                            ref="fileManagerDropzone"
                            :options="options.dropzoneOptions"
                            :useCustomSlot="true"
                            :include-styling="false"
                            @vdropzone-drag-start="onDropzoneDragStart"
                            @vdropzone-drag-end="onDropzoneDragEnd"
                            @vdropzone-drag-enter="onDropzoneDragEnter"
                            @vdropzone-drag-leave="onDropzoneDragLeave"
                            @vdropzone-drop="onDropzoneDrop"
                            @vdropzone-file-added="onDropzoneFileAdded"
                            @vdropzone-sending="onDropzoneSending"
                            @vdropzone-upload-progress="onDropzoneProgress"
                            @vdropzone-queue-complete="onDropzoneQueueComplete"
                            @vdropzone-error="onDropzoneError"
                            @vdropzone-error-multiple="onDropzoneErrorMultiple"
                            @vdropzone-complete-multiple="onDropzoneCompleteMultiple"
                            @vdropzone-success="onDropzoneSuccess"
                        >

                            <!--                            <div class="font-weight-bold text-white">-->
<!--                                Drag and drop here!-->
<!--                            </div>-->
                        </vue2-dropzone>

                        <files-widget
                            :path="path"
                            :view="currentView"
                            :uploads="uploads"
                            v-show="showMedias"
                            ref="medias"
                            key="medias"
                            class="animated fadeIn"
                            @fm-open-local-file-browser="openLocalFileBrowser"
                        ></files-widget>

                    </div>

                    <div class="" v-if="!isEmptyFiles && totalRows > perPage">
                        <b-pagination
                            v-model="currentPage"
                            :total-rows="totalRows"
                            :per-page="perPage"
                            variant="primary"
                            aria-controls=""
                            @input="onPageChange"
                        ></b-pagination>
                    </div>
                </div>

            </div>
        </div>
<!--        <drag-overlay></drag-overlay>-->
        <VueFullScreenFileDrop @drop='onFullPageFileDrop'>
            <div class='vue-full-screen-file-drop__content'>
                Drag and drop here!
            </div>
        </VueFullScreenFileDrop>

    </div>
</template>

<script>
// import Vue from 'vue'
import { mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
// import has from 'lodash/has'
// import extend from 'lodash/extend'
// import FileManagerApi from '../file-manager-api.js';
// import { fileManager as fileManagerStore } from '../store/modules/file-manager'

import UploadWidget from './UploadWidget.vue'
import UploadStatusWidget from './UploadStatusWidget.vue'
import FilesWidget from './FilesWidget.vue'
import DetailsWidget from './DetailsWidget.vue'
import NotificationWidget from './NotificationWidget.vue'
// import FaIconClassHelper from './FaIconClassHelper'
// import vueFilterPrettyBytes from 'vue-filter-pretty-bytes'
// import DropzonePreviewTemplate from './DropzonePreviewTemplate.vue';
import vue2Dropzone from 'vue2-dropzone'
// import vue2Dropzone from '@/components/vue-dropzone-master/src/index.js'
// import vue2Dropzone from '@/components/vue-dropzone-master/src/components/vue-dropzone.vue'
import VueFullScreenFileDrop from 'vue-full-screen-file-drop'
import VueLadda from '@/components/vue-ladda/vue-ladda.vue'
// import 'vue-full-screen-file-drop/dist/vue-full-screen-file-drop.css';
import vueDebounce from 'vue-debounce'
import { getErrorFromResponse } from '@/helpers/common'

// Vue.use(vueDebounce)
// import DragOverlay from './DragOverlay.vue';

// import Dropzone from './dropzone.js'
// console.dir(vueFilterPrettyBytes)
// Vue.use(vueFilterPrettyBytes)

// Vue.use(require('vue-moment'))

const defaultOptions = {
  basePath: '',
  path: '',
  api: {
    baseUrl: null,
    listUrl: null,
    downloadUrl: null,
    uploadUrl: null,
    deleteUrl: null,
    options: {}
  },
  // input: '',
  multipleSelection: true,
  onCreated: null, // todo
  onMounted: null, // todo
  onSelect: null, // todo
  onChoose: null, // todo
  showBreadcrumb: true,
  height: null,
  // vue: Vue,
  asVueComponenet: false,
  dropzoneOptions: {
    // previewsContainer: false,
    // onBody: true,
    previewsContainer: false,
    url: null,
    headers: {},
    uploadMultiple: false,
    clickable: false,
    maxFilesize: 2,
    thumbnailWidth: 200,
    addRemoveLinks: true,
    acceptedFiles: '.jpg, .jpeg, .png, .gif',
    dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> UPLOAD ME",
    dictInvalidFileType: 'Sorry, this file type is not supported.'
  },
}

export default {
  props: ['id', 'opts'],
  components: {
    FilesWidget,
    UploadWidget,
    UploadStatusWidget,
    DetailsWidget,
    NotificationWidget,
    vue2Dropzone,
    VueFullScreenFileDrop,
    // DropzonePreviewTemplate,
    vueDebounce,
    VueLadda,
    // DragOverlay
  },
  data () {
    // console.log(this.$fileManager.options)
    return {
      // path: this.$store.state.options.basePath,
      // path: this.$fileManager.options.basePath,
      api: {},
      options: {},

      dropzone: null,
      isDragging: false,
      dragOverlayElement: null,

      currentView: 'grid',

      isDeletingMultiple: false,

      // folderSearch: '',
      // currentPage: 1,
      // totalRows: 0,
      // perPage: 4,

      uploads: [],
      successUploads: [],
      failedUploads: [],
      file: {},
      showUpload: true,
      showUploadStatus: false,
      showMedias: true,
      showDetails: false
    }
  },
  computed: {
    ...mapState({
      // options: state => state.options,
      basePath: state => state['file-manager'].options.basePath,
      path: state => state['file-manager'].path,
      files: state => state['file-manager'].files,
      selected: state => state['file-manager'].selected,
      chosen: state => state['file-manager'].chosen,
      // currentPage: state => state['file-manager'].currentPage,
      totalRows: state => state['file-manager'].totalRows,
      perPage: state => state['file-manager'].perPage,
      // totalPages: state => state['file-manager'].totalPages,
      // deleting: state => state['file-manager'].deleting,
    }),
    folderSearch: {
      get () {
        // console.log(emailBuilderStore.activeSidebarTabIndex)
        // return activeSidebarTabIndex;
        // this.defaultBorder
        return this.$fileManager.search// || this.defaultBorder;
      },
      set (search) {
        this.$fileManager.setSearch(search)
      }
    },
    currentPage: {
      get () {
        // console.log(emailBuilderStore.activeSidebarTabIndex)
        // return activeSidebarTabIndex;
        // this.defaultBorder
        return this.$fileManager.currentPage// || this.defaultBorder;
      },
      set (page) {
        this.$fileManager.setCurrentPage(page)
      }
    },

    overrideOptions () {
      // return Object.assign(defaultOptions, this.options)
      // // return extend(defaultOptions, this.options);

      return { ...defaultOptions, ...this.options }
    },
    // input () {
    //   /*
    //         * Input options ?
    //         */
    //   if (!this._input && this.options.input) {
    //     this._input = document.querySelector(this.options.input)
    //   }
    //   return this._input
    // },
    relPath () {
      return this.path.replace(this.basePath, '')
    },
    breadcrumb () {
      let parts = this.relPath.split('/')
      let breadcrumb = []
      let path = ''

      // breadcrumb.push({ label: '<i class="fa fa-fw fa-home"></i>', path: this.basePath });
      breadcrumb.push({ label: '', path: this.basePath })
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) {
          path += parts[i] + '/'
          breadcrumb.push({ label: parts[i], path: this.basePath + path.replace(/\/$/, '') })
        }
      }

      return breadcrumb
    },
    isEmptySelected () {
      return this.selected === null || this.selected.length === 0
    },
    isAllSelected () {
      return this.selected && this.files.length === this.selected.length
    },
    isEmptyFiles () {
      return this.files === null || this.files.length === 0
    },
    // failedUploads() {
    //     return this.uploads.filter(item => {
    //         return item.status === 'error';
    //     });
    // },
    // successUploads() {
    //     return this.uploads.filter(item => {
    //         return item.status !== 'error';
    //     });
    // },

  },
  watch: {
    chosen: function (file) {
      this.$emit('fm-chosen', file)
    },
  },
  created () {
    // console.log(this.$fileManager)
    // this.options = { ...defaultOptions, ...this.opts };
    this.options = merge(defaultOptions, this.opts)
    // console.log(this.options);
    // Object.assign(this.options, defaultOptions, this.opts);
    // console.log(defaultOptions)
    // console.log(this.options)
    // return
    /*
         * Init api
         */
    // this.api = new FileManagerApi(this.options.api);
    //
    // this.$fileManager.setApi(this.api);

    if (this.options.onCreated)
    { this.options.onCreated({ vc: this }) }

    // this._input = null
  },
  mounted () {
    const that = this
    this.$fileManager.setOptions(this.options)

    this.dropzone = that.$refs.fileManagerDropzone.dropzone

    // dragOverlayComponent.$destroy();

    // document.body.append('<div class="fm-drag-drop-overlay"></div>')
    // let dragOverlay = `<div class="fm-drag-drop-overlay">
    //                     <div class="fm-drag-drop-overlay-body">
    //                     </div>
    //                    </div>`;
    // let elem = document.createElement(dragOverlay);
    // elem.classList = 'fm-drag-drop-overlay';
    // document.body.appendChild(dragOverlay);

    // console.log(window.Dropzone)
    // console.log(Dropzone)
    // console.log(this)
    // this.dropzone = new Dropzone(document.body, this.options.dropzoneOptions);
    //
    // myDropzone.on("sending", function(file, xhr, formData) {
    //     // Will send the filesize along with the file as POST data.
    //     formData.append("filesize", file.size);
    // });

    // this.$refs.fileManagerDropzone.dropzone.on("dragstart", function(event) {
    //
    //     console.log('gwegw')
    // });

    // console.log(this.$refs)
    // this.$fileManager.setDropzoneRef(this.$refs.fileManagerDropzone.dropzone);

    // document.addEventListener('dragenter', function (event) {
    //     event.preventDefault();
    //     // event.stopPropagation();
    //     that.isDragging = true;
    //     // console.log('gwegwg')
    // });
    //
    // // document.addEventListener("dragover", function(event) {
    // //     // event.preventDefault();
    // //     this.isDragging = true;
    // // });
    //
    // // let dragCount = 0;
    // document.addEventListener("dragleave", function(event) {
    //     event.preventDefault();
    //     // console.log(event)
    //     // event.stopPropagation();
    //     // e.preventDefault();
    //     if (!event.clientX && !event.clientY) {
    //         // outside body / window
    //         that.isDragging = false;
    //     }
    // });
    //
    // document.addEventListener("drop", function(event) {
    //     event.preventDefault();
    //     // console.log('gwegw')
    //     this.isDragging = false;
    // });
  },
  methods: {
    onSwitchView (view) {
      this.currentView = view
    },
    onFullPageFileDrop (formData, files) {
      const that = this
      // console.log(formData); // Can be posted to server
      // console.log(files);    // Can get access to things like file name and size
      for (let file of files) {
        that.$refs.fileManagerDropzone.dropzone.addFile(file)
      }
    },
    // not working
    onDropzoneDragStart (event) {
      console.log(event)
      this.isDragging = true
    },
    // not working
    onDropzoneDragEnd (event) {
      this.isDragging = false
    },
    onDropzoneDragEnter (event) {
      console.log('onDropzoneDragEnter')
      this.isDragging = true
    },
    onDropzoneDragLeave (event) {
      console.log('onDropzoneDragLeave')
      this.isDragging = false
    },
    onDropzoneDrop (event) {
      this.isDragging = false
    },

    onDropzoneFileAdded (file) {
      console.log(file)
      // this.uploads = [this.uploads, ...file]
      this.uploads.push(file)
    },
    onDropzoneSending (file, xhr, formData) {
      formData.append('path', this.$fileManager.path)
    },
    _onDropzoneError (file, message, xhr) {
      // fetch the file from uploading list
      let existingFile = this.failedUploads.filter(item => {
        return item && item.name === file.name
      })

      // console.log(uploadingFile)
      // if(uploadingFile.length && uploadingFile[0].status === 'error') {
      //     return;
      // }

      if (existingFile.length === 1) {
        return
      }

      this.failedUploads.push(file)

      // this.uploads = this.uploads.map(item => {
      //     return item.name === file.name ? file : item;
      // })

      // this.uploads = this.uploads.filter(item => {
      //     return item.name !== file.name
      // })
    },
    onDropzoneError (file, message, xhr) {
      // if(this.options.dropzoneOptions.uploadMultiple) {
      //     return;
      // }
      // console.log('onDropzoneError')
      // console.log(file)
      // console.log(message)
      // console.log(xhr)

      this.$emit('fm-upload-error', file, message, xhr)

      // this._onDropzoneError(file, message, xhr);
      // fetch the file from uploading list
      let existingFile = this.failedUploads.filter(item => {
        return item && item.name === file.name
      })

      // console.log(uploadingFile)
      // if(uploadingFile.length && uploadingFile[0].status === 'error') {
      //     return;
      // }

      if (existingFile.length === 1) {
        return
      }

      this.failedUploads.push(file)
    },
    onDropzoneErrorMultiple (files, message, xhr) {
      // console.log('onDropzoneErrorMultiple')
      // console.log(this.options)

      const that = this
      // console.log(files)
      // console.log(message)
      // console.log(xhr)
      // files.forEach((file) => {
      //     // that._onDropzoneError(file, message, xhr)
      //     that.onDropzoneError(file, message, xhr)
      // })

      this.$emit('fm-upload-error-multiple', files, message, xhr)
    },
    onDropzoneCompleteMultiple (files) {
      // console.log('onDropzoneCompleteMultiple')
      // console.log(files)

      this.$emit('fm-upload-complete-multiple', files)
    },
    onDropzoneSuccess (file, response) {
      // formData.append('path', this.$fileManager.path);
      // this.uploads = this.uploads.filter(item => {
      //     return item.name !== file.name
      // })
      this.successUploads.push(file)

      // this.uploads = this.uploads.filter(item => {
      //     return item.name !== file.name
      // })

      // todo uncomment if refresh needed on every single upload success
      // this.$fileManager.refresh();
    },
    onDropzoneProgress (file, progress, bytesSent) {
      // console.log(file)
      // console.log(progress)

      this.uploads = this.uploads.map(item => {
        return item.name === file.name ? file : item
      })
    },
    onDropzoneQueueComplete (response) {
      this.uploads = []
      this.successUploads = []
      this.failedUploads = []

      // this.$fileManager.refresh();
      this.onRefresh()

      this.$emit('fm-upload-queue-complete', response)
    },
    openLocalFileBrowser () {
      // console.log(this.$refs.fileManagerDropzone)
      this.$refs.fileManagerDropzone.dropzone.hiddenFileInput.click()
      // this.$fileManager.dropzoneRef.dropzone.hiddenFileInput.click()
    },
    async onDeleteMultiple () {
      // console.log(this.$fileManager.selected)
      // this.$fileManager.setDeleting(true)

      this.isDeletingMultiple = true

      let selectedFilePaths = this.$fileManager.selected.map(file => file.path)

      // this.$fileManager.deleteFiles(selectedFilePaths)
      const [err, deleteResult] = await this.$fileManager.deleteFiles(selectedFilePaths)

      this.isDeletingMultiple = false

      if (err) {
        // let errMessage = deleteErr.response && deleteErr.response.data && deleteErr.response.data.error ?
        //     deleteErr.response.data.error.message :
        //     "Sorry, we couldn't delete some files. Please try again later.";
        // let errMessage = has(err, 'response.data.error.message') ?
        //     err.response.data.error.message :
        //     "Sorry, we couldn't delete some files. Please try again later.";
        let errMessage = getErrorFromResponse(err, "Sorry, we couldn't delete some files. Please try again later.")
        // errMessage = has(err, 'response.data.error.message') ? err.response.data.error.message : errMessage;
        // errMessage = has(err, 'response.data.message') ? err.response.data.message : errMessage;
        // errMessage = Array.isArray(errMessage) ? errMessage[0] : errMessage;

        this.$bvToast.toast(errMessage, {
          // title: `Variant`,
          noCloseButton: true,
          toaster: 'b-toaster-top-right',
          variant: 'danger',
          // solid: true
        })

        return
      }

      // lets deselect the remove files
      this.selected.forEach(file => {
        this.$fileManager.removeSelected(file)
      })

      // this.$fileManager.resetSelected()

      // this.$fileManager.setDeleting(false)

      this.onRefresh()
    },
    onSelectAllToggle () {
      if (this.isAllSelected) {
        this.$refs.medias.deSelectAll()

        this.$fileManager.resetSelected()

        return
      }

      this.$refs.medias.selectAll()

      this.$fileManager.setSelected(cloneDeep(this.files))

      // this.files.forEach(file => {
      //     this.$fileManager.addSelected(file)
      // })
    },
    async onRefresh () {
      // this.$fileManager.setLoading(true)

      const [error, response] = await this.$fileManager.refresh()

      // this.$fileManager.setLoading(false)
    },

    /* onUploadSuccess() {
            this.hideUploadStatus();
            this.$refs.medias.refresh();
        },
        onUploadError(errors) {
            this.hideUploadStatus();
            this.$refs.medias.refresh();
        }, */

    /* onDetailsClose() {
            this.showDetails = false;
            this.file = {};
        }, */

    async onCreateNewFolder (folderName) {
      // validation todo
      let regex = /[<>:"/\\|?*]/
      // console.log(folderName)
      if (regex.test(folderName)) {
        throw new Error('ValidationError')

        // return [new DOMException(msg), null];
        // return false;
      }

      // console.log(`${this.$fileManager.path}/${folderName}`)
      // return true
      let folderUri = `${this.$fileManager.path}/${folderName}`

      const [err, response] = await this.$fileManager.newFolder(folderUri)
      // if(err) {
      //     let errMessage = err.response && err.response.data ?
      //         err.response.data.error.message :
      //         "Sorry, the folder wasn't created.";
      //     this.$bvToast.toast(errMessage, {
      //         // title: `Variant`,
      //         noCloseButton: true,
      //         toaster: 'b-toaster-top-right',
      //         variant: 'danger',
      //         // solid: true
      //     })
      //     // return false;
      // }

      // this.$fileManager.setLoading(false)
      // this.$fileManager.refresh();

      this.onRefresh()

      return [err, response]
    },
    onBreadcrumbClick (path) {
      // if(path === '') {
      //     this.$fileManager.refresh();
      //     return;
      // }
      //
      // if(path === this.path) return;

      this.$fileManager.clearSearch()

      this.$fileManager.setPath(path)

      // forcing refresh when
      // clicking home button on home directory
      if (this.path === '' && path === '') {
        this.$fileManager.refresh()
      }
    },
    onPageChange (page) {
      this.$fileManager.setCurrentPage(page)
      this.$fileManager.resetSelected()
      this.onRefresh()
    },
    onFolderSearch () {
      this.$fileManager.resetSelected()
      this.onRefresh()
    },
    selectFile (file) {
      this.$fileManager.addSelected(file)
    },
    unselectFile (file) {
      this.$fileManager.removeSelected(file)
      // this.$store.commit('removeSelected', file);
    },
    isSelected (file) {
      return this.$fileManager.isSelected(file)
    },

    /* toggleUploadStatusOn() {
            if (this.hideUploadStatusTimeout)
                window.clearTimeout(this.hideUploadStatusTimeout);
            this.showUploadStatus = true;
        },
        toggleUploadStatusOff() {
            if (this.hideUploadStatusTimeout)
                window.clearTimeout(this.hideUploadStatusTimeout);
            this.showUploadStatus = false;
        },
        hideUploadStatus() {
            this.hideUploadStatusTimeout = window.setTimeout(this.toggleUploadStatusOff, 5000);
        },

        toggleUpload() {
            this.showUpload = !this.showUpload;
            this.showMedias = !this.showUpload;
        },

        toggleDetailsOn(file) {
            this.file = file;
            this.showDetails = true;
        },
        toggleDetailsOff() {
            this.file = {};
            this.showDetails = false;
        }, */

    setLoading (isLoading = 1) {
      this.$fileManager.setLoading(isLoading)
    },
    /**
         * FA icon class helper
         */
    /* faIconClass(file) {
            return FaIconClassHelper.getFaIconClass(file);
        } */
  }
}
</script>

<style lang="scss">
    @import '../assets/scss/file-manager';

    /*.mm {*/
/*    position: relative;*/
/*    .animated {*/
/*      animation-duration: 0.4s;*/
/*    }*/
/*}*/

/*.mm-fixed-height {*/
/*    > .panel {*/
/*        position: absolute;*/
/*        top: 0;*/
/*        bottom: 0;*/
/*        left: 0;*/
/*        right: 0;*/
/*        margin: 0;*/

/*        > .panel-body {*/
/*            position: absolute;*/
/*            top: 0; //47px;*/
/*            bottom: 0;*/
/*            left: 0;*/
/*            right: 0;*/
/*            overflow: auto;*/
/*        }*/
/*    }*/

/*    .mm-content {*/
/*        // position: relative;*/
/*        min-height: 250px;*/
/*    }*/
/*}*/

</style>
