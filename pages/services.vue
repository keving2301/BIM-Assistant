<template>
  <div class="services">
    <section class="background-picture">
      <navbar :on_services="true"></navbar>
      <div class="container main-message w-100 ">
        <h1 class="text-center text-lg-left">Services</h1>
      </div>
    </section>
  </div>
</template>

<script>
import navbar from "@/components/navbar";

export default {
  name: "services",
  components: {navbar},
  head: {
    title: 'BIM - Services'
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

@-webkit-keyframes shake {
  from{
    -webkit-transform: rotate(3deg);
  }

  to{
    -webkit-transform: rotate(-3deg);
    -webkit-transform-origin: center
    center;
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