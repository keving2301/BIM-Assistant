<template>
  <div id="index">
    <!-- Background pictures section -->
    <section class="background-picture">
      <!-- Navbar -->
      <navbar :on_index="true"></navbar>
      <!-- Fading carousel using Bootstrap-->
      <div id="indexCarousel" class="carousel slide carousel-fade w-100 h-100" data-ride="carousel" data-interval="6000"
           data-wrap="true" style="position: absolute; z-index: -999; top: 0">
        <div class="carousel-inner">
          <!-- First image slide -->
          <div class="carousel-item active">
            <img class="d-block w-100" src="../assets/images/construction.jpg" style="height: 95vh" alt="First slide">
          </div>
          <!-- Second image slide -->
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/images/house-3D-model.jpg" style="height: 95vh" alt="Second slide">
          </div>
          <!-- Third image slide -->
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/images/materials.png" style="height: 95vh" alt="Third slide">
          </div>
          <!-- Fourth image slide -->
          <div class="carousel-item">
            <img class="d-block w-100" src="../assets/images/white-3D-model.jpg" style="height: 95vh"
                 alt="Fourth slide">
          </div>
        </div>
      </div>

      <!-- Centered text over background picture section -->
      <div class="text-center">
        <div class="main-message w-100">
          <!-- Title -->
          <h1>BIM Virtual Assistant</h1>
          <!-- Subtitle -->
          <h5 class="v-enter-active text-center container text-white" style="letter-spacing: 2px; font-size: 1rem; padding: 0">The
            most advanced voice-controlled 3D model assistant</h5>
          <!-- Demo button -->
          <div class="w-100">
            <!-- <button class="btn btn-outline-primary" data-target="#exampleModal" data-toggle="modal" type="button">
              Watch Demo
            </button> -->
            <a class="btn" href="#" style="width: 13rem">Watch Demo</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Section beneath the background pictures -->
    <section class="experience-virtual">
      <!-- Centered text -->
      <div class="text-center">
        <div class="title-heading w-100 p-0" style="margin: 3.25rem 0 4.25rem 0">
          <!-- Title -->
          <h3>Experience</h3>
          <h1 class="w-100">The Virtual World</h1><br>
          <!-- Subtitle -->
          <p>Facilitate working with 3D models by using our virtual assistant to increase your productivity.</p><br>
        </div>
        <!-- Descriptive cards -->
        <div class="features-grid">
          <!-- First card -->
          <div class="features-grid-item virtual-assistant p-3">
            <!-- Icon -->
            <i class="icon ion-md-globe"></i>
            <!-- Title -->
            <h1>Helpful Assistant</h1>
            <!-- Subtitle -->
            <p style="font-size: 1.3rem ">Use our assistant to upload, view, and modify your 3D models.</p>
          </div>
          <!-- Second card -->
          <div class="features-grid-item models-management p-3">
            <!-- Icon -->
            <i class="icon ion-md-people"></i>
            <!-- Title -->
            <h1>Model Management</h1>
            <!-- Subtitle -->
            <p style="font-size: 1.3rem">Manage your models using buckets and explore your models in 3D spaces.</p>
          </div>
          <!-- Third card -->
          <div class="features-grid-item voice-control p-3">
            <!-- Icon -->
            <i class="icon ion-md-mic"></i>
            <!-- Title -->
            <h1>Voice Superpowers</h1>
            <!-- Subtitle -->
            <p style="font-size: 1.3rem">Query your models' properties and do more by using your voice or our convenient
              chat feature.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Third section -->
    <section class="product-owner-section">
      <div class="container">
        <!-- <div class="product-owner">
          <div class="owner-text-box">
            <p class="pb-1 pt-3">Meet the Product Owner</p>
            <i class="icon ion-md-quote pt-3" style="font-size: 6rem"></i>
          </div>
          <div class="owner-links">
            <img alt="Product Owner" src="">
            <div class="linkedin mt-3" style="font-size: 2rem; font-family: 'Aldrich', sans-serif;">
              <a class="linkedin" href="https://www.linkedin.com/in/xuan-lv-14016140/" style="color:white"
                 target="_blank">Xuan Lv</a>
            </div>
          </div>
        </div> -->
      </div>
    </section>

    <!-- FAQ section -->
    <section class="begin-adventure">
      <div class="container">
        <div class="title-heading pb-3">
          <!-- Title -->
          <h1>FAQ</h1>
        </div>
        <div class="row" style="padding-bottom: 2.5rem">
          <div class="col-lg-9 mx-auto">
            <!-- FAQ Accordion -->
            <div id="accordionExample" class="accordion shadow">
              <!-- First question -->
              <div class="card">
                <div id="headingOne" class="card-header bg-white shadow-sm border-0">
                  <h6 class="mb-0 font-weight-bold"><a aria-controls="collapseOne" aria-expanded="false"
                                                       class="d-block position-relative collapsed text-dark text-uppercase collapsible-link py-2"
                                                       data-target="#collapseOne" data-toggle="collapse"
                                                       href="#">How do I use the BIM assistant?</a></h6>
                </div>
                <div id="collapseOne" aria-labelledby="headingOne" class="collapse" data-parent="#accordionExample">
                  <div class="card-body p-5">
                    <!-- First answer -->
                    <p class="font-weight-light m-0">It's easy! If you haven't created an account yet, go to our
                      <nuxt-link to="/sign_up">sign up</nuxt-link>
                      page and make an account. After that, simply create a new project, upload your 3D models, and
                      start using our assistant!
                    </p>
                  </div>
                </div>
              </div>
              <!-- Second question -->
              <div class="card">
                <div id="headingTwo" class="card-header bg-white shadow-sm border-0">
                  <h6 class="mb-0 font-weight-bold"><a aria-controls="collapseTwo" aria-expanded="false"
                                                       class="d-block position-relative collapsed text-dark text-uppercase collapsible-link py-2"
                                                       data-target="#collapseTwo" data-toggle="collapse"
                                                       href="#">How does the BIM assistant work?</a></h6>
                </div>
                <div id="collapseTwo" aria-labelledby="headingTwo" class="collapse" data-parent="#accordionExample">
                  <div class="card-body p-5">
                    <!-- Second answer -->
                    <p class="font-weight-light m-0">Proudly developed from the ground up with Nuxt.js and Vue.js, the
                      BIM assistant uploads your 3D models to a secure bucket in Autodesk so you can access your
                      projects from anywhere.</p>
                    <br/>
                    <p class="font-weight-light m-0">Simply <nuxt-link to="/sign_in">sign in</nuxt-link> to your account to access all of your projects.</p>
                  </div>
                </div>
              </div>
              <!-- Third question -->
              <div class="card">
                <div id="headingThree" class="card-header bg-white shadow-sm border-0">
                  <h6 class="mb-0 font-weight-bold"><a aria-controls="collapseThree" aria-expanded="false"
                                                       class="d-block position-relative collapsed text-dark text-uppercase collapsible-link py-2"
                                                       data-target="#collapseThree" data-toggle="collapse"
                                                       href="#">Is the BIM assistant free to use?</a></h6>
                </div>
                <div id="collapseThree" aria-labelledby="headingThree" class="collapse" data-parent="#accordionExample">
                  <div class="card-body p-5">
                    <!-- Third answer -->
                    <p class="font-weight-light m-0">During development, the assistant will be free to use. Since it's
                      still under construction things may change or break frequently. Rest assured, once the BIM
                      assistant has been (mostly) developed, we will share more information with you.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Text beneath FAQ -->
        <div class="adventure-grid text-center">
          <!-- Left column -->
          <div class="adventure-grid-item">
            <p>Under construction.</p>
          </div>
          <!-- Right column -->
          <div class="adventure-grid-item">
            <p>Thanks for using the BIM assistant!</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <p style="font-size: 1rem">&copy; 2020 BIM Assistant. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import navbar from '@/components/navbar'
import {mapGetters} from 'vuex'

export default {
  name: 'index',
  components: {navbar},
  head: {
    title: 'BIM - Index'
  },
  data() {
    return {
      google_used: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user'
    })
  }
}
</script>

<style scoped>
/* Sets image width + height */
img {
  width: 100%;
  max-width: 100%;
  height: auto;
}

/* Background picture */
.background-picture {
  width: 100%;
  height: 95vh;
  background: linear-gradient(135deg, rgba(80, 100, 131, 0.5) 0%, rgba(40, 56, 149, 0.8) 100%);
  background-size: cover;
  position: relative;
}

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

/* Text over background picture */
.main-message {
  width: fit-content;
  color: #fafafa;
  text-transform: uppercase;
  transform: translateY(20%);
}

.main-message h1 {
  font-family: 'Aldrich', sans-serif;
  font-size: 3.0rem;
  margin: 1rem 0;
}

.v-enter-active {
  animation: bounceIn 1.5s;
  font-size: calc(12px + 0.5vw);
}

/* Animation */
@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0
  }
  40% {
    transform: scale(1.03);
    opacity: 1
  }
  100% {
    transform: scale(1);
  }
}

/* Section beneath background picture */
.experience-virtual {
  padding: 5rem;
  margin-top: -70px;
  position: relative;
  z-index: 999999;
}

/* Title */
.title-heading {
  text-align: center;
  text-transform: uppercase;
  padding-bottom: 2rem;
  color: rgba(0, 0, 0, .7);
}

.title-heading h3 {
  font-size: 1.4rem;
}

.title-heading h1 {
  font-family: 'Aldrich', sans-serif;
  font-size: 2rem;
  margin: 0 0 1rem;
}

.title-heading p {
  text-transform: initial;
  margin-bottom: 0;
  contain: none;
}

/* Cards grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(21rem, 1fr));
  grid-gap: 2.5rem;
}

/* Descriptive card */
.features-grid-item {
  height: 25rem;
  padding: 5rem;
  color: #fafafa;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  font-size: 1rem;
  -webkit-box-shadow: 0 10px 6px -6px #777;
  -moz-box-shadow: 0 10px 6px -6px #777;
  box-shadow: 0 10px 6px -6px #777;
  border-radius: 4px;
}

.features-grid-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background-image: linear-gradient(135deg, rgba(80, 100, 131, 0.5) 0%, rgba(40, 56, 149, 0.8) 100%);
  z-index: -1;
}

.features-grid-item i {
  font-size: 4rem;
  color: #fafafa;
}

.features-grid-item h1 {
  font-family: 'Aldrich', sans-serif;
  font-size: 1.7rem;
  text-transform: uppercase;
  margin: 1rem 0;
}

/* Cards background images */
.virtual-assistant {
  background: url("../assets/images/stars.jpg") center no-repeat;
  background-size: cover;
}

.models-management {
  background: url("../assets/images/hiking.jpg") center no-repeat;
  background-size: cover;
}

.voice-control {
  background: url("../assets/images/camping.jpg") center no-repeat;
  background-size: cover;
}

/* Third section */
.product-owner-section {
  width: 100%;
  height: 80vh;
  background: linear-gradient(135deg, rgba(80, 100, 131, 0.5) 0%, rgba(40, 56, 149, 0.8) 100%),
  url("../assets/images/abstract2.jpg") center no-repeat;
  background-size: cover;
  position: relative;
}

.product-owner-section::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 0;
  width: 100%;
  height: 4.7rem;
  background: url("../assets/images/wave-large-reversed.png") center no-repeat;
  background-size: cover;
}

.product-owner {
  width: 100%;
  color: #fafafa;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.owner-text-box {
  padding: 0 1.5rem;
  margin-bottom: 0.5rem;
  position: relative;
}

.owner-text-box i {
  position: absolute;
  top: -8rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8rem;
  color: #283895;
  opacity: .5;
  z-index: -1;
}

.owner-links img {
  width: 10rem;
  height: 10rem;
  border-radius: 100%;
  -webkit-box-shadow: 0 0 4.5rem 0.5rem rgba(256, 256, 256, 0.75);
  -moz-box-shadow: 0 0 4.5rem 0.5rem rgba(256, 256, 256, 0.75);
  box-shadow: 0 0 4.5rem 0.5rem rgba(256, 256, 256, 0.75);
}

/* FAQ Section */
.begin-adventure {
  margin: 2.5rem;
}

.adventure-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  grid-gap: 2.5rem;
  margin-bottom: 2rem;
}

.adventure-grid-item p {
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 0;
  font-size: 1rem;
}

/* Horizontal line (FAQ) */
.collapsible-link::before {
  content: '';
  width: 14px;
  height: 2px;
  background: #333;
  position: absolute;
  top: calc(50% - 1px);
  right: 1rem;
  display: block;
  transition: all 0.3s;
}

/* Vertical line (FAQ) */
.collapsible-link::after {
  content: '';
  width: 2px;
  height: 14px;
  background: #333;
  position: absolute;
  top: calc(50% - 7px);
  right: calc(1rem + 6px);
  display: block;
  transition: all 0.3s;
}

.collapsible-link[aria-expanded='true']::after {
  transform: rotate(90deg) translateX(-1px);
}

.collapsible-link[aria-expanded='true']::before {
  transform: rotate(180deg);
}

/* Footer */
footer {
  padding: 1rem 0;
  background-color: #7D88B5;
  text-align: center;
  color: white;
}

footer p {
  margin-bottom: 0;
}

/* Screen Resolution with min-width: 350px */
@media screen and (min-width: 350px) {
  .main-message {
    transform: translateY(40%);
  }
}

/* Screen Resolution with min-width: 470px */
@media screen and (min-width: 470px) {
  .background-picture::before {
    height: 9.4rem;
  }

  .product-owner-section::before {
    height: 9.4rem;
  }
}

/* Screen Resolution with min-width: 700px */
@media screen and (min-width: 700px) {
  .background-picture::before {
    height: 10.7rem;
  }

  .main-message {
    transform: translateY(50%);
  }

  .title-heading h1 {
    font-size: 2.5rem;
  }

  .features-grid {
    padding: 3rem;
  }
}

/* Screen Resolution with min-width: 950px */
@media screen and (min-width: 950px) {
  .main-message h1 {
    font-size: 3.5rem;
  }

  .product-owner-section::before {
    height: 10.7rem;
  }
}

/* Screen Resolution with min-width: 1200px */
@media screen and (min-width: 1200px) {
  .background-picture {
    height: 95vh;
  }

  .product-owner-section::before {
    height: 9.7rem;
  }

  .product-owner {
    padding-top: 4rem;
  }

  .main-message h1 {
    font-size: 4rem;
  }

  .features-grid {
    padding: 0;
  }
}

/* Screen Resolution with min-width: 1200px */
@media screen and (min-width: 1600px) {
  .product-owner-section::before {
    height: 13.7rem;
  }
}
</style>