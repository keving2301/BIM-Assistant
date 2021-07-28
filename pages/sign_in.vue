<template>
  <div class="signIn">
    <navbar :on_sign_in="true"></navbar>

    <div class="h-100 min-vh-100 d-flex row justify-content-center align-items-center mx-auto">
      <div class="card card-signIn">
        <div class="card-body">
          <div class="container main-message" style="padding: 0">
            <h1 class="text-center text-md-center" style="color: black; text-shadow: none; margin: 0; font-size: 2.5rem">Sign In</h1>
          </div>

          <form class="form-group w-100" style="margin-bottom: 0">
            <div class="form-group" style="position: relative">
                  <span class="input-group-text icon">
                    <ion-icon name="mail"></ion-icon>
                  </span>
              <input type="email" v-model="userEmail" class="form-control" id="userEmail" aria-describedby="emailHelp"
                     placeholder="Email Address *" title="Email Address" style="padding-left: 2.5em" required autofocus>
            </div>

            <div class="form-group" style="position: relative">
                  <span class="input-group-text icon">
                    <ion-icon name="lock-closed"></ion-icon>
                  </span>
              <input type="password" v-model="userPassword" class="form-control" id="userPassword"
                     aria-describedby="passwordHelp" title="Password" placeholder="Password *" style="padding-left: 2.5em" required>
            </div>

            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="customCheck">
              <label class="custom-control-label" for="customCheck">Remember me</label>
            </div>

            <div class="w-100 text-center">
              <button @click="sign_in" class="btn btn-dark btn-primary btn-block mx-2" type="button">Sign In</button>
            </div>

            <div class="w-100 text-center">
              <button @click="forge_sign_in" class="btn btn-dark btn-primary btn-block mx-2" type="button">Forge Sign In</button>
            </div>

            <!-- Divider Text -->
            <div class="form-group col-lg-12 mx-auto d-flex justify-content-center align-items-center" style="margin-bottom: 0; padding: 0">
              <div class="border-bottom w-50 ml-5"></div>
              <span class="px-2 small text-muted font-weight-bold">OR</span>
              <div class="border-bottom w-50 mr-5"></div>
            </div>

            <div class="w-100 text-center d-flex justify-content-center">
              <button @click="google_sign_in" class="google-btn btn btn-block btn-light mx-2" style="position: relative; padding-left: 2em; margin-bottom: 1.1em" type="button"><ion-icon name="logo-google" style="position: absolute; left: 1.4em; top: 1em; display: block"></ion-icon> Continue with Google</button>
            </div>

          </form>
        </div>
      </div>
    </div>

    <footer>
      <p style="font-size: 1rem">&copy; 2020 BIM Assistant. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import navbar from '@/components/navbar'

export default {
  // The name of the Vue component.
  name: 'sign_in',
  // Components that this Vue component contains.
  components: {navbar},
  head: {
    title: 'BIM - Sign In'
  },
  data() {
    return {
      userEmail: '',
      userPassword: '',
      google_used: false
    }
  },
  methods: {
    // Basic sign in function.
    sign_in: function () {
      /**
       * Firebase authentication (using an email and password).
       *
       * Using the variables defined in data(), we call the signInWithEmailAndPassword method from firebase.auth().
       * We handle the promise that this method returns by calling .then(), with a void handle ().
       */
      this.$fireAuth.signInWithEmailAndPassword(this.userEmail, this.userPassword).then(user => {
        const userdataRef = this.$fireStore.collection('userdata').doc(user.user.uid)
        //Create bucket if no project exists
        userdataRef.get().then((docSnapshot) => {
          if (docSnapshot.exists) {
            if (!docSnapshot.get('projects')) {
              userdataRef.update({
                projects: ['Example Project']
              })
            }
          }
        })
        // Redirect the user to the index page after sign in completion.
        this.$router.replace({name: 'index'})
      }).catch(err => {
        // Alert the user with the appropriate message.
        alert(err.message)
      })
    },
    // Sign in using Google OAuth.
    google_sign_in: function () {
      this.$router.replace({name: 'index'})
      let provider = new this.$fireAuthObj.GoogleAuthProvider();
      this.$fireAuth.signInWithRedirect(provider)
    },


    forge_sign_in: function(){
      this.$fireAuth.signInWithEmailAndPassword(this.userEmail, this.userPassword).then(user => {
        const userdataRef = this.$fireStore.collection('userdata').doc(user.user.uid)
        //Create bucket if no project exists
        userdataRef.get().then((docSnapshot) => {
          if (docSnapshot.exists) {
            if (!docSnapshot.get('projects')) {
              userdataRef.update({
                projects: ['Example Project']
              })
            }
          }
        })
        // Redirect the user to the index page after sign in completion.
        this.$router.replace({name: 'index'})
      }).catch(err => {
        // Alert the user with the appropriate message.
        alert(err.message)
      })
    }
    }
}
</script>

<style scoped>
.icon {
  position: absolute;
  display: inline-flex;
  vertical-align: middle;
  background-color: transparent !important;
  border: 0 !important;
  top: 0.26em;
}

.card-signIn {
  border-radius: 1rem;
  border: 0;
  box-shadow: 0 0 2rem 1.5rem rgba(0, 0, 0, 0.1);
}

.card-signIn .card-body {
  padding: 2rem;
}

.signIn {
  background: linear-gradient(135deg, rgba(80, 100, 131, 0.5) 0%, rgba(40, 56, 149, 0.8) 100%) no-repeat center fixed !important;
  height: 100vh;
  overflow: auto;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  -o-background-size: cover;
}

.form-control {
  background-color: transparent;
  border: none;
  width: 100%;
  box-sizing: border-box;
  border-radius: 0;
  border-bottom: 2px solid black;
  min-width: 35vw;
  color: black !important;
  margin: 30px auto auto;
}

.form-control:focus {
  background-color: transparent !important;
}

.form-control::placeholder {
  color: darkgrey;
}

.btn {
  width: 15rem;
}

.google-btn {
  margin-top: 2em;
  background-size: 300% 100%;
  color: white;
  background-image: linear-gradient(135deg, rgb(50, 100, 131) 0%, rgb(40, 56, 149) 100%);
  border-radius: 50px;
  transition: all 650ms ease-in-out;
}

.google-btn:hover {
  background-position: 100% 0;
  transition: all 650ms ease-in-out;
}

.google-btn:focus {
  outline: none;
}

footer {
  padding: 1rem 0;
  color: white;
  text-align: center;
}

footer p {
  margin-bottom: 0;
}

@-webkit-keyframes shake {
  from {
    -webkit-transform: rotate(3deg);
  }

  to {
    -webkit-transform: rotate(-3deg);
    -webkit-transform-origin: center
    center;
  }
}

/*Screen Resolution with min-width: 350px*/
@media screen and (min-width: 350px) {

}

/*Screen Resolution with min-width: 700px*/
@media screen and (min-width: 768px) {

}

/*Screen Resolution with min-width: 950px*/
@media screen and (min-width: 950px) {

}

/*Screen Resolution with min-width: 1200px*/
@media screen and (min-width: 1200px) {
  .main-message h1 {
    font-size: 2.7rem;
  }

  .main-message h5 {
    font-size: 1.2rem;
  }
}
</style>