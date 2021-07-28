<template>
  <div class="projects">
    <section class="background-picture">
      <navbar :on_projects="true"></navbar>
      <div class="container main-message w-100 ">
        <h1 class="text-center text-md-left">Projects</h1>
        <h5 v-if="!on_delete && !on_create" class="text-center text-md-left">Here are all of your BIM projects</h5>
        <h5 v-show="on_delete" class="text-center text-md-left">Select a project to delete forever</h5>
        <h5 v-show="on_create" class="text-center text-md-left">Enter a name for your new project</h5>
      </div>
    </section>

    <div class="projects-list container justify-content-center row d-flex">
      <button v-if="!on_delete && !on_create" class="btn btn-dark mx-3 text-center" type="button"
              v-on:click="on_create=true">Create New Project
      </button>
      <div v-show="on_create" class="form-group text-center align-content-center mt-3">
        <input id="newProjectName" v-model="project_name" class="form-control" placeholder="New Project Name *"
               required style="min-width: 25vw;" type="text">
        <div>
          <button class="btn btn-dark mx-3 text-center " style="width: 7rem" type="button"
                  v-on:click="new_project(project_name)">Submit
          </button>

          <button v-if="on_create && !on_delete" class="btn btn-danger mx-3 text-center" style="width: 7rem"
                  type="button"
                  v-on:click="on_create=false">Cancel
          </button>
        </div>
      </div>

      <button v-if="!on_delete && !on_create && project_list.length>0" class="btn btn-danger mx-3 text-center"
              type="button" v-on:click="on_delete=true">Delete Project
      </button>

      <div v-show="on_delete" class="form-group">
        <div v-for="(project, idx) of project_list" :key="idx">
          <button :data-target="'#deleteConfirmModalFor' + idx"
                  class="for-hover btn btn-danger mx-auto text-center" data-toggle="modal"
                  type="button">
            {{ project }}
          </button>

          <div :id="'deleteConfirmModalFor' + idx" aria-hidden="true" aria-labelledby="deleteConfirmModal"
               class="modal fade"
               role="dialog" style="top: 40%"
               tabindex="-1">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 id="deleteConfirmLabel" class="modal-title">Are you sure you'd like to delete {{ project }}?</h5>
                  <button aria-label="Close" class="close" data-dismiss="modal" type="button">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <strong class="my-auto">This action cannot be undone.</strong>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-secondary my-auto" data-dismiss="modal" style="width: 40% !important;"
                          type="button">Cancel
                  </button>
                  <button class="btn btn-danger my-auto" data-dismiss="modal" style="width: 40% !important;"
                          type="button" @click="delete_project(project)">Delete {{ project }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!--          <h1 v-if="!on_create && on_delete" @click="delete_project(project)" class="for-hover btn btn-dark btn-danger mx-auto text-center">{{ project }}</h1>-->
        </div>
        <button v-if="!on_create && on_delete" class="btn btn-dark mx-auto text-center" type="button"
                v-on:click="on_delete=false">Cancel
        </button>
      </div>

      <!--Displays list of projects in form of cards-->
      <div v-if="!on_create && !on_delete"
           class="container align-content-center justify-content-center d-flex">
        <div v-for="(project, idx) of project_list" :key="idx" class="card m-3 col-2">
          <nuxt-link class="card-title w-100 h-100 font-weight-bold" to="viewer">
            <div class="card-body">
              <h5 class="text-center">{{ project }}</h5>
              <hr class="border-top"/>
              <img alt="Project Image" class="img-responsive w-100 "
                   src="../assets/images/house-3D-model.jpg" style="border-radius: 20px"/>
              <p class="text-muted card-text mt-3" style="font-size: 18px">Description of the project. </p>
            </div>
          </nuxt-link>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import navbar from '@/components/navbar'

export default {
  name: 'projects',
  components: {
    navbar
  },
  head: {
    title: 'BIM - Projects'
  },
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  data() {
    return {
      project_name: '',
      userName: '',
      project_list: [],
      on_create: false,
      on_delete: false,
    }
  },
  methods: {
    // creates new project
    new_project: async function () {
      let bucketKey
      const bucketRef = this.$fireStore.collection('userdata').doc(this.user.data.uid).collection('buckets').doc(this.project_name)
      console.log(this.project_name)
      await this.$axios.get(`http://localhost:3000/api/createBucket/${this.project_name}`).then(res => {
        bucketKey = Buffer.from(res.data.body.bucketKey).toString('base64')
      })
      bucketRef.get().then(() => {
        bucketRef.set({
          bucketKey: bucketKey
        })
      })
      this.on_create = false
    },
    //deletes an existing project
    delete_project: async function (proj) {
      await this.$axios.get(`http://localhost:3000/api/deleteBucket/${proj}`).then(() => {
        this.$fireStore.collection('userdata').doc(this.user.data.uid).collection('buckets').doc(proj).delete().then(() => {
          this.project_list.splice(1, this.project_list.indexOf(proj))
          this.on_delete = false
        })
      })
    }
  },
  firestore() {
    const userdataRef = this.$fireStore.collection('userdata').doc(this.user.data.uid)
    userdataRef.onSnapshot((docSnapshot) => {
      this.project_list = docSnapshot.data()['projects']
      const bucketRef = this.$fireStore.collection('userdata').doc(this.user.data.uid).collection('buckets')
      bucketRef.onSnapshot(buckets => {
        for (let i = 0; i < buckets.docs.length; ++i) {
          if (!this.project_list.includes(buckets.docs[i].id)) {
            this.project_list.push(buckets.docs[i].id)
          }
        }
      })
    })
  }
}
</script>

<style scoped>

.background-picture::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 4.7rem;
  background: url(../assets/images/wave-large.png) center no-repeat;
  background-size: cover;
}

.background-picture {
  width: 100%;
  height: 45vh;
  background: linear-gradient(135deg, rgba(80, 100, 131, 0.5) 0%, rgba(40, 56, 149, 0.8) 100%),
  url("../assets/images/construction.jpg") center no-repeat;
  background-size: cover;
  position: relative;
}

.projects-list {
  text-align: center;
}

.btn {
  width: 15rem;
}

.btn-danger:hover {
  background-color: #dc3545;
}

.for-hover:hover {
  -webkit-animation: shake .3s ease-in-out .3s infinite alternate;
}

.card {
  border-radius: 10px;
  box-shadow: 0 1px 15px 1px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
  border: 0;
  transition: all .15s ease-in;
  min-width: 250px !important;
  min-height: 350px !important;
}

.card:hover {
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.2);
  text-decoration: none !important;
}

.card-title {
  font-size: 1.1rem;
  text-decoration: none !important;
  color: black;
}

@-webkit-keyframes shake {
  from {
    -webkit-transform: rotate(3deg);
  }

  to {
    -webkit-transform: rotate(-3deg);
    -webkit-transform-origin: center center;
  }
}


/*Screen Resolution with min-width: 700px*/
@media screen and (min-width: 768px) {

  .background-picture::before {
    height: 6.5rem;
  }

  .main-message {
    transform: translateY(50%);
  }
}

/*Screen Resolution with min-width: 950px*/
@media screen and (min-width: 950px) {

  .background-picture {
    height: 22.7rem;
  }

  .background-picture::before {
    height: 9.7rem;
  }

  .main-message {
    transform: translateY(30%);
  }

  .main-message h1 {
    font-size: 3.0rem;
  }
}

/*Screen Resolution with min-width: 1200px*/
@media screen and (min-width: 1100px) {

  .background-picture {
    height: 23.7rem;
  }

  .background-picture::before {
    height: 13.7rem;
  }

  .main-message h1 {
    font-size: 2.7rem;
  }

  .main-message h5 {
    font-size: 1.2rem;
  }
}
</style>
