<template>

    <div class="file-actions " :id="`fm-file-actions-${file.id}`">
        <div class="file-actions__quick">
            <a v-if="file.type === 'file'"
               class="file-open-external" :href="file.url"
               title="Preview"
               v-on:click.stop="onOpenExternal(file)"
               target="_blank">
                <font-awesome-icon :icon="['fad', 'external-link']" />
            </a>

            <a :id="`file-delete-${file.id}`" class="file-delete"
               title="Delete"
               tabindex="0"
               @click.stop="">
                <font-awesome-icon :icon="['fad', 'trash-alt']" class=""/>
            </a>
        </div>

        <b-button variant="primary"
                  size="sm"
                  class="btn-choose"
                  v-if="file.type === 'file'"
                  @click.stop="onChoose($event, file)"
        >Choose</b-button>

        <!--                    :show.sync="isSelectingLineHeight"-->
        <!--                    :target="`file-delete-${file.id}`"-->
        <b-popover triggers="click blur"
                   :ref="`file-delete-${file.id}`"
                   :target="`file-delete-${file.id}`"
                   placement="top"
                   :container="`fm-file-actions-${file.id}`"
                   :no-fade="false"
                   custom-class="file-delete-confirm"
        >
            <div
                class="confirm-delete-wrapper d-flex">
                <span>Are you sure?</span>
                <a href="javascript:void(0);" class="text-danger ml-2 yes" @click.stop="onDelete(file)">Yes</a>
<!--                <a href="javascript:void(0);" class="ml-2 no" @click.stop="onDeleteCancel(file)">No</a>-->
            </div>
            <!--                        <b-button variant="danger"-->
            <!--                                  @click.stop="onDelete(file)"-->
            <!--                                  size="sm">Sure?</b-button>-->
        </b-popover>

    </div>

</template>

<script>
// import { mapState } from 'vuex';
import to from 'await-to-js'
// import FileManagerApi from './file-manager-api.js';
// import { fileManager as fileManagerStore } from '../store/modules/file-manager'
// import {emailBuilderStore} from "../../utils/store-accessor";

export default {
  props: [ 'file' ],
  data () {
    return {
    }
  },
  computed: {
    // ...mapGetters({
    //     isSelected: isSelected,
    // }),
    // isSelected() {
    //     return this.$fileManager.isSelected(this.file)
    // }
  },
  created () {
    // let options = this.$fileManager.options;
    // console.log(options)

    // this.api = new FileManagerApi(this.$fileManager.options.api);
  },
  methods: {
    onOpenExternal (file) {
      window.open(file.url, '_blank')
    },
    // toggleDeleteConfirm(id) {
    //     this.$root.$emit('bv::show::popover', `file-delete-${id}`)
    //
    // },
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

      // this.$fileManager.setLoading(true)

      const [error, response] = await this.$fileManager.refresh()

      // this.$fileManager.setLoading(false)
    },
    onDeleteCancel (file) {
      this.$refs[`file-delete-${file.id}`].$emit('close')
    },
    onChoose ($event, file) {
      this.$fileManager.setChosen(file)
    }
  }
}
</script>
