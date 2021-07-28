<template>
  <client-only>
    <!--Viewer Navbar-->
    <div class="d-flex align-items-center border" style="height: 4.5rem">

      <!--Home Button-->
      <div class="ml-3">
        <nuxt-link to="/">
          <ion-icon class="home" name="home-outline" style="font-size: 30px" type="button"></ion-icon>
        </nuxt-link>
      </div>

      <!--Middle Navbar-->
      <div class="w-100 d-flex justify-content-center" style="margin-left: 8rem">
        <nav class="navbar navbar-expand-lg navbar-light">
          <button aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
                  class="navbar-toggler"
                  data-target="#navbarSupportedContent" data-toggle="collapse" type="button" style="border: none">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div id="navbarSupportedContent" class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <a class="nav-link" href="#">Open</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Close</a>
              </li>
              <li class="nav-item dropdown">
                <a id="navbarDropdown" aria-expanded="false" aria-haspopup="true" class="nav-link dropdown-toggle"
                   data-toggle="dropdown"
                   href="#" role="button">
                  Levels
                </a>
                <div aria-labelledby="navbarDropdown" class="dropdown-menu overflow-hidden">
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!--Exit Button-->
      <div class="mr-3 ">
        <nuxt-link class="exit-viewer d-inline-flex align-items-center"
                   style="width: 8rem; text-decoration: none!important" to="/projects">
          <h6 class="pt-2" style="width: 6rem" type="button">Exit Viewer</h6>
          <ion-icon class="exit" name="close-circle-outline" style="font-size: 30px" type="button"></ion-icon>
        </nuxt-link>
      </div>
    </div>
  </client-only>
</template>

<script>
export default {
  name: "viewer_navbar"
}
</script>

<style scoped>

.navbar li {
  margin: 0 1.5rem;
}

.exit:hover {
  color: #dc3545;
}

.exit-viewer:hover {
  color: black;
}

</style>
