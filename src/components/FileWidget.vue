<template>

<!--    <b-card img-src="https://placekitten.com/300/300" img-alt="Card image" img-left class="mb-3">-->
<!--        <b-card-text>-->
<!--            Some quick example text to build on the card and make up the bulk of the card's content.-->
<!--        </b-card-text>-->
<!--    </b-card>-->

    <!--                        @contextmenu.native.prevent="onContextMenu(file, $event)"-->
    <!--                    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">-->
    <!--                    @click.native="onMediaClick(file)"-->

    <div class="col-4">
        <div class="file file--grid d-flex flex-row" :id="`fm-file-${file.id}`"
             :class="{ selected: isSelected }"
            @click="onMediaClick(file)">
            <div class="file-preview"
                 :class="[file.type === 'dir' ? 'dir' : '']"
                 @click="onBrowse($event, file)">
<!--                file.type === 'dir' ? onBrowse(file) : ''-->
                <template v-if="file.type === 'file'">
                    <img v-bind:src="file.thumbUrl" class="thumb" v-if="file.thumbUrl">
                    <img v-bind:src="file.url" class="thumb" v-else>
                </template>

                <template v-else-if="file.type === 'dir'">
                    <div class="icon" :class="[file.type]">
                        <font-awesome-icon :icon="['fad', 'folder']" class="fa-5x folder"/>
                        <font-awesome-icon :icon="['fad', 'folder-open']" class="fa-5x folder-open"/>
<!--                        <i class="fa fa-fw fa-folder"></i>-->
                    </div>
                </template>

                <template v-else>
<!--                    <div class="icon">-->
<!--                        <i v-bind:class="mmc.faIconClass(file)"></i>-->
<!--                    </div>-->
                </template>

            </div>

            <div class="file-details d-flex flex-column">
                <div class="file-title">
                    <span>{{ file.filename }}</span>
                </div>
                <div class="file-meta">
                    <template v-if="file.type === 'file'">
                        <span>{{ file.size | prettyBytes }}</span>
                        <font-awesome-icon :icon="['fas', 'circle']" />
                        <span>{{ file.extension }}</span>
                    </template>
                    <template v-else>
                        <span>folder</span>
                    </template>
                </div>

                <file-actions :file="file"></file-actions>

<!--                <div class="file-actions d-flex align-items-end flex-grow-1 justify-content-between">-->
<!--                    <div class="">-->
<!--                        <a v-if="file.type === 'file'"-->
<!--                           class="file-open-external" :href="file.url"-->
<!--                           title="Preview"-->
<!--                           v-on:click.native.stop="onOpenExternal(file)"-->
<!--                           target="_blank">-->
<!--                            <font-awesome-icon :icon="['fad', 'external-link']" />-->
<!--                        </a>-->

<!--                        <a :id="`file-delete-${file.id}`" class="file-delete"-->
<!--                           title="Delete"-->
<!--                           tabindex="0"-->
<!--                           @click.stop="">-->
<!--                            <font-awesome-icon :icon="['fad', 'trash-alt']" class=""/>-->
<!--                        </a>-->
<!--                    </div>-->

<!--                    <b-button variant="primary" size="sm" v-if="file.type === 'file'">Choose</b-button>-->

<!--&lt;!&ndash;                    :show.sync="isSelectingLineHeight"&ndash;&gt;-->
<!--&lt;!&ndash;                    :target="`file-delete-${file.id}`"&ndash;&gt;-->
<!--                    <b-popover triggers="click "-->
<!--                               :ref="`file-delete-${file.id}`"-->
<!--                               :target="`file-delete-${file.id}`"-->
<!--                               placement="top"-->
<!--                               :container="`fm-file-${file.id}`"-->
<!--                               :no-fade="false"-->
<!--                               custom-class="file-delete-confirm"-->
<!--                    >-->
<!--                        <div-->
<!--                             class="confirm-delete-wrapper d-flex">-->
<!--                            <span>Are you sure?</span>-->
<!--                            <a href="javascript:void(0);" class="text-danger ml-2 yes" @click.stop="onDelete(file)">Yes</a>-->
<!--                            <a href="javascript:void(0);" class="ml-2 no" @click.stop="onDeleteCancel(file)">No</a>-->
<!--                        </div>-->
<!--&lt;!&ndash;                        <b-button variant="danger"&ndash;&gt;-->
<!--&lt;!&ndash;                                  @click.stop="onDelete(file)"&ndash;&gt;-->
<!--&lt;!&ndash;                                  size="sm">Sure?</b-button>&ndash;&gt;-->
<!--                    </b-popover>-->

<!--                </div>-->
            </div>
        </div>
    </div>

</template>

<script>
// import { mapState } from 'vuex';
import to from 'await-to-js'
// import FileManagerApi from './file-manager-api.js';
import FileActions from './FileActions.vue'
// import { fileManager as fileManagerStore } from '../store/modules/file-manager'
// import {emailBuilderStore} from "../../utils/store-accessor";
// import vueFilterPrettyBytes from 'vue-filter-pretty-bytes'
// Vue.use(require('vue-filter-pretty-bytes'))

export default {
  props: [ 'file' ],
  components: { FileActions },
  // filter: [vueFilterPrettyBytes],
  data () {
    return {
      api: null,
    }
  },
  computed: {
    // ...mapGetters({
    //     isSelected: isSelected,
    // }),
    mmc () {
      return this.$parent.$parent
    },
    isSelected () {
      return this.$fileManager.isSelected(this.file)
    }
  },
  created () {
    // let options = this.$fileManager.options;
    // console.log(options)

    // this.api = new FileManagerApi(this.$fileManager.options.api);
  },
  methods: {
    onMediaClick (file) {
      // console.log(file)
      // if (file.type === 'dir') {
      //     this.onBrowse(file);
      //     // this.$fileManager.setPath(file.path)
      //     // this.$fileManager.refresh()
      //     // return;
      // }

      this.$fileManager.toggleSelected(file)
    },
    onBrowse ($event, file) {
      // console.log($event)
      // console.log(file)
      if (file.type !== 'dir') return

      // this is required to stop the folder to be selected
      // without this onMediaClick will get called
      $event.stopPropagation()
      $event.stopPropagation()

      this.$emit('browse', file)

      // console.log(response);

      // this.$fileManager.clearSearch()
      //
      // this.$fileManager.setPath(file.path)
    },
    onOpenExternal (file) {
      window.open(file.url, '_blank')
    },
    toggleDeleteConfirm (id) {
      this.$root.$emit('bv::show::popover', `file-delete-${id}`)
    },
    async onDelete (file) {
      // console.log(file)
      // return;
      const [deleteErr, deleteResult] = await this.$fileManager.deleteFiles(file.path)

      // if(error) {
      //     this.error = error.toString();
      // }

      // const [deleteErr, deleteResult] = await to(this.$fileManager.api.delete(file.path))
      // console.log(err)
      // console.log(deleteResult)
      if (deleteErr) {
        let errMessage = deleteErr.response && deleteErr.response.data ? deleteErr.response.data.error.message : "Sorry, we couldn't delete the file. Please try again later."
        this.$bvToast.toast(errMessage, {
          // title: `Variant`,
          noCloseButton: true,
          toaster: 'b-toaster-top-center',
          variant: 'danger',
          // solid: true
        })
      }
      // else {
      //     this.$fileManager.deleteFiles(file.path)
      // }
    },
    onDeleteCancel (file) {
      this.$refs[`file-delete-${file.id}`].$emit('close')
    }
  }
}
</script>
