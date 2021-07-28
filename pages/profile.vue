<template>
  <div class="profile">
    <!-- Top section -->
    <section class="background-picture">
      <!-- Navbar -->
      <navbar :on_profile="true"></navbar>
      <div class="main-message w-100">
        <!-- Title -->
        <h1 class="text-lg-center">My Profile</h1>
      </div>
    </section>

    <div class="row container justify-content-center" style="padding: 0">
      <!-- Display user info -->
      <div class="m-3 p-5 bg-light col" style="width: 100%; height: 12rem; border-radius: 30px">
        <h5><ion-icon name="person-outline"></ion-icon>{{ userName || 'No Name Set' }}</h5>
        <h5><ion-icon name="business-outline"></ion-icon>{{ companyName || 'No Company Name Set' }}</h5>
        <h5><ion-icon name="briefcase-outline"></ion-icon>{{ userRole || 'No Role Set'}}</h5>
        <h5><ion-icon name="call-outline"></ion-icon>{{ phone || 'No Phone Number Set' }}</h5>
        <h5><ion-icon name="mail-outline"></ion-icon>{{ userEmail || 'No Email Set' }}</h5>
        <div v-if="userRole==='Construction Manager'"></div>
      </div>

      <!-- Display Projects under user -->
      <div class="m-3 p-5 bg-light col" style="width: 100%; height: auto; border-radius: 30px">
        <h5><ion-icon name="cube-outline"></ion-icon>List of Projects</h5>
        <div class="align-content-center justify-content-center d-flex">
          <div v-for="(project, idx) of project_list" :key="idx" class="card m-3 mt-5 col-2">
            <nuxt-link class="card-title w-100 h-100 font-weight-bold" to="viewer">
              <div class="card-body">
                <h6 class="text-center mx-0">{{ project }}</h6>
                <hr class="border-top"/>
                <img alt="Project Image" class="img-responsive w-100"
                     src="../assets/images/house-3D-model.jpg" style="border-radius: 20px"/>
                <p class="text-muted card-text mt-3" style="font-size: 14px">URN: xxxyyyzzz</p>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/components/navbar";

export default {
  name: "profile",
  components: {navbar},
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  data() {
    return {
      userRole: '',
      companyName: '',
      phone: '',
      userName: '',
      userEmail: '',
      userPassword: '',
      on_manager: Boolean,
      project_list: []
    }
  },
  firestore() {
    const userdataRef = this.$fireStore.collection('userdata').doc(this.user.data.uid)
    userdataRef.onSnapshot((docSnapshot) => {
      this.userRole = docSnapshot.data()['userRole']
      this.companyName = docSnapshot.data()['companyName']
      this.phone = docSnapshot.data()['userPhoneNumber']
      this.userName = docSnapshot.data()['username']
      this.userEmail = docSnapshot.data()['userEmail']
      this.userPassword = docSnapshot.data()['userPassword']
      this.project_list = docSnapshot.data()['projects']
      if (this.userRole == null) {
        this.userRole = "Software Engineer"
      }
      const bucketRef = this.$fireStore.collection('userdata').doc(this.user.data.uid).collection('buckets')
      bucketRef.onSnapshot(buckets => {
        for (let i = 0; i < buckets.docs.length; ++i) {
          if (!this.project_list.includes(buckets.docs[i].id)) {
            this.project_list.push(buckets.docs[i].id)
          }
        }
      })
    })
    //const companyEmployees = db.collection('userdata')
  },
  head: {
    title: 'BIM - Profile'
  }
}
</script>

<style scoped>
/* Background picture */
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

/* Title */
h5 {
  margin-bottom: 1rem;
  margin-left: 2rem;
  font-family: "Roboto", sans-serif;
}

/* Icon */
ion-icon {
  margin-right: 3rem;
}

/* Descriptive card */
.card {
  border-radius: 10px;
  box-shadow: 0 1px 15px 1px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
  border: 0;
  transition: all .15s ease-in;
  min-width: 180px !important;
  min-height: 250px !important;
  text-align: center;
}

.card:hover {
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.2);
  text-decoration: none !important;
}

.card-title {
  font-size: 1.1rem;
  text-decoration: none !important;
  color: black;
  text-align: center;
}

/* Animation */
@-webkit-keyframes shake {
  from {
    -webkit-transform: rotate(3deg);
  }

  to {
    -webkit-transform: rotate(-3deg);
    -webkit-transform-origin: center center;
  }
}


/* Screen Resolution with min-width: 700px */
@media screen and (min-width: 768px) {
  .background-picture::before {
    height: 6.5rem;
  }

  .main-message {
    transform: translateY(50%);
  }
}

/* Screen Resolution with min-width: 950px */
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

/* Screen Resolution with min-width: 1200px */
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