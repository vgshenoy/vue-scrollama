import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  app: {
    head: {
      title: 'vue-scrollama - Scrollytelling component for Vue 3',
      meta: [
        { name: 'description', content: 'Vue 3 component for scroll-driven interactions and scrollytelling. Lightweight, composable, built on Scrollama and IntersectionObserver.' },
        { name: 'keywords', content: 'vue, vue3, scrollama, scrollytelling, scroller, scroll-driven, intersection-observer, vue component' },
        { property: 'og:title', content: 'vue-scrollama - Scrollytelling for Vue 3' },
        { property: 'og:description', content: 'Vue 3 component for scroll-driven interactions and scrollytelling. Lightweight, composable, built on Scrollama.' },
        { property: 'og:url', content: 'https://vue-scrollama.pages.dev' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'vue-scrollama - Scrollytelling for Vue 3' },
        { name: 'twitter:description', content: 'Vue 3 component for scroll-driven interactions and scrollytelling.' },
      ],
      link: [
        { rel: 'canonical', href: 'https://vue-scrollama.pages.dev' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap',
        },
      ],
      script: [
        { src: 'https://cdn.tailwindcss.com', tagPosition: 'head' },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: 'vue-scrollama',
            description: 'Vue 3 component for scroll-driven interactions and scrollytelling, powered by Scrollama and IntersectionObserver.',
            url: 'https://vue-scrollama.pages.dev',
            codeRepository: 'https://github.com/shenoy/vue-scrollama',
            programmingLanguage: ['TypeScript', 'Vue'],
            runtimePlatform: 'Vue 3',
            license: 'https://opensource.org/licenses/MIT',
            keywords: 'vue, vue3, scrollama, scrollytelling, scroller, scroll-driven',
            author: {
              '@type': 'Person',
              name: 'Vignesh Shenoy',
              url: 'https://github.com/shenoy',
            },
          }),
        },
      ],
    },
  },
})
