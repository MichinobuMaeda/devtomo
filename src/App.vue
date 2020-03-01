<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  created () {
    const userLang = navigator.language || navigator.userLanguage
    if (userLang.slice(0, 2).toLowerCase() === 'ja') {
      this.$root.$i18n.locale = 'ja-jp'
    }
  },
  name: 'App'
}
</script>
