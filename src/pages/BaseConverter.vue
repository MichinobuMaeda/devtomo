<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-12 col-md-9 col-lg-8 col-xl-6 q-pa-sm">
      <div class="text-h5 text-blue-grey-7">
        <q-icon name="memory" /> {{ $t('baseConverter') }}
      </div>
      <q-form ref="base">
        <div v-for="name in Object.keys(v)" v-bind:key="name">
          <q-input
            v-if="name === 'dec'"
            class="monospace text-h6"
            label="Dec"
            type="number"
            v-model="v[name]"
            :rules="[
              v => !!v || $t('required')
            ]"
          >
            <template v-slot:append>
              <q-btn flat icon="input" @click="onInput(name)" />
            </template>
          </q-input>
          <q-input
            v-else
            :class="'monospace ' + (name.slice(2, 3) === 'h' ? 'text-h6' : 'text-body1')"
            :filled="v[name] === 'Overflow'"
            :label="fullName(name)"
            type="text"
            v-model="v[name]"
            :maxlength="maxLenght(name)"
            :rules="[
              v => !!v || $t('required'),
              v => (
                name.slice(2, 3) === 'h'
                  ? (/^([0-9a-f]+|Overflow)$/.test(v) || $t('charTypes', { chars: '0 - 9, a - f' }))
                  : (/^([01]+|Overflow)$/.test(v) || $t('charTypes', { chars: '0 or 1' }))
              )
            ]"
          >
            <template v-slot:append>
              <q-btn flat icon="input" @click="onInput(name)" />
            </template>
          </q-input>
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
      v: {}
    }
  },
  mounted () {
    this.reset()
  },
  methods: {
    ...mapMutations([
      'setValue'
    ]),
    onInput (name) {
      this.setValue({
        name,
        str: this.v[name]
      })
      this.reset()
    },
    reset () {
      this.v = { ...this.values }
    }
  },
  computed: {
    ...mapState([
      'values'
    ]),
    ...mapGetters([
      'fullName',
      'maxLenght'
    ])
  }
}
</script>
