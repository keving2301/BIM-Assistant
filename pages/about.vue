<template>
  <div class="about">
    <section class="background-picture">
      <!-- Navbar -->
      <navbar :on_about="true"></navbar>
      <div class="main-message w-100">
        <!-- Title -->
        <h1 class="text-lg-center align-middle">About</h1>
      </div>
    </section>

    <div class="container" style="width: 85% !important">
      <div class="row justify-content-center align-items-center">
        <!-- First left column -->
        <div class="col">
          <img class="w-100" src="../assets/images/white-3D-model.jpg" alt="3D Model">
        </div>
        <!-- First right column -->
        <div class="col">
          <p>BIM (Building Information Modelling) is an intelligent digital representation of physical and functional
            characteristics of a building or infrastructure. It is considered the game changing innovation for the AEC
            (Architecture, Engineering, Construction) industry boasting its operational efficiency providing insights and
            tools to more efficiently plan, design, construct, and manage building and infrastructure.
          </p>
        </div>
        <div class="w-100"></div>
        <!-- Second left column -->
        <div class="col">
          <p>This is the third release of Intelligent BIM Virtual Assistant, a web application that renders 3D models and 2D
            floor plans for BIM objects of different formats with an implemented speech recognition feature for design-based
            queries.</p>
        </div>
        <!-- Second right column -->
        <div class="col">
          <img class="w-100" src="../assets/images/constructors.png" alt="Constructors">
        </div>
        <div class="w-100"></div>
        <!-- Third left column -->
        <div class="col">
          <img class="w-100" src="../assets/images/sunset2.png" alt="Sunset">
        </div>
        <!-- Third right column -->
        <div class="col">
          <p>BIM provides essential insights to aid in efficient planning and management for infrastructure construction.
            It still requires a learning curve for those interested in using the product, yet it can provide an easier way
            to study models by allowing users to make verbal queries to the virtual assistant which can reply through verbal
            messages and highlighting objects in the viewer.</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer>
      <p>&copy; 2020 BIM Assistant. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import navbar from "@/components/navbar";

export default {
  name: "about",
  components: {navbar},
  head: {
    title: 'BIM - About'
  }
}
</script>

<style scoped>
p {
  font-size: 1.4em;
  margin-bottom: 0;
}

/* Background picture */
.background-picture::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  max-width: 100vw;
  height: 4.7rem;
  background: url("../assets/images/wave-large.png") center no-repeat;
  background-size: cover;
}

.background-picture {
  width: 100%;
  max-width: 100vw;
  height: 45vh;
  background: linear-gradient(135deg, rgba(80, 100, 131, 0.5) 0%, rgba(40, 56, 149, 0.8) 100%), center no-repeat;
  background-size: cover;
  position: relative;
}

/* Footer */
footer {
  padding: 1rem 0;
  margin-top: 70px;
  background-color: #7D88B5;
  text-align: center;
  color: white;
}

footer p {
  font-size: 1rem;
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
    font-size: 3.0rem;
  }
}
</style>