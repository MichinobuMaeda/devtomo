<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 q-pa-sm">
      <div class="text-h5">
        <q-icon name="vpn_key" /> {{ $t('password') }}
      </div>
      <q-form ref="password">
        <div class="row">
          <div class="col col-4 q-pr-sm">
            <q-input
              type="number"
              :label="$t('passwordLength')"
              v-model="length"
              :rules="[
                v => !!v || $t('required'),
                v => minLength <= v || $t('minValue', { val: minLength })
              ]"
            />
          </div>
          <div class="col col-8">
            <q-select
              v-model="base"
              :options="bases"
              :label="$t('base')"
              emit-value
              map-options
              @input="updateCharSet"
            />
          </div>
        </div>
        <div>
          <q-checkbox
            :label="$t('numbers')"
            v-model="useNum"
            @input="updateCharSet"
          />
          <q-checkbox
            :label="$t('uppercases')"
            v-model="useUpr"
            @input="updateCharSet"
          />
          <q-checkbox
            :label="$t('lowercases')"
            v-model="useLwr"
            @input="updateCharSet"
          />
          <q-checkbox
            :label="$t('symbols')"
            v-model="useSym"
            @input="updateCharSet"
          />
        </div>
        <div>
          <q-checkbox
            :label="$t('avoidSimilarChars')"
            v-model="avoidSimilarChars"
            @input="updateCharSet"
          />
          <q-input
            class="monospace"
            type="text"
            :label="$t('similarChars')"
            v-model="similarChars"
            @input="updateCharSet"
          />
        </div>
        <div>
          <q-btn
            class="q-ma-md" color="negative" no-caps
            :label="$t('reset')"
            @click="reset"
          />
        </div>
      </q-form>
      <div style="line-height: 2em">
        <span v-for="item in useChars" v-bind:key="item.c">
          <span :class="(item.use ? 'bg-white' : 'bg-grey-7 text-white') + ' monospace q-pa-xs'">{{ item.c }}</span>&nbsp;
        </span>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.monospace {
  font-family: Lucida Console, Courier, monospace;
}
</style>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('password')

export default {
  name: 'PageIndex',
  data () {
    return {
      length: 0,
      base: null,
      useNum: true,
      useUpr: true,
      useLwr: true,
      useSym: true,
      avoidSimilarChars: true,
      similarChars: '',
      bases: [
        {
          label: this.$t('std64set'),
          value: 'std64set'
        },
        {
          label: this.$t('lgr88set'),
          value: 'lgr88set'
        },
        {
          label: this.$t('all94set'),
          value: 'all94set'
        }
      ]
    }
  },
  mounted () {
    this.reset()
    this.updateCharSet()
  },
  methods: {
    reset () {
      this.initialize()
      Object.keys(this.params).forEach(key => {
        this[key] = this.params[key]
      })
      this.updateCharSet()
    },
    updateCharSet () {
      this.update(Object.keys(this.params).reduce((ret, cur) => ({ ...ret, [cur]: this[cur] }), {}))
    },
    ...mapMutations([
      'initialize',
      'update'
    ])
  },
  computed: {
    ...mapGetters([
      'minLength',
      'params',
      'useChars'
    ])
  }
}
</script>
