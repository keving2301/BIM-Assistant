<template>
  <client-only>
    <nav class="navbar navbar-expand-md navbar-light text-white justify-content-center">

      <!-- Navbar Brand -->
      <nuxt-link class="navbar-brand d-none ml-3 my-3 d-md-inline-flex text-white font-weight-bold" style="letter-spacing: 2px; pointer-events: none" to="/">
        BIM</nuxt-link>

      <!-- Navbar Toggle -->
      <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
              class="navbar-toggler justify-content-center mt-3"
              data-target=".dual-collapse2"
              data-toggle="collapse" style="border:none; outline: none" type="button">
        <a class="navbar-brand text-center font-weight-bold text-white mx-auto pl-1" style="letter-spacing: 2px">
          BIM
        </a>
      </button>

      <!-- Navbar links -->
      <div class="collapse navbar-collapse w-100 dual-collapse2 my-3 text-white">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item text-center">
            <nuxt-link class="nav-link" to="/">Home</nuxt-link>
          </li>
          <li class="nav-item text-center" v-if="this.user.loggedIn">
            <nuxt-link class="nav-link" to="/projects">Projects</nuxt-link>
          </li>
          <li class="nav-item text-center" v-if="this.user.loggedIn">
            <nuxt-link class="nav-link" to="/profile">My Profile</nuxt-link>
          </li>
          <li class="nav-item text-center">
            <nuxt-link class="nav-link" to="/about">About</nuxt-link>
          </li>
          <!-- Service Link would go here. -->
          <li class="nav-item text-center" v-if="!this.user.loggedIn">
            <nuxt-link class="nav-link" to="/sign_in">Sign In</nuxt-link>
          </li>
          <li class="nav-item text-center" v-if="!this.user.loggedIn">
            <nuxt-link class="nav-link" to="/sign_up">Sign Up</nuxt-link>
          </li>
          <li class="nav-item text-center " v-if="this.user.loggedIn">
            <a @click="sign_out" class="nav-link" style="cursor: pointer">Sign Out</a>
          </li>
        </ul>
      </div>
    </nav>
  </client-only>
</template>

<script>
export default {
  name: 'navbar',
  computed: {
    user() {
      return this.$store.state.user.user
    }
  },
  methods: {
    sign_out: function () {
      if (this.$fireAuth.currentUser) {
        this.$fireAuth.signOut().then(() => {
          if (this.$router.currentRoute.name !== 'index') {
            this.$router.push({name: 'index'})
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.navbar-nav li {
  padding-right: 1vw;
  padding-left: 1vw;
}

.nav-link {
  color: white !important;
}

.navbar a::before,
.navbar a::after {
  display: inline-block;
  opacity: 0;
  -webkit-transition: -webkit-transform 0.3s, opacity 0.2s;
  -moz-transition: -moz-transform 0.3s, opacity 0.2s;
  transition: transform 0.3s, opacity 0.2s;
}

.navbar a::before {
  margin-right: 10px;
  content: '<';
  -webkit-transform: translateX(20px);
  -moz-transform: translateX(20px);
  transform: translateX(20px);
}

.navbar a::after {
  margin-left: 10px;
  content: '>';
  -webkit-transform: translateX(-20px);
  -moz-transform: translateX(-20px);
  transform: translateX(-20px);
}

.navbar a:hover::before,
.navbar a:hover::after,
.navbar a:focus::before,
.navbar a:focus::after {
  opacity: 1;
  -webkit-transform: translateX(0px);
  -moz-transform: translateX(0px);
  transform: translateX(0px);
}

/*Screen Resolution with min-width: 700px*/
@media screen and (min-width: 768px) {

}
</style>