<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-12 col-md-9 col-lg-8 col-xl-6 q-pa-sm">
      <div class="text-h5 text-blue-grey-7">
        <q-icon name="color_lens" /> {{ $t('colorPicker') }}
      </div>
      <div class="row">
        <div class="col col-xs-3 col-sm-2 col-md-2 col-lg-1 col-xl-1 q-pa-sm">
          <q-input type="number" label="R" v-model="r" @input="onInputRgb('r')" @change="applyRgb" />
        </div>
        <div class="col col-xs-3 col-sm-2 col-md-2 col-lg-1 col-xl-1 q-pa-sm">
          <q-input type="number" label="G" v-model="g" @input="onInputRgb('g')" @change="applyRgb" />
        </div>
        <div class="col col-xs-3 col-sm-2 col-md-2 col-lg-1 col-xl-1 q-pa-sm">
          <q-input type="number" label="B" v-model="b" @input="onInputRgb('b')" @change="applyRgb" />
        </div>
        <div class="col col-xs-3 col-sm-2 col-md-2 col-lg-1 col-xl-1 q-pa-sm">
          <q-input type="text" label="Hex" v-model="hex" mask="\#xxxxxx" fill-mask @change="onInputHex" />
        </div>
        <div class="col col-xs-12 col-sm-4 col-md-4 col-lg-2 col-xl-2 q-pa-sm">
          <q-input type="text" readonly label="Color name" v-model="colorName">
            <template v-slot:after>
              <q-btn color="primary" round icon="more_vert" @click="$refs.colorNames.show()" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="text-center">
        <q-btn flat round color="primary" label="<<" @click="brightnessDown(16)" />
        <q-btn flat round color="primary" label="<" @click="brightnessDown(1)" />
        {{ $t('brightness') }}: {{ ((765 - faceY) * 100 / 765).toFixed(2) }}%
        <q-btn flat round color="primary" label=">" @click="brightnessUp(1)" />
        <q-btn flat round color="primary" label=">>" @click="brightnessUp(16)" />
      </div>
      <div class="row">
        <div class="col col-xs-12 col-sm-6 q-pa-sm">
          <canvas
            id="slice"
            @mousedown="sliceMousedown"
            @mouseup="sliceMouseup"
            @mouseleave="sliceMouseup"
            @mousemove="sliceMousemove"
          />
        </div>
        <div class="col col-xs-12 col-sm-6">
          <canvas
            id="face"
            @mousedown="faceMousedown"
            @mouseup="faceMouseup"
            @mouseleave="faceMouseup"
            @mousemove="faceMousemove"
          />
        </div>
      </div>
    </div>
    <q-dialog ref="colorNames">
      <q-card>
        <q-card-section class="bg-primary">
          <q-btn class="text-white float-right" flat v-close-popup round dense icon="close" />
          <div class="text-white text-h5">
            Color names
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none q-pa-md">
          <q-list>
            <q-item
              v-for="c in namedColors" v-bind:key="c.name"
            >
              <q-item-section
                :style="'background: ' + c.hex + '; color: ' + fgColor(c.hex)"
                class="q-px-xs"
              >
                <q-item-label>
                  {{ c.name }}
                </q-item-label>
                {{ c.hex }}
              </q-item-section>
              <q-item-section
                :style="'background: ' + c.hex + '; color: ' + fgColor(c.hex)"
                avatar
              >
                <q-btn round flat v-close-popup icon="input" @click="setHex(c.hex)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('color')

const sqrt3 = Math.sqrt(3)
const p = 3
const m = 32

const formatHex = (r, g, b) => ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2)

export default {
  name: 'PageColorPicker',
  data () {
    return {
      faceSelected: false,
      faceX: 256 * 1.5,
      faceY: 0,
      sliceSelected: false,
      sliceX: 0,
      sliceY: 0,
      r: 0,
      g: 0,
      b: 0,
      hex: '#000000'
    }
  },
  mounted () {
    this.r = this.color.r
    this.g = this.color.g
    this.b = this.color.b
    this.drawFace()
    this.applyRgb()
  },
  methods: {
    setHex (hex) {
      this.r = parseInt(hex.slice(1, 3), 16)
      this.g = parseInt(hex.slice(3, 5), 16)
      this.b = parseInt(hex.slice(5, 7), 16)
      this.setColor({ r: this.r, g: this.g, b: this.b })
      this.applyRgb()
    },
    fgColor (hex) {
      return (
        parseInt(hex.slice(1, 3), 16) * 0.6 +
        parseInt(hex.slice(3, 5), 16) * 1.26 +
        parseInt(hex.slice(5, 7), 16) * 0.5
      ) < 320 ? 'white' : 'black'
    },
    onInputRgb (rgb) {
      if (this[rgb] < 0) {
        this[rgb] = 0
      } else if (this[rgb] > 255) {
        this[rgb] = 255
      }
    },
    onInputHex () {
      this.hex = this.hex.replace(/_/g, '0').replace(/[g-zG-Z]/g, 'f')
      this.setHex(this.hex)
    },
    applyRgb () {
      const slice = document.getElementById('slice')
      const ox = slice.width / 2
      const oy = slice.height / 2
      this.r = parseInt(this.r, 10)
      this.g = parseInt(this.g, 10)
      this.b = parseInt(this.b, 10)
      this.setColor({ r: this.r, g: this.g, b: this.b })
      this.hex = formatHex(this.r, this.g, this.b)
      this.faceY = 765 - (this.r + this.g + this.b)
      this.sliceX = ox - this.g / 2 * sqrt3 + this.b / 2 * sqrt3
      this.sliceY = oy - this.r + this.g / 2 + this.b / 2
      this.drawBrightnessPointer()
      this.drawSlice()
      this.drawSelectedColor()
    },
    brightnessDown (count) {
      if (this.faceY < 765) {
        this.faceY = Math.min(this.faceY + count, 765)
        this.drawBrightnessPointer()
        this.drawSlice()
        this.updateRdb()
      }
    },
    brightnessUp (count) {
      if (this.faceY > 0) {
        this.faceY = Math.max(this.faceY - count, 0)
        this.drawBrightnessPointer()
        this.drawSlice()
        this.updateRdb()
      }
    },
    sliceMousedown (event) {
      this.sliceSelected = true
      this.setSliceMousePosition(event)
      this.updateRdb()
    },
    sliceMouseup () {
      this.sliceSelected = false
    },
    sliceMousemove (event) {
      if (this.sliceSelected) {
        this.setSliceMousePosition(event)
        this.updateRdb()
      }
    },
    setSliceMousePosition (event) {
      const slice = document.getElementById('slice')
      const rect = slice.getBoundingClientRect()
      this.sliceY = Math.round(Math.max(0, Math.min(slice.height, (event.clientY - rect.top) * slice.height / rect.height)))
      this.sliceX = Math.round(Math.max(0, Math.min(slice.width, (event.clientX - rect.left) * slice.width / rect.width)))
    },
    updateRdb () {
      const slice = document.getElementById('slice')
      const ox = slice.width / 2
      const oy = slice.height / 2
      var len = 640 * 640 * 2
      const rgb = Math.max(765 - this.faceY, 0)
      for (var r = Math.max(0, rgb - 510); r <= Math.min(rgb, 255); ++r) {
        const gb = rgb - r
        for (var g = Math.max(0, gb - 255); g <= Math.min(gb, 255); ++g) {
          const b = gb - g
          const x = ox - g / 2 * sqrt3 + b / 2 * sqrt3
          const y = oy - r + g / 2 + b / 2
          const cur = Math.pow(x - this.sliceX, 2) + Math.pow(y - this.sliceY, 2)
          if (cur < len) {
            len = cur
            this.r = r
            this.g = g
            this.b = b
          }
        }
      }
      this.setColor({ r: this.r, g: this.g, b: this.b })
      this.hex = formatHex(this.r, this.g, this.b)
      this.drawSelectedColor()
    },
    drawSelectedColor () {
      const slice = document.getElementById('slice')
      const ctx = slice.getContext('2d')
      ctx.beginPath()
      ctx.arc(72, 72, 64, 0, 2 * Math.PI)
      ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`
      ctx.fill()
      ctx.strokeStyle = this.faceY > 386 ? 'white' : 'black'
      ctx.stroke()
    },
    faceMousedown (event) {
      this.faceSelected = true
      this.setFaceMousePosition(event)
      this.updateRdb()
    },
    faceMouseup () {
      this.faceSelected = false
    },
    faceMousemove (event) {
      if (this.faceSelected) {
        this.setFaceMousePosition(event)
        this.updateRdb()
      }
    },
    drawSlice () {
      const slice = document.getElementById('slice')
      slice.width = 640
      slice.height = 640
      slice.style.width = '100%'
      const ctx = slice.getContext('2d')

      // background
      const bg = 64 + Math.round(this.faceY / 768 * 256 / 2)
      ctx.fillStyle = `rgb(${bg},${bg},${bg})`
      ctx.fillRect(0, 0, slice.height, slice.width)

      // colors
      const ox = slice.width / 2
      const oy = slice.height / 2
      const rgb = Math.max(765 - this.faceY, 0)
      const drawSelectedColor = this.drawSelectedColor
      setTimeout(function () {
        ctx.fillStyle = `rgb(${bg},${bg},${bg})`
        ctx.fillRect(0, 0, slice.height, slice.width)
        drawSelectedColor()
        for (var r = Math.max(0, rgb - 510); r <= Math.min(rgb, 255); ++r) {
          const gb = rgb - r
          for (var g = Math.max(0, gb - 255); g <= Math.min(gb, 255); ++g) {
            const b = gb - g
            ctx.beginPath()
            ctx.rect(ox - g / 2 * sqrt3 + b / 2 * sqrt3, oy - r + g / 2 + b / 2, p, p)
            ctx.fillStyle = `rgb(${r},${g},${b})`
            ctx.fill()
          }
        }
      }, 30)
    },
    setFaceMousePosition (event) {
      const rect = event.target.getBoundingClientRect()
      this.faceY = (event.clientY - rect.top) * event.target.height / rect.height - (m + p)
      this.faceY = Math.min(Math.max(0, Math.round(this.faceY)), 255 * 3)

      this.faceX = Math.round((event.clientX - rect.left) * event.target.width / rect.width - (m + p))
      this.faceX = Math.min(
        Math.max(
          256 * 1.5 - this.faceY * 1.5,
          0,
          256 * 1.5 - (765 - this.faceY) * 1.5,
          this.faceX
        ),
        256 * 1.5 + this.faceY * 1.5,
        256 * 3 - 1,
        256 * 1.5 + (765 - this.faceY) * 1.5
      )
      this.setHue()
      this.drawBrightnessPointer()
      this.drawSlice()
      this.drawSelectedColor()
    },
    setHue () {
      const slice = document.getElementById('slice')
      const ox = slice.width / 2
      const oy = slice.height / 2
      const l = Math.max(
        256 * 1.5 - this.faceY * 1.5,
        0,
        256 * 1.5 - (765 - this.faceY) * 1.5
      )
      const r = Math.min(
        256 * 1.5 + this.faceY * 1.5,
        256 * 3 - 1,
        256 * 1.5 + (765 - this.faceY) * 1.5
      )
      const hue = (this.faceX - l) / (r - l)
      this.sliceX = ox - Math.sin(hue * 2 * Math.PI) * ox
      this.sliceY = oy - Math.sin((hue + 0.25) * 2 * Math.PI) * oy
    },
    drawBrightnessPointer () {
      const face = document.getElementById('face')
      const ctx = face.getContext('2d')
      const sides = [0, face.width - 20]

      sides.forEach(l => {
        ctx.beginPath()
        ctx.rect(l, 0, 20, face.height)
        ctx.fillStyle = 'rgb(255,255,255)'
        ctx.fill()

        ctx.beginPath()
        ctx.rect(l, m + p + this.faceY, 20, p * 2)
        ctx.fillStyle = 'rgb(192,0,0)'
        ctx.fill()
      })
    },
    drawHuePointer () {
      const face = document.getElementById('face')
      const ctx = face.getContext('2d')
      const sides = [0, face.height - 20]

      sides.forEach(t => {
        ctx.beginPath()
        ctx.rect(0, t, face.width, 20)
        ctx.fillStyle = 'rgb(255,255,255)'
        ctx.fill()

        ctx.beginPath()
        ctx.rect(m + p + this.faceX, t, p * 2, 20)
        ctx.fillStyle = 'rgb(192,0,0)'
        ctx.fill()
      })
    },
    drawFace () {
      const face = document.getElementById('face')
      face.width = 256 * 3 + p * 2 + m * 2
      face.height = 768 + p * 2 + m * 2
      face.style.width = '100%'
      const ctx = face.getContext('2d')

      // background
      const gradient = ctx.createLinearGradient(0, 0, 0, face.height)
      gradient.addColorStop(0, '#404040')
      gradient.addColorStop(1, '#c0c0c0')
      ctx.fillStyle = gradient
      ctx.fillRect(m, m, 256 * 3 + p, 768 + p * 2)

      // colors
      setTimeout(function () {
        const ox = m + p / 2 + 256 * 1.5
        const oy = m + p / 2
        const drawPoint = (x, y, r, g, b) => {
          ctx.beginPath()
          ctx.rect(ox + x, oy + (768 - y), p, p)
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fill()
        }
        for (var y = 0; y < 256; ++y) {
          for (var x = 0; x <= y; ++x) {
            drawPoint(y * -1 / 2 - x * 1, y, x, y - x, 0)
            drawPoint(y / 2 - x * 1, y, 0, x, y - x)
            drawPoint(y * 1.5 - x * 1, y, y - x, 0, x)
            drawPoint(128 - y / 2 + x, y + 256, x, y - x, 255)
            drawPoint(x < y / 2 ? 384 - y / 2 + x : -384 - y / 2 + x, y + 256, 255, x, y - x)
            drawPoint(-128 - y / 2 + x, y + 256, y - x, 255, x)
            drawPoint(-256 - y / 2 + x, 511 - y, 255 - x, 255 + x - y, 0)
            drawPoint(256 - y / 2 + x, 511 - y, 255 + x - y, 0, 255 - x)
            drawPoint(y / -2 + x, 511 - y, 0, 255 - x, 255 + x - y)
            drawPoint(y - x, 767 - y, 255 - x, 255 + x - y, 255)
            drawPoint(x < y / 2 ? y + x : y * -2 + x, 767 - y, 255, 255 + x - y, 255 - x)
            drawPoint(y * -1 + x, 767 - y, 255 - x, 255, 255 + x - y)
          }
        }
      }, 30)
    },
    ...mapMutations([
      'setColor'
    ])
  },
  computed: {
    colorName () {
      return this.namedColors.reduce(
        (ret, cur) => cur.hex.toLowerCase() === this.hex.toLowerCase() ? cur.name : ret,
        ''
      ).toLowerCase()
    },
    ...mapState([
      'color'
    ]),
    ...mapGetters([
      'namedColors'
    ])
  }
}
</script>
