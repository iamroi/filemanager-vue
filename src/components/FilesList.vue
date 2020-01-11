<template>

    <b-table hover responsive selectable
             ref="mediasTable"
             :items="files"
             :fields="tableFields"
             selected-variant=""
             tbody-tr-class="file file--list"
             class="medias-table"
             @row-clicked="onFileRowClicked"
             @row-dblclicked="onFileRowDoubleClicked"
             @row-selected="onFileRowSelected"
             @input="onFilesTableInput"
    >

        <!-- A custom formatted column -->
        <template v-slot:cell(name)="data">
            <!--                                    {{data}}-->

            <div class="d-flex justify-start align-items-center">
                <div class="file-preview"
                     :class="[data.item.type === 'dir' ? 'dir' : '']"
                     @click="onBrowse($event, data.item)">
                    <!--                                            selected ? isSelected(data.item) : ''-->

                    <!--                file.type === 'dir' ? browse(file) : ''-->
                    <template v-if="data.item.type === 'file'">
                        <img v-bind:src="data.item.thumbUrl" class="thumb" v-if="data.item.thumbUrl">
                        <img v-bind:src="data.item.url" class="thumb" v-else>
                    </template>

                    <template v-else-if="data.item.type === 'dir'">
                        <div class="icon" :class="[data.item.type]">
                            <font-awesome-icon :icon="['fad', 'folder']" class="fa-3x folder"/>
                            <!--                                                <font-awesome-icon :icon="['fad', 'folder-open']" class="fa-2x folder-open"/>-->
                            <!--                        <i class="fa fa-fw fa-folder"></i>-->
                        </div>
                    </template>

                    <template v-else>
                        <div class="icon">
                        </div>
                    </template>
                </div>

                <div class="file-title ml-3">
                    <span>{{ data.item.filename }}</span>
                </div>
            </div>
        </template>

        <template v-slot:cell(date)="data">
            <span>{{ (data.item.timestamp) | moment("Do MMM YYYY") }}</span>
        </template>

        <template v-slot:cell(size)="data">
            <span v-if="data.item.type === 'file'">{{ data.item.size | prettyBytes }}</span>
        </template>

        <template v-slot:cell(type)="data">
            <span v-if="data.item.type === 'file'">{{ data.item.extension }}</span>
            <span v-else>folder</span>
        </template>
        <template v-slot:cell(actions)="data">
            <file-actions :file="data.item"></file-actions>
        </template>

    </b-table>

</template>

<script>
/* global $ */
import { mapState } from 'vuex'
// import FileWidget from './FileWidget.vue';
import FileActions from './FileActions.vue'
// import { fileManager as fileManagerStore } from '../store/modules/file-manager'

export default {
  components: { FileActions },
  data () {
    return {
      tableFields: [
        { key: 'name' },
        { key: 'date' },
        { key: 'size' },
        { key: 'type' },
        { key: 'actions', label: '' }
      ],
      // files: [],
      // loading: false,
    }
  },
  props: {
    // files: {
    //     type: Array,
    //     default: []
    // },

  },
  computed: {
    ...mapState({
      files: state => state['file-manager'].files,
      // basePath: state => state['file-manager'].options.basePath,
      // loading: state => state['file-manager'].loading,
      // search: state => state['file-manager'].search,
      selected: state => state['file-manager'].selected,
    }),
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    onFilesTableInput () {
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
    onFileRowDoubleClicked (file, index, event) {
      this.onBrowse(event, file)
    },
    onFileRowSelected (files) {
      // this.selected = items
      // this.$fileManager.setSelected(files)

    },
    onBrowse ($event, file) {
      // console.log($event)
      if (file.type !== 'dir') return

      // // this is required to stop the folder to be selected
      // // without this onMediaClick will get called
      // $event.stopPropagation();
      // $event.stopPropagation();

      this.$emit('browse', file)

      // this.$fileManager.clearSearch()
      //
      // this.$fileManager.setPath(file.path)
    },
    selectAllRows () {
      this.$refs.mediasTable.selectAllRows()
    },
    clearSelected () {
      this.$refs.mediasTable.clearSelected()
    },
  }
}
</script>
