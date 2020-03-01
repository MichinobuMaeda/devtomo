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
      const reloadPage = (path, cb) => {
        const req = new XMLHttpRequest()
        req.open('get', path)
        req.setRequestHeader('Pragma', 'no-cache')
        req.setRequestHeader('Expires', '-1')
        req.setRequestHeader('Cache-Control', 'no-cache')
        req.send()
        req.onreadystatechange = () => {
          if (req.readyState === 4) {
            cb()
          }
        }
      }
      reloadPage(
        '/service-worker.js',
        reloadPage(
          '/',
          reloadPage(
            window.location.href,
            () => {
              caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key))
              })
              setTimeout(() => document.location.reload(true), 1000)
            }
          )
        )
      )
      window.location.reload(true)
    }
  }
}
</script>
