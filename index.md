---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "XYZ Roadmap"
  text: "Where are we??🤔"
  tagline: A good map always has a long road
  image: /geolytix_logo_blue.svg
  actions:
    - theme: brand
      text: Sit Rep
      link: /sitrep/sitrep-1

features:
  - title: v4.13.1
    details: We have released v4.13.1. This comes off the back of our v4.13.0
      release which was massive.
    link: /release/v4.13.1
  - title: v4.14.0
    details: What's coming in v4.14.0
  - title: Future Work?
    details: We have released v4.13.1. This comes off the back of our v4.13.0
      release which was massive.
---

<script setup>
import RoadmapTimeline from './src/components/RoadmapTimeLine.vue'

const roadmap = [
  { date: '2024-03', title: 'v4.13.1 Released', description: 'Major improvements and bug fixes.' },
  { date: '2024-05', title: 'v4.14.0 Planned', description: 'Upcoming features and enhancements.' },
  { date: '2024-06', title: 'Future Work', description: 'Long-term roadmap items.' },
]
</script>

## Roadmap Timeline

<RoadmapTimeline :items="roadmap" />
