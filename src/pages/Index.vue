<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 q-pa-sm">
      <q-list>
        <q-item clickable :to="{  name: 'password' }">
          <q-item-section avatar>
            <q-icon name="vpn_key" />
          </q-item-section>
          <q-item-section>
            {{ $t('password') }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>
