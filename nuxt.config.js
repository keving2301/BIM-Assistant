// Nuxt 2 static site (nuxt generate), deployed on Netlify. The server side lives in netlify/functions (Autodesk
// Platform Services calls behind Firebase sign-in); everything here runs in the browser.
export default {
  target: 'static',

  head: {
    titleTemplate: (title) => (title ? `${title} | BIM Virtual Assistant` : 'BIM Virtual Assistant'),
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Upload a building model, explore it in 3D in the browser and ask the assistant about its walls, doors, windows, levels and rooms.'
      },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  },

  css: [
    '@fontsource/ibm-plex-sans/400.css',
    '@fontsource/ibm-plex-sans/500.css',
    '@fontsource/ibm-plex-sans/600.css',
    '@/assets/css/app.css'
  ],

  loading: { color: '#2b3990', height: '3px' },

  components: true,

  modules: ['@nuxtjs/firebase', 'bootstrap-vue/nuxt'],

  // Only the bootstrap-vue parts the app uses, so the bundle does not carry the whole library and icon set.
  bootstrapVue: {
    icons: false,
    componentPlugins: [
      'NavbarPlugin',
      'CollapsePlugin',
      'ModalPlugin',
      'ToastPlugin',
      'FormPlugin',
      'FormGroupPlugin',
      'FormInputPlugin',
      'FormSelectPlugin',
      'FormTextareaPlugin',
      'ButtonPlugin',
      'AlertPlugin',
      'SpinnerPlugin',
      'ProgressPlugin',
      'DropdownPlugin'
    ],
    components: [
      'BIconCheckCircleFill',
      'BIconChevronDown',
      'BIconChevronLeft',
      'BIconCloudUpload',
      'BIconExclamationTriangleFill',
      'BIconFolderPlus',
      'BIconLayoutSidebar',
      'BIconPlus',
      'BIconThreeDots',
      'BIconTrash'
    ]
  },

  firebase: {
    // The web app of the Firebase project bim-virtual-assistant-kg (Kevin's account). These values are public by
    // design; the data is protected by firestore.rules (each user reads and writes only their own).
    config: {
      apiKey: 'AIzaSyCpHKkQlnumWZG-N3c3M7AqpUchlkYviBM',
      authDomain: 'bim-virtual-assistant-kg.firebaseapp.com',
      // Not used (no Realtime Database), but @nuxtjs/firebase requires the key.
      databaseURL: 'https://bim-virtual-assistant-kg.firebaseio.com',
      projectId: 'bim-virtual-assistant-kg',
      storageBucket: 'bim-virtual-assistant-kg.firebasestorage.app',
      messagingSenderId: '1090616755819',
      appId: '1:1090616755819:web:e0df75516d668f2808d32e'
    },
    services: {
      // The module waits for the first auth state before the app starts, then dispatches the action on every change.
      auth: {
        persistence: 'local',
        initialize: { onAuthStateChangedAction: 'onAuthStateChangedAction' }
      },
      firestore: true
    }
  },

  router: {
    middleware: ['auth']
  },

  plugins: ['@/plugins/auth-guard.client.js'],

  generate: {
    fallback: '200.html'
  }
}
