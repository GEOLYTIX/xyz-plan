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
    - theme: brand
      text: API
      link: /api/

features:
  - title: v4.13.2
    icon: 🩹
    details:
      Crucial bugs are solved in this PR todo with user filters & SAML authentication.
      bug fixes.
    link: /release/v4.13.2
  - title: v4.14.1
    icon: 🩹
    details: Gazetteer, queryParams & the control panel bugs solved!
    link: /release/v4.14.1
  - icon: 🔮
    title: Future Work?
    details: More detail will provided soon 🔜
---

<script setup>
import RoadmapTimeline from './src/components/RoadmapTimeLine.vue'

const roadmap = [
  { date: '2025-04-15', title: 'v4.13.1', description: 'CSS tweaks and Bug Fixes', link: '/release/v4.13.1',  left: true },
  { date: '2025-04-17', title: 'v4.13.2', description: 'Some Crucial bug fixes', link: '/release/v4.13.2', left: false },
  { date: '2025-04-17', title: 'v4.14.0', description: 'XHR Abort Utility & Email Filter Added!', link: '/release/v4.14.0',  left: true },
  { date: '2025-04-29', title: 'v4.14.1', description: 'Gazetteer, queryParams & the control panel bugs solved!',link: 'release/v4.14.1',  left: false },
]
</script>

## Roadmap

<RoadmapTimeline :items="roadmap" />
