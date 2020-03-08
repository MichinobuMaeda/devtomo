<template>
  <q-page class="row justify-center">
    <div class="col col-xs-12 col-sm-12 col-md-9 col-lg-8 col-xl-6 q-pa-sm">
      <div class="text-h5 text-blue-grey-7">
        <q-icon name="color_lens" /> {{ $t('colorPicker') }}
      </div>
      <div class="text-center">
        RGB: {{ r }}, {{ g }}, {{ b }} {{ hex }}
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
            @mousedown="pollyMousedown"
            @mouseup="pollyMouseup"
            @mouseleave="pollyMouseup"
            @mousemove="pollyMousemove"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
// import { createNamespacedHelpers } from 'vuex'

// const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('color')

const sqrt3 = Math.sqrt(3)
const p = 3
const m = 32

const formatHex = (r, g, b) => '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2)

export default {
  name: 'PageColorPicker',
  data () {
    return {
      faceSelected: false,
      faceX: 256 * 1.5 - 1,
      faceY: 256 * 1.5 - 1,
      sliceSelected: false,
      sliceX: 320,
      sliceY: 320,
      r: 0,
      g: 0,
      b: 0,
      hex: '#000000'
    }
  },
  mounted () {
    this.drawFace()
    this.drawBrightnessPointer()
    this.drawHuePointer()
    this.drawSlice()
    this.updateRdb()
  },
  methods: {
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
      this.hex = formatHex(this.r, this.g, this.b)
    },
    pollyMousedown (event) {
      this.faceSelected = true
      this.setFaceMousePosition(event)
      this.updateRdb()
    },
    pollyMouseup () {
      this.faceSelected = false
    },
    pollyMousemove (event) {
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
      this.drawBrightnessPointer()
      this.drawHuePointer()
      this.drawSlice()
    },
    drawBrightnessPointer () {
      const face = document.getElementById('face')
      const ctx = face.getContext('2d')

      ctx.beginPath()
      ctx.rect(face.width - 20, 0, 20, face.height)
      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(face.width - 20, m + p + this.faceY, 20, p * 2)
      ctx.fillStyle = 'rgb(192,0,0)'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(0, 0, 20, face.height)
      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(0, m + p + this.faceY, 20, p * 2)
      ctx.fillStyle = 'rgb(192,0,0)'
      ctx.fill()
    },
    drawHuePointer () {
      const face = document.getElementById('face')
      const ctx = face.getContext('2d')

      ctx.beginPath()
      ctx.rect(0, face.height - 20, face.width, 20)
      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(m + p + this.faceX, face.height - 20, p * 2, 20)
      ctx.fillStyle = 'rgb(192,0,0)'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(0, 0, face.width, 20)
      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fill()

      ctx.beginPath()
      ctx.rect(m + p + this.faceX - p, 0, p * 2, 20)
      ctx.fillStyle = 'rgb(192,0,0)'
      ctx.fill()
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
    }
  },
  //   ...mapMutations([
  //     'setValue'
  //   ]),
  //   onInput (name) {
  //     this.setValue({
  //       name,
  //       str: this.v[name]
  //     })
  //     this.reset()
  //   },
  //   reset () {
  //     this.v = { ...this.values }
  //   }
  // },
  computed: {
  //   ...mapState([
  //     'values'
  //   ]),
  //   ...mapGetters([
  //     'fullName',
  //     'maxLenght'
  //   ])
  }
}
</script>
