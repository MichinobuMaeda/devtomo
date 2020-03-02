<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-9 col-md-8 col-lg-6 col-xl-4 q-pa-sm">
      <div class="text-h5 text-blue-grey-7">
        <q-icon name="security" /> {{ $t('password') }}
      </div>
      <q-form ref="password">
        <div>
          <q-input
            class="monospace text-h6"
            type="text"
            v-model="result"
            readonly
          >
            <template v-slot:append>
              <q-btn
                color="secondary" no-caps
                :label="$t('copy')"
                @click="copy"
                :disable="!result"
              />
              <q-btn
                color="primary" no-caps
                :label="$t('generate')"
                @click="generate"
                :disable="Number(length) < 4"
              />
            </template>
          </q-input>
        </div>
        <div v-if="!result" class="text-negative">
          {{ $t('errorWrongSettings') }}
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
              @input="generate"
            />
          </div>
          <div class="col col-8">
            <q-select
              v-model="base"
              :options="bases"
              :label="$t('base')"
              emit-value
              map-options
              @input="generate"
            />
          </div>
        </div>
        <div>
          <q-checkbox
            :label="$t('numbers')"
            v-model="useNum"
            @input="generate"
          />
          <q-checkbox
            :label="$t('uppercases')"
            v-model="useUpr"
            @input="generate"
          />
          <q-checkbox
            :label="$t('lowercases')"
            v-model="useLwr"
            @input="generate"
          />
          <q-checkbox
            :label="$t('symbols')"
            v-model="useSym"
            @input="generate"
          />
        </div>
        <div>
          <q-checkbox
            :label="$t('avoidSimilarChars')"
            v-model="avoidSimilarChars"
            @input="generate"
          />
          <q-input
            class="monospace"
            type="text"
            :label="$t('similarChars')"
            v-model="similarChars"
            @input="generate"
          />
        </div>
        <div>
          <q-checkbox
            :label="$t('useAllCharTypes')"
            v-model="useAll"
            @input="generate"
          />
        </div>
        <div>
          <q-checkbox
            :label="$t('avoidSameChars')"
            v-model="avoidSameChars"
            @input="generate"
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
      <div style="line-height: 2em" class="bg-grey-5 q-pa-sm">
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
import { copyToClipboard } from 'quasar'

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
      useAll: true,
      avoidSimilarChars: true,
      avoidSameChars: true,
      similarChars: '',
      maxRepeat: 10000,
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
      this.useAll = true
      this.avoidSimilarChars = false
      this.avoidSameChars = true
      this.similarChars = 'Il10O8B3Egqvu!|[]{}'
      this.generate()
    },
    generate () {
      this.result = ''
      const length = Number(this.length)
      const chars = this.useChars.filter(item => item.use).map(item => item.c)
      if ((length >= 4) && chars) {
        for (var i = 0; i < this.maxRepeat; ++i) {
          const val = Array.from(Array(length).keys()).map(m => {
            const n = Math.floor(Math.random() * chars.length)
            return chars.slice(n, n + 1)
          }).join('')
          if (this.useAll) {
            if (this.useNum && !(/[0-9]/.test(val))) { continue }
            if (this.useUpr && !(/[A-Z]/.test(val))) { continue }
            if (this.useLwr && !(/[a-z]/.test(val))) { continue }
            if (this.useSym && !(/[^0-9A-Za-z]/.test(val))) { continue }
          }
          if (this.avoidSameChars) {
            if (val.split('').some((c, i) => val.slice(i + 1).includes(c))) { continue }
          }
          this.result = val
          break
        }
      }
    },
    async copy () {
      await copyToClipboard(this.result)
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
