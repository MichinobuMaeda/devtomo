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

    <q-footer elevated class="bg-blue-grey q-pa-sm">
      Devtomo
      <span class="text-orange-3 q-mr-xs">Ver.1.03</span>
      Copyright &copy; 2020 Michinobu Maeda
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
