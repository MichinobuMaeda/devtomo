<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 q-pa-sm">
      <q-list>
        <q-item clickable :to="{  name: 'password' }">
          <q-item-section avatar>
            <q-icon name="security" />
          </q-item-section>
          <q-item-section>
            {{ $t('password') }}
          </q-item-section>
        </q-item>
        <q-item clickable :to="{  name: 'base' }">
          <q-item-section avatar>
            <q-icon name="memory" />
          </q-item-section>
          <q-item-section>
            {{ $t('baseConverter') }}
          </q-item-section>
        </q-item>
        <q-item clickable :to="{  name: 'color' }">
          <q-item-section avatar>
            <q-icon name="color_lens" />
          </q-item-section>
          <q-item-section>
            {{ $t('colorPicker') }}
          </q-item-section>
        </q-item>
        <q-item clickable @click="updateApp">
          <q-item-section avatar>
            <q-icon name="system_update_alt" />
          </q-item-section>
          <q-item-section>
            {{ $t('updateApp') }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  methods: {
    async updateApp () {
      document.location.reload(true)
    }
  }
}
</script>
