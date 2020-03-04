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
                @click="generatePassword"
                :disable="Number(p.length) < 4"
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
              v-model="p.length"
              :rules="[
                v => !!v || $t('required'),
                v => minLength <= v || $t('minValue', { val: minLength })
              ]"
              @input="generatePassword"
            />
          </div>
          <div class="col col-8">
            <q-select
              v-model="p.base"
              :options="bases"
              :label="$t('base')"
              emit-value
              map-options
              @input="generatePassword"
            />
          </div>
        </div>
        <div v-if="p.base === 'manualConf'">
          <div>
            <q-checkbox
              :label="$t('numbers')"
              v-model="p.useNum"
              @input="generatePassword"
            />
            <q-checkbox
              :label="$t('uppercases')"
              v-model="p.useUpr"
              @input="generatePassword"
            />
            <q-checkbox
              :label="$t('lowercases')"
              v-model="p.useLwr"
              @input="generatePassword"
            />
            <q-checkbox
              :label="$t('symbols')"
              v-model="p.useSym"
              @input="generatePassword"
            />
          </div>
          <div>
            <q-checkbox
              :label="$t('avoidSimilarChars')"
              v-model="p.avoidSimilarChars"
              @input="generatePassword"
            />
            <q-input
              class="monospace"
              type="text"
              :label="$t('similarChars')"
              v-model="p.similarChars"
              @input="generatePassword"
            />
          </div>
        </div>
        <div>
          <q-checkbox
            :label="$t('useAllCharTypes')"
            v-model="p.useAll"
            @input="generatePassword"
          />
        </div>
        <div>
          <q-checkbox
            :label="$t('avoidSameChars')"
            v-model="p.avoidSameChars"
            @input="generatePassword"
          />
        </div>
        <div>
          <q-btn
            class="q-ma-md" color="negative" no-caps
            :label="$t('reset')"
            @click="resetForm"
          />
        </div>
      </q-form>
      <div style="line-height: 2em" class="bg-grey-5 q-pa-sm">
        <span v-for="item in activeChars" v-bind:key="item.c">
          <span :class="(item.use ? 'bg-white' : 'bg-grey-7 text-white') + ' monospace q-pa-xs'">{{ item.c }}</span>&nbsp;
        </span>
      </div>
    </div>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { copyToClipboard } from 'quasar'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('password')

export default {
  name: 'PageIndex',
  data () {
    return {
      p: {},
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
          label: this.$t('manualConf'),
          value: 'manualConf'
        }
      ]
    }
  },
  mounted () {
    this.p = { ...this.params }
    if (!this.result) {
      this.generate(this.activeChars)
    }
  },
  methods: {
    ...mapMutations([
      'reset',
      'saveParam',
      'generate'
    ]),
    resetForm () {
      this.reset()
      this.p = { ...this.params }
      this.generate(this.activeChars)
    },
    generatePassword () {
      this.saveParam(this.p)
      this.generate(this.activeChars)
    },
    async copy () {
      await copyToClipboard(this.result)
    }
  },
  computed: {
    ...mapState([
      'result',
      'params'
    ]),
    ...mapGetters([
      'activeChars'
    ])
  }
}
</script>
