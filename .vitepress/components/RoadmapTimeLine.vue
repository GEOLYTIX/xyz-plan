<template>
  <div class="timeline-horizontal">
    <div class="timeline-line"></div>
    <div class="timeline-items">
      <div v-for="(item, idx) in items" :key="idx" class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-date">{{ item.date }}</div>
        <div class="timeline-content">
          <h4>{{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.timeline-horizontal {
  position: relative;
  width: 100%;
  padding: 1em 0 0 0;
  overflow-x: auto;
}
.timeline-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 7px;
  background: var(--vp-c-brand-1);
  z-index: 1;
  /*border-radius: 2px;*/
}
.timeline-items {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}
.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 160px;
  flex: 1 1 0;
  position: relative;
}
.timeline-marker {
  width: 20px;
  height: 20px;
  background: #fff;
  border: 4px solid var(--vp-c-brand-1);
  border-radius: 50%;
  /*position: relative;*/
  /*top: calc(50% - 50px);*/
  z-index: 3;
  margin-bottom: 0.5em;
  box-sizing: border-box;
}
.timeline-date {
  font-weight: bold;
  border: 2px solid var(--vp-c-brand-1);
  padding: 4px 18px;
  border-radius: 999px;
  margin-bottom: 0.2em;
  margin-top: 0.5em;
  text-align: center;
}
.timeline-content {
  margin-top: 0.5em;
  text-align: center;
}
@media (max-width: 700px) {
  .timeline-items {
    flex-direction: column;
    align-items: flex-start;
  }
  .timeline-item {
    min-width: 0;
    width: 100%;
    align-items: flex-start;
    margin-bottom: 2em;
  }
  .timeline-line {
    top: 2.5em;
    height: 2px;
  }
  .timeline-marker {
    top: 0;
    margin-bottom: 0.5em;
  }
}
</style>
