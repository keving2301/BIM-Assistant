<template>
  <div class="signUp">
    <navbar :on_sign_up="true"></navbar>
    <div class="h-100 min-vh-100 d-flex row justify-content-center align-items-center mx-auto" style="margin-bottom: 4.5em; margin-top: 2em">
      <div class="card card-signUp align-self-center">
        <div class="card-body">
          <div class="container main-message" style="padding: 0">
            <h1 class="text-center text-md-center" style="color: black; text-shadow: none; margin: 0; font-size: 2.5rem">Sign Up</h1>
          </div>

          <form class="justify-content-center w-100 mx-auto my-0">
            <div class="form-group" style="position: relative">
          <span class="input-group-text icon">
            <ion-icon name="person"></ion-icon>
          </span>
              <input type="text" v-model="username" class="form-control" id="username" aria-describedby="usernameHelp"
                     placeholder="Username *" title="Username" style="padding-left: 2.5em" required>
            </div>
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
              <input type="password" v-model="userPassword" class="form-control" id="userPassword" aria-describedby="passwordHelp"
                     placeholder="Password *" title="Password" style="padding-left: 2.5em" required>
            </div>

            <div class="form-group" style="position: relative">
          <span class="input-group-text icon">
            <ion-icon name="lock-closed"></ion-icon>
          </span>
              <input type="password" v-model="userPasswordConfirmation" class="form-control" id="userPasswordConfirmation" aria-describedby="passwordConfirmationHelp"
                     placeholder="Confirm Password *" title="Confirm Password" style="padding-left: 2.5em" required>
            </div>
            <div class="form-group" style="position: relative">
          <span class="input-group-text icon icon-business">
            <ion-icon name="business"></ion-icon>
          </span>
              <input type="text" v-model="companyName" class="form-control" id="companyName" aria-describedby="companyNameHelp"
                     placeholder="Company Name *" title="Company Name" style="padding-left: 2.5em" required>
            </div>

            <div class="form-group" style="position: relative; margin-bottom: 0">
          <span class="input-group-text icon icon-call">
            <ion-icon name="call"></ion-icon>
          </span>
              <input type="tel" v-model="userPhoneNumber" class="form-control" id="userPhoneNumber" aria-describedby="userPhoneNumberHelp"
                     placeholder="Company Phone Number" title="Company Phone Number" style="padding-left: 2.5em">
            </div>

            <div class="form-group" style="position: relative; margin-bottom: 0">
          <span class="input-group-text icon icon-briefcase">
            <ion-icon name="briefcase"></ion-icon>
          </span>
              <select name="role" id="roles" title="Choose a Role" class="form-control custom-select" v-model="userRole" style="padding-left: 2.3em" required>
                <option value="" disabled selected hidden>Choose a Role *</option>
                <option value="Construction Manager">Construction Manager</option>
                <option value="Estimator">Estimator</option>
                <option value="Architect">Architect</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Construction Expeditor">Construction Expeditor</option>
                <option value="Construction Worker">Construction Worker</option>
                <option value="Electrician">Electrician</option>
                <option value="Engineer">Engineer</option>
                <option value="Construction Foreman">Construction Foreman</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="w-100 text-center">
              <button @click="sign_up" class="btn btn-dark btn-primary btn-block mx-2" type="button">Sign Up</button>
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
  name: 'sign_up',
  components: {navbar},
  head: {
    title: 'BIM - Sign Up'
  },
  data() {
    return {
      username: '',
      userEmail: '',
      userPassword: '',
      userPasswordConfirmation: '',
      companyName: '',
      userPhoneNumber: '',
      userRole: ''
    }
  },
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  methods: {
    sign_up: function() {
      if (this.userPassword === this.userPasswordConfirmation) {
        this.$fireAuth.createUserWithEmailAndPassword(this.userEmail, this.userPassword).then(user => {
          const userdataRef = this.$fireStore.collection('userdata').doc(user.user.uid)
          user.user.updateProfile({displayName: this.username}).then(() => {
            this.$fireAuth.signInWithEmailAndPassword(this.userEmail, this.userPassword).then(() => {
              if (this.userPhoneNumber !== '' && this.companyName !== '') {
                userdataRef.set({
                  companyName: this.companyName,
                  userPhoneNumber: this.userPhoneNumber,
                  userRole: this.userRole,
                  username: this.username,
                  userPassword: this.userPassword,
                  userEmail: this.userEmail,
                  projects: ['Example Project'],
                }).then(() => {
                  this.$router.replace({name: 'index'})
                }).catch(err => {
                  alert(err.message)
                })
              } else if (this.companyName !== '') {
                userdataRef.set({
                  companyName: this.companyName,
                  projects: ['Example Project']
                }).then(() => {
                  this.$router.replace({name: 'index'})
                }).catch(err => {
                  alert(err.message)
                })
              }
            }).catch(err => {
              alert(err.message)
            })
          })
        })
      }
    }
  }
}
</script>

<style scoped>
select, select option {
  min-width: 35vw;
  color: black !important;
}

select:invalid, select option[value=""] {
  color: darkgrey !important;
}

[hidden] {
  display: none;
}

.icon {
  position: absolute;
  display: inline-flex;
  vertical-align: middle;
  background-color: transparent !important;
  border: 0 !important;
  top: 0.26em;
}

.icon-business, .icon-call, .icon-briefcase {
  left: 0.1em;
}

.icon-briefcase {
  bottom: 0;
  top: 1.8em !important;
}

.signUp {
  background: linear-gradient(135deg, rgba(80, 100, 131, 0.5) 0%, rgba(40, 56, 149, 0.8) 100%) no-repeat center fixed !important;
  overflow: auto;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  -o-background-size: cover;
}

.card-signUp {
  border-radius: 1rem;
  border: 0;
  box-shadow: 0 0 2rem 1.5rem rgba(0, 0, 0, 0.1);
}

.card-signUp .card-body {
  padding: 2rem;
}

.form-control {
  background-color: transparent;
  border: none;
  width: 100%;
  box-sizing: border-box;
  border-radius: 0;
  border-bottom: 2px solid black;
  color: black !important;
  margin: 30px auto auto;
}

.form-control:focus {
  background-color: transparent !important;
}

.form-control::placeholder {
  color: darkgrey !important;
}

.btn {
  width: 15rem;
  margin-bottom: 0.15em;
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
    -webkit-transform-origin: center center;
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
@media screen and (min-width: 1100px) {

}
</style>