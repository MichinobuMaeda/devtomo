<template>
  <q-layout view="lHh Lpr lFf">
    <router-link :to="{ name: 'top' }">
      <q-header elevated>
        <q-toolbar class="bg-blue-grey">
          <q-avatar rounded>
            <img src="statics/app-logo-128x128.png">
          </q-avatar>
          <q-toolbar-title>
            Devtomo
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
    </router-link>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-blue-grey q-pa-xs">
      &copy; 2020 Michinobu Maeda
      <a href="https://github.com/MichinobuMaeda/devtomo" rel="noreferrer noopener" target="_blank" class="q-ma-xs">
        <q-avatar size="sm">
          <img src="statics/GitHub-Mark-Light-32px.png" alt="GitHub" />
        </q-avatar>
      </a>
      <span>Ver.1.1.8</span>
    </q-footer>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout'
}
</script>
