<script>
export default {
  data () {
    return {
      thickness: 10,
    }
  },
  props: {
    color: {
      type: String,
      default: 'blue'
    },
    width: {
      type: Number,
      default: 100
    },
  },
  mounted () {
    this.thickness = this.width / 10;
    let canvas = this.$refs.canvas
    let ctx = canvas.getContext('2d')
    let radius = this.width / 3;
    let percentage = 0.8;
    let width = this.width;
    let rotation = 0;
    canvas.width = width;
    canvas.height = width;
    const drawIt = () => {
      var canvas = this.$refs.canvas;
      var ctx = canvas.getContext('2d'); 
      ctx.clearRect(0,0,canvas.width,canvas.height); 
      ctx.save();
      ctx.translate(this.width / 2, this.width / 2);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.translate(-this.width / 2, -this.width / 2);
      ctx.beginPath();
      ctx.arc(this.width / 2, this.width / 2, radius, 0, percentage * 2 * Math.PI);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.thickness;
      ctx.stroke();
      rotation += 8;
      if (rotation > 360) {
        rotation = 0;
      }
      ctx.restore();
      // console.log(rotation);
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