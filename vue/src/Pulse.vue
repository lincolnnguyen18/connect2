<script>
export default {
  // data () {
  //   return {
  //     thickness: 10,
  //   }
  // },
  props: {
    color: {
      type: String,
      default: 'red'
    },
    width: {
      type: Number,
      default: 24
    },
    radius1: {
      type: Number,
      default: 100
    },
    radius2: {
      type: Number,
      default: 50
    },
    step: {
      type: Number,
      default: 0.01
    }
  },
  mounted () {
    let canvas = this.$refs.canvas

    let color = this.color;

    // detect mouse enter canvs
    canvas.addEventListener('mouseenter', () => {
      // make color transparent by 0.5
      color = 'rgb(255, 118, 118)';
    });

    // detect mouse leave canvas
    canvas.addEventListener('mouseleave', function(e) {
      color = 'red';
    });

    let ctx = canvas.getContext('2d')
    let radius = this.radius1;
    let sign = 1;
    canvas.width = this.width;
    canvas.height = this.width;
    // animate pulsing filled circle by increasing and decreasing radius
    const drawIt = () => {
      var canvas = this.$refs.canvas;
      var ctx = canvas.getContext('2d'); 
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // draw filled circle with radius
      ctx.beginPath();
      ctx.arc(this.width / 2, this.width / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      if (radius > this.radius1) {
        sign = -1;
      } else if (radius < this.radius2) {
        sign = 1;
      }
      radius += this.step * sign;
      ctx.save();
      ctx.restore();
      window.requestAnimationFrame(drawIt);
    }
    window.requestAnimationFrame(drawIt);
  }
}
</script>

<template>
  <!-- <canvas data-thickness="10" data-ringcolor="blue" data-filledcolor="1" data-precentage="80" data-width="100" ref="canvas"></canvas> -->
  <canvas ref="canvas"></canvas>
</template>

<style scoped>
canvas {
  cursor: pointer;
  user-select: none;
  /* color: rgb(255, 118, 118); */
}
</style>