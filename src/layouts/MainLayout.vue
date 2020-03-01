<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <router-link :to="{ name: 'top' }">
          <q-avatar rounded>
            <img src="statics/app-logo-128x128.png">
          </q-avatar>
        </router-link>
        <q-toolbar-title>
          Devtomo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout'
}
</script>
