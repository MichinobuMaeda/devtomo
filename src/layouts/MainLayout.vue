<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-blue-grey">
        <router-link :to="{ name: 'top' }">
          <q-avatar rounded>
            <img src="statics/app-logo-128x128.png">
          </q-avatar>
        </router-link>
        <q-toolbar-title>
          <router-link :to="{ name: 'top' }" class="">
            Devtomo
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-blue-grey q-pa-xs">
      &copy; 2020 Michinobu Maeda
      <a href="https://github.com/MichinobuMaeda/devtomo" target="_blank" class="q-ma-xs">
        <q-avatar size="sm">
          <img src="statics/GitHub-Mark-Light-32px.png" alt="GitHub" />
        </q-avatar>
      </a>
      <span>Ver.1.1.6</span>
    </q-footer>
  </q-layout>
</template>

<style scoped>
a {
  text-decoration: none;
  color: white;
}
</style>

<script>

export default {
  name: 'MainLayout'
}
</script>
