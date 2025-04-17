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
      link: /sitrep/sitrep-2

features:
  - title: v4.13.1
    icon: 🩹
    details: We have released v4.13.1, This provides quite a few CSS tweaks, and
      bug fixes.
    link: /release/v4.13.1
  - title: v4.13.2
    icon: 🩹
    details: Crucial bugs are solved in this PR todo with user filters & SAML authentication.
      bug fixes.
    link: /release/v4.13.2
  - icon: 🔮
    title: Future Work?
    details: More detail will provided soon 🔜
---

<script setup>
import RoadmapTimeline from './src/components/RoadmapTimeLine.vue'

const roadmap = [
  { date: '2024-04-15', title: 'v4.13.1 Released', description: 'CSS tweaks and Bug Fixes' },
  { date: '2024-04-17', title: 'v4.13.2 Release', description: 'Some Crucial bug fixes' },
  { date: '2024-06', title: 'Future Work', description: 'Long-term roadmap items.' },
]
</script>

## Roadmap

<RoadmapTimeline :items="roadmap" />
