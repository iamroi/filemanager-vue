// export const fmApi = {
//   baseUrl: null,
//   listUrl: null,
//   downloadUrl: null,
//   uploadUrl: null,
//   deleteUrl: null,
//   options: {}
// }
//
// export const fmDropzoneOptions = {
//   previewsContainer: false,
//   // previewsContainer: '.test',
//   onBody: false,
//   url: fmApi.uploadUrl,
//   headers: {
//     'Cache-Control': null,
//     'X-Requested-With': null,
//   },
//   uploadMultiple: false,
//   clickable: true,
//   maxFilesize: 12,
//   // maxFilesize: 0.1,
//   thumbnailWidth: 200,
//   addRemoveLinks: true,
//   acceptedFiles: '.jpg, .jpeg, .png, .gif',
//   // acceptedFiles: '.dmg',
//   dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> UPLOAD ME",
//   // dictInvalidFileType: "Sorry, this file type is not supported."
// }

export const defaultOptions = {
  basePath: '',
  path: '',
  multipleSelection: true,
  onCreated: null,
  onMounted: null,
  onSelect: null,
  onChoose: null,
  showBreadcrumb: true,
  height: null,
  asVueComponenet: false, // todo hmmm?? something can be utilized?
  dropzone: {
    previewsContainer: false,
    // previewsContainer: '.test',
    onBody: false,
    url: null,
    // url: fmApi.uploadUrl,
    headers: {
      'Cache-Control': null,
      'X-Requested-With': null,
    },
    uploadMultiple: false,
    clickable: true,
    maxFilesize: 12,
    // maxFilesize: 0.1,
    thumbnailWidth: 200,
    addRemoveLinks: true,
    acceptedFiles: '.jpg, .jpeg, .png, .gif',
    // acceptedFiles: '.dmg',
    dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> UPLOAD ME",
    // dictInvalidFileType: "Sorry, this file type is not supported."
  },
  api: {
    baseUrl: null,
    listUrl: null,
    downloadUrl: null,
    uploadUrl: null,
    deleteUrl: null,
    options: {}
  },
}
