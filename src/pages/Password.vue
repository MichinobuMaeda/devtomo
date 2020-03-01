<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 q-pa-sm">
      <div class="text-h5">
        <q-icon name="vpn_key" /> {{ $t('password') }}
      </div>
      <q-form ref="password">
        <div class="row">
          <div class="col col-9 q-pr-sm">
            <q-input
              type="text"
              v-model="result"
            />
          </div>
          <div class="col col-3 q-pr-sm">
            <q-btn
              color="primary" no-caps
              :label="$t('generate')"
            />
          </div>
        </div>
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
            />
          </div>
        </div>
        <div>
          <q-checkbox
            :label="$t('numbers')"
            v-model="useNum"
          />
          <q-checkbox
            :label="$t('uppercases')"
            v-model="useUpr"
          />
          <q-checkbox
            :label="$t('lowercases')"
            v-model="useLwr"
          />
          <q-checkbox
            :label="$t('symbols')"
            v-model="useSym"
          />
        </div>
        <div>
          <q-checkbox
            :label="$t('avoidSimilarChars')"
            v-model="avoidSimilarChars"
          />
          <q-input
            class="monospace"
            type="text"
            :label="$t('similarChars')"
            v-model="similarChars"
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
export default {
  name: 'PageIndex',
  data () {
    return {
      result: '',
      length: 0,
      base: null,
      useNum: true,
      useUpr: true,
      useLwr: true,
      useSym: true,
      avoidSimilarChars: true,
      similarChars: '',
      minLength: 4,
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
      ],
      baseChars: {
        std64set: '!#%+23456789:=?@ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
        lgr88set: '!"#$%&\'()*+,-./23456789:;<=>?@ABCDEFGHJKLMNOPRSTUVWXYZ[\\]^_abcdefghijkmnopqrstuvwxyz{|}~',
        all94set: '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
      }
    }
  },
  mounted () {
    this.reset()
  },
  methods: {
    reset () {
      this.result = ''
      this.length = 8
      this.base = 'std64set'
      this.useNum = true
      this.useUpr = true
      this.useLwr = true
      this.useSym = true
      this.avoidSimilarChars = false
      this.similarChars = 'Il10O8B3Egqvu!|[]{}'
    }
  },
  computed: {
    useChars () {
      return this.baseChars.all94set.split('').map(c => ({
        use: (this.baseChars[this.base] || '').includes(c) &&
          (this.useNum || /[^0-9]/.test(c)) &&
          (this.useUpr || /[^A-Z]/.test(c)) &&
          (this.useLwr || /[^a-z]/.test(c)) &&
          (this.useSym || /[0-9A-Za-z]/.test(c)) &&
          (!this.avoidSimilarChars || !this.similarChars.includes(c)),
        c
      }))
    }
  }
}
</script>
