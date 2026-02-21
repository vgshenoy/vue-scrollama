<template>
  <div>
    <h1>vue-scrollama Nuxt Example</h1>
    <p>Scroll down to see step events fire.</p>
    <div style="height: 50vh" />
    <ClientOnly>
      <ScrollamaDemo />
    </ClientOnly>
    <div style="height: 100vh" />
  </div>
</template>
