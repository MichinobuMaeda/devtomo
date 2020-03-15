<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-12 col-md-9 col-lg-8 col-xl-6 q-pa-sm">
      <div class="text-h5 text-blue-grey-7">
        <q-icon name="memory" /> {{ $t('baseConverter') }}
      </div>
      <q-form ref="base">
        <div v-for="name in Object.keys(v)" v-bind:key="name">
          <div class="row" v-if="name === 'dec'">
            <div class="col col-8">
              <q-input
                class="monospace text-h6"
                label="Dec"
                type="number"
                v-model="v[name]"
                :rules="[
                  v => !!v || $t('required')
                ]"
                @change="onChange(name)"
              />
            </div>
            <div class="col col-4 q-pl-md">
              <q-input
                class="monospace text-h6"
                label="Character"
                type="text"
                v-model="c"
                @change="onChangeCharacter"
              />
            </div>
          </div>
          <q-input
            v-else
            :class="'monospace ' + (name.slice(2, 3) === 'h' ? 'text-h6' : 'text-body1')"
            :label="fullName(name)"
            type="text"
            v-model="v[name]"
            :maxlength="maxLenght(name)"
            :rules="[
              v => !!v || 'NaN',
              v => (
                name.slice(2, 3) === 'h'
                  ? (/^([0-9A-Fa-f]+)$/.test(v) || $t('charTypes', { chars: '0 - 9, A - F, a - f' }))
                  : (/^([01]+)$/.test(v) || $t('charTypes', { chars: '0 or 1' }))
              )
            ]"
            @change="onChange(name)"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('base')

export default {
  name: 'PageBaseConverter',
  data () {
    return {
      v: {},
      c: ''
    }
  },
  mounted () {
    this.show()
  },
  methods: {
    ...mapMutations([
      'setValue'
    ]),
    show () {
      this.v = { ...this.values }
      this.c = this.v.duh ? this.unicode(parseInt(this.v.duh, 16)) : ''
    },
    onChange (name) {
      this.setValue({
        name,
        str: this.v[name]
      })
      this.show()
    },
    onChangeCharacter () {
      if (this.c && this.c.length === 1) {
        this.v.duh = this.c.charCodeAt(0).toString(16)
        this.onChange('duh')
      }
    }
  },
  computed: {
    ...mapState([
      'values'
    ]),
    ...mapGetters([
      'fullName',
      'maxLenght',
      'unicode'
    ])
  }
}
</script>
