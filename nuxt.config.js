module.exports = {
    css: [
        '@/assets/stylesheets/app.css'
    ],
    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/firebase',
        '@nuxtjs/axios',
        'bootstrap-vue/nuxt',
        'cookie-universal-nuxt'
    ],
    serverMiddleware: [
        {path: '/api/token', handler: '~/api/getToken.js'},
        {path: '/api/buckets', handler: '~/api/getBucket.js'},
        {path: '/api/objects', handler: '~/api/getBucketObjects.js'},
        {path: '/api/bucketDetails', handler: '~/api/getBucketDetails.js'},
        {path: '/api/createBucket', handler: '~/api/createBucket.js'},
        {path: '/api/deleteBucket', handler: '~/api/deleteBucket'}
    ],
    bootstrapVue: {
        icons: true
    },
    loading: {
        color: '#29d',
        continuous: true,
        throttle: 0
    },
    firebase: {
        config: {
            apiKey: "AIzaSyCzGu7JgGFSoYV4jKsOafTs7S3_1jJtoVE",
            authDomain: "bim-va-jtrhjo.firebaseapp.com",
            databaseURL: "https://bim-va-jtrhjo.firebaseio.com",
            projectId: "bim-va-jtrhjo",
            storageBucket: "bim-va-jtrhjo.appspot.com",
            messagingSenderId: "573839619589",
            appId: "1:573839619589:web:1c32dba0e7efe5ef5ace6c"
        },
        services: {
            auth: {
                persistence: 'local',
                initialize: {
                    onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
                    onAuthStateChangedAction: 'onAuthStateChangedAction'
                },
                ssr: true
            },
            firestore: {
                memoryOnly: false,
                static: false,
                preload: false,
                chunkName: process.env.NODE_ENV !== 'production' ? 'firebase-auth' : '[id]',
                enablePersistence: true
            }
        }
    },
    pwa: {
        meta: false,
        icon: false,
        workbox: {
            importScripts: [
                '/firebase-auth-sw.js'
            ],
            dev: process.env.NODE_ENV !== 'production'
        }
    },
    render: {
        bundleRenderer: {
            runInNewContext: false
        }
    },
    plugins: [
        '@/plugins/firestore',
        {src: '@/plugins/forge-vuer', ssr: false}
    ],
    head: {
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1.0, shrink-to-fit=no'},
            {httpEquiv: 'X-UA-Compatible', content: 'IE=edge'}
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: 'favicon.ico'
            },
            {
                rel: 'stylesheet',
                href: 'https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css'
            },
            {
                rel: 'stylesheet',
                href: 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css'
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Nunito&display=swap'
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Aldrich&display=swap'
            }
        ],
        script: [
            {
                src: 'https://developer.api.autodesk.com/modelderivative/v2/viewers/three.min.js?v=2.7.*'
            },
            {
                src: 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js'
            },
            {
                src: 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1'
            },
            {
                crossOrigin: 'anonymous',
                integrity: 'sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=',
                src: 'https://code.jquery.com/jquery-3.5.1.js'
            },
            {
                crossOrigin: 'anonymous',
                integrity: 'sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV',
                src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'
            },
            {
                type: 'module',
                src: 'https://unpkg.com/ionicons@5.1.2/dist/ionicons/ionicons.esm.js'
            },
            {
                src: 'https://unpkg.com/ionicons@5.1.2/dist/ionicons/ionicons.js'
            }
        ]
    }
}
