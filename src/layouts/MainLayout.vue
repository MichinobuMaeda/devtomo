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
