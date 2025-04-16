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
    <!-- Mobile card view -->
    <div class="timeline-cards">
      <div v-for="(item, idx) in items" :key="idx" class="timeline-card">
        <div class="timeline-card-date">{{ item.date }}</div>
        <div class="timeline-card-content">
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

/* Hide card view by default (desktop) */
.timeline-cards {
  display: none;
}

@media (max-width: 700px) {
  /* Hide timeline view on mobile */
  .timeline-line,
  .timeline-items {
    display: none !important;
  }
  /* Show card view on mobile */
  .timeline-cards {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .timeline-card {
    background: var(--vp-c-bg-soft, #fff);
    border-radius: 12px;
    /*box-shadow: 0 2px 8px 0 rgba(60,60,60,0.04), 0 1.5px 4px 0 rgba(60,60,60,0.04);*/
    padding: 1.2em 1.5em;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /*border: 1px solid var(--vp-c-divider, #e2e2e3);*/
    transition: box-shadow 0.2s;
  }

  .timeline-card:hover {
    box-shadow: 0 4px 16px 0 rgba(60,60,60,0.08), 0 3px 8px 0 rgba(60,60,60,0.08);
  }

  .timeline-card-date {
    font-weight: 600;
    color: var(--vp-c-brand-1);
    margin-bottom: 0.5em;
    font-size: 1.05em;
    letter-spacing: 0.01em;
    opacity: 0.85;
  }

  .timeline-card-content h4 {
    margin: 0 0 0.3em 0;
    font-size: 1.15em;
    font-weight: 600;
    color: var(--vp-c-text-1, #213547);
    line-height: 1.3;
  }

  .timeline-card-content p {
    margin: 0;
    font-size: 1em;
    line-height: 1.7;
    color: var(--vp-c-text-2, #4e5969);
    opacity: 0.95;
  }
}
</style>
