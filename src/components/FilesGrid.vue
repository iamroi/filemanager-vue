<template>
    <div class="w-100">
    <b-row class="">
        <file-widget
                v-for="file in files"
                :file="file"
                :key="file.path"
                class="animated fadeIn"
                @browse="$emit('browse', file)"
        >
        </file-widget>
    </b-row>
    </div>
</template>

<script>
/* global $ */
import { mapState } from 'vuex'
import FileWidget from './FileWidget.vue'
// import FileActions from './FileActions.vue';
// import { fileManager as fileManagerStore } from '../store/modules/file-manager'

export default {
  components: { FileWidget },
  data () {
    return {
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
      // selected: state => state['file-manager'].selected,
    }),
  },
  watch: {
  },
  mounted () {
  },
  methods: {

  }
}
</script>
