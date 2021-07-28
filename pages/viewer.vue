<template>
  <client-only>
    <div class="forgeViewer overflow-hidden" style="background: white !important;">

      <!--Viewer Navbar-->
      <viewer_navbar></viewer_navbar>
      <!--      <navbar :on_viewer="true" class="py-0"></navbar>-->

      <!--Left Panel Section on viewer-->
      <div class="container-fluid text-center" style="padding: 0">
        <div class="d-inline-flex w-100">

          <!-- Tree Menu for File Browsing -->
          <div class="2D-modeling col-2 bg-light border-right" style="height: 92vh">
            <div class="fileBrowser">

              <!--Create New Bucket-->
              <div class=" w-100 mx-0 my-3 px-0">
                <ion-icon class="float-right" data-target="#newBucket" data-toggle="modal" name="duplicate-outline"
                          style="left: 0!important; font-size: 30px " type="button"></ion-icon>
              </div>
              <!-- New Bucket Modal -->
              <div id="newBucket" aria-hidden="true" aria-labelledby="exampleModalCenterTitle" class="modal fade"
                   role="dialog" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered" role="document">

                  <!-- New Bucket Modal content-->
                  <div class="modal-content">
                    <div class="modal-header " style="border: none">
                      <h5 id="exampleModalLongTitle" class="modal-title ">Create New Bucket</h5>
                      <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body my-2 justify-content-center">
                      <h6 class="mb-4">Enter new bucket name:</h6>
                      <div>
                        <input aria-describedby="inputGroup-sizing-md" aria-label="Small"
                               class="form-control m-0 p-0 pl-4 w-100 "
                               placeholder="Bucket Name"
                               style=" border-radius: 30px;" type="text">
                      </div>
                    </div>
                    <div class="modal-footer justify-content-center" style="border: none">
                      <button class="btn btn-danger" data-dismiss="modal" type="button">Cancel</button>
                      <button class="btn" style="border-color: black" type="button">Save changes</button>
                    </div>
                  </div>

                </div>
              </div>

              <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                      class="navbar-toggler justify-content-center mt-0"
                      data-target=".dual-collapse2"
                      data-toggle="collapse" style="border:none; outline: none" type="button">
                <a class="navbar-brand text-center font-weight-bold mx-auto pl-1" style="letter-spacing: 2px"></a>
                {{ project_name }}
              </button>

              <!--               object links -->
              <div v-for="(object, idx) of myObjectList" :key="idx"
                   class="collapse navbar-collapse w-100 dual-collapse2 my-3 ">
                <button aria-controls="innerSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                        class="navbar-toggler justify-content-center mt-3"
                        data-target=".dual-collapse2"
                        style="border:none; outline: none"
                        type="button" @click="loadObject(object)">
                  <a class="navbar-brand text-center font-weight-bold mx-auto pl-1" style="letter-spacing: 2px"></a>
                  object {{ object }}
                </button>

                <!-- subComponent Links -->
                <div v-for="(subComponent, idx) of subComponents" :key="idx"
                     class="collapse navbar-collapse w-100 dual-collapse2 my-3 ">
                  <ul aria-controls="inner2SupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                      class="navbar-nav ml-auto"
                      data-target=".dual-collapse2">
                    <li class="nav-item text-center ">
                      <a class="nav-link" style="cursor: pointer"> {{ subComponent }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 3D Modeling Section -->
          <div class="3D-modeling col bg-transparent border-0 p-0 m-0" style="height: 92vh">

            <!--<div aria-label="Button group with nested dropdown" class="btn-group" role="group">
              <button class="btn btn-secondary" type="button">Open</button>
              <button class="btn btn-secondary" type="button">Close</button>

              <div class="btn-group" role="group">
                <button id="btnGroupDrop1" aria-expanded="false" aria-haspopup="true"
                        class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" type="button">
                  Levels
                </button>
                <div aria-labelledby="btnGroupDrop1" class="dropdown-menu">
                  <a class="dropdown-item" href="#">Dropdown link</a>
                  <a class="dropdown-item" href="#">Dropdown link</a>
                </div>
              </div>
            </div>-->

            <forge-vuer
                :extensions="extensions"
                :get-access-token="handleAccessToken"
                :urn="myObjectURN"
            />
          </div>

          <div class="col-2 p-0 m-0" style="margin-right: 2rem !important;">
            <!-- 2D Modeling Section -->
            <div class="2D-modeling col bg-light border-left" style="height: 46vh">
              <h6 class="pt-4">2D-Model</h6>
              <forge-vuer
                  :extensions="extensions"
                  :get-access-token="handleAccessToken"
                  :urn="myObjectURN"
                  :headless="true"
                  class="border"
                  style="height: 39vh"
              />
            </div>

            <!-- Utility Section -->
            <div class="2D-modeling col bg-light border-left" style="height: 46vh; overflow: auto">
              <h6 class="mt-4">Utility</h6>

              <!-- Utility Buttons Grid -->
              <div class="utility row d-flex justify-content-center">
                <a class="m-3" data-placement="top" data-toggle="tooltip" href="mailto: abc@example.com"
                   style="width: 3rem; font-size: 35px" title="Email">
                  <ion-icon name="mail-outline"></ion-icon>
                </a>
                <a class="m-3" data-placement="top" data-toggle="tooltip" href="#" style="width: 3rem; font-size: 35px"
                   title="Screenshoot">
                  <ion-icon name="scan-outline"></ion-icon>
                </a>
                <a class="m-3" data-placement="top" data-toggle="tooltip" href="#" style="width: 3rem; font-size: 35px"
                   title="Graph">
                  <ion-icon name="bar-chart-outline"></ion-icon>
                </a>
                <a class="m-3" data-placement="top" data-toggle="tooltip" href="#" style="width: 3rem; font-size: 35px"
                   title="Messenger">
                  <ion-icon name="chatbubbles-outline"></ion-icon>
                </a>
                <a class="m-3" data-placement="top" data-toggle="tooltip" href="#" style="width: 3rem; font-size: 35px"
                   title="Measurements Conversion">
                  <ion-icon name="sync-outline"></ion-icon>
                </a>
                <a class="m-3" data-placement="top" data-toggle="tooltip" href="#" style="width: 3rem; font-size: 35px"
                   title="Share Project">
                  <ion-icon name="share-outline"></ion-icon>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- DialogFlow Chat -->
        <div>
          <df-messenger
              agent-id="7f4325ae-c139-4a5e-9aa7-78f5e0f92326"
              allow="microphone"
              chat-icon="favicon.ico"
              chat-title="BIM Assistant"
              language-code="en"
          ></df-messenger>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import navbar from "@/components/navbar";
import viewer_navbar from "@/components/viewer_navbar";
import myAwesomeExtension from "@/components/forge/extensions/myAwesomeExtension";
import myCustomToolbar from "@/components/forge/extensions/myCustomToolbar";
import '@/assets/stylesheets/viewer.css';

export default {
  name: "viewer",
  components: {
    navbar,
    viewer_navbar
  },
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  head: {
    title: 'BIM - Viewer'
  },
  async asyncData({$axios}) {
    let bucketURN
    let bucketDetails
    let objectList = []
    let i = 0
    await $axios.$get('http://localhost:3000/api/buckets').then(res => {
      bucketURN = res.body.items[4].bucketKey
    })
    await $axios.get(`http://localhost:3000/api/bucketDetails/${bucketURN}`).then(res => {
      bucketDetails = res.body
    })
    await $axios.$get(`http://localhost:3000/api/objects/${bucketURN}`).then(res => {
      //objectURN = Buffer.from(res.body.items[0].objectId).toString('base64')
      // TODO: give each object a default name and let user change it (objects dont have names...)
      // for (i in Buffer.from(res.body.items).length, i++){
      //   objectList.push (Buffer.from(res.body.items[0].objectName).toString('base64'))
      // }
      for (i = 0; i < Buffer.from(res.body.items).length; i++) {
        objectList.push(i)
      }
    })
    return {myObjectList: objectList}
  },
  firestore() {

  },
  data() {
    return {
      myObjectURN: '',
      project_name: "{Your Project Name}",
      folder_name: '',
      object_name: '',
      folder_list: ["Example Folder"],
      object_list: ["Example Object", "Example Object 2"],
      myToken: '',
      tokenPkg: {},
      treeNodePkg: {},
      modelProgress: 0,

      subComponents: ["living", "dining"],

      extensions: {
        myAwesomeExtension,
        myCustomToolbar
      }
    }
  },
  methods: {
    handleAccessToken: async function (onSuccess) {
      await this.$axios.$get('http://localhost:3000/api/token').then(res => {
        onSuccess(res.access_token, res.expires_in)
      }).catch(err => {
        console.error(err)
      })
    },
    loadObject: async function (obj) {
      let bucketURN
      let objectURN
      await this.$axios.$get('http://localhost:3000/api/buckets').then(res => {
        bucketURN = res.body.items[4].bucketKey
      })
      await this.$axios.$get(`http://localhost:3000/api/objects/${bucketURN}`).then(res => {
        objectURN = Buffer.from(res.body.items[obj].objectId).toString('base64')
      })
      this.myObjectURN = objectURN
    }
  },
}
</script>

<style scoped>

.modal-footer .btn {
  width: 7rem;
  margin: .5rem;
}

.btn-danger:hover {
  background-color: #dc3545;
}

input {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

</style>
