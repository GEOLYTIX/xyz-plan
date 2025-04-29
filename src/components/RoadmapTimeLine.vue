<template>
    <div class="container">
      <div class="vertical-line"></div>
      <div v-for="(item, idx) in items" :key="idx">
      <div :class="[item.left ? 'box-left' : 'box-right', 'box']">
        <i class="point"></i>
        <div class="info">
          <a class="VPLink link no-icon VPFeature" :href="item.link">
          <h1>{{item.title}}</h1>
          <p>{{item.description}}</p>
        </a>
        </div>
      </div>
      </div>
    </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  position: relative;
  max-width: 1200px;
  height: fit-content;
  margin: 80px auto;
}

.box {
  position: relative;
  width: 50%;
  padding: 0.25em 3rem;
  opacity: 0;
  animation: animateBox 0.3s linear forwards;
}

@keyframes animateBox {
  0% {
    opacity: 0.8;
    transform: translateY(500px) scale(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.box:nth-child(2) {
  animation-delay: 0s;
}

.box:nth-child(3) {
  animation-delay: 0.4s;
}

.box:nth-child(4) {
  animation-delay: 0.6s;
}

.box:nth-child(5) {
  animation-delay: 0.9s;
}

.box:nth-child(6) {
  animation-delay: 1s;
}

.box:nth-child(7) {
  animation-delay: 1s;
}

.box-left {
  left: -12px;
}

.box-right {
  left: 50%;
}

.box i {
  position: absolute;
  background: var(--vp-c-brand-2);
  /*background: linear-gradient(-311deg, #000000, var(--vp-c-brand-2), #000);*/
  top: 30px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  border-radius: 50%;
  right: -25px;
  z-index: 10;
}

.box .point {
  color: var(--vp-c-brand-2);
  border: 4px solid var(--vp-c-brand-1);
}

.box-right i {
  left: -12px;
}

.info {
  position: relative;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  background: var(--vp-c-sponsor-bg);
  /*color: #fafafa;*/
  box-shadow: 0 5px 9px #000;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.info h1 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
}

.info p {
  font-size: 14px;
  margin-bottom: 10px;
}

.info a {
  text-decoration: none;
  /*display: none;*/
}

.info::after {
  content: "";
  position: absolute;
  top: 25px;
  width: 0;
  height: 0;
  border-top: 14px solid transparent;
  border-bottom: 14px solid transparent;
  border-left: 14px solid var(--vp-c-brand-1);
  right: -14px;
  z-index: 10;
}

.box-right .info::after {
  border-left: 0;
  border-right: 14px solid var(--vp-c-brand-1);
  left: -14px;
}

.vertical-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 6px;
  height: 100%;
  transform: translateX(-50%);
  border-radius: 2px;
  background: linear-gradient(45deg, var(--vp-c-brand-2), var(--vp-c-brand-1) 186%);
  animation: animateLine 3s linear forwards;
}

@keyframes animateLine {
  0% {
    height: 0;
  }

  100% {
    height: 100%;
  }
}

@media screen and (max-width: 775px) {
  .container {
    margin: 40px auto;
  }
  .vertical-line {
    left: 60px;
  }

  .box {
    width: 100%;
    padding-right: 1.5rem;
    padding-left: 109px;
    padding-bottom: 20px
  }

  .box-left,
  .box-right {
    left: 12px;
  }

  .box i {
    left: 35px;
  }

  .info::after {
    left: -16px;
  }

  .box-left .info::after {
    border-left: 0;
    border-right: 14px solid var(--vp-c-brand-1);
    left: -14px;
  }

  /* .box i::after {
    content: "";
    width: 6px;
    height: 50px;
    background-color: red;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  } */
}

@media screen and (max-width: 500px) {
  .vertical-line {
    left: 40px;
  }

  .box {
    width: 100%;
    padding-right: 1.5rem;
    padding-left: 85px;
  }

  .box i {
    left: 15px;
  }

  /* .box i::after {
    content: "";
    width: 5px;
    height: 50px;
    background-color: red;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  } */
}
</style>
