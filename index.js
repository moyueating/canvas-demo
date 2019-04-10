const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")



class Net {
  constructor(){
    this.dots = []
    this.copy = []
    this.mouseDot = {
      x: null,
      y: null,
      max: 60000
    }
    this.init()
  }
  
  // 设置canvas容器大小
  setCanvasSize() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;  
  }

  resize(){
    window.onresize = this.setCanvasSize
  }

  mouse(){
    const _this = this
    window.onmousemove = function(e){
      _this.mouseDot.x = e.clientX
      _this.mouseDot.y = e.clientY
    }
    window.onmouseout = function(e){
      _this.mouseDot.x = null
      _this.mouseDot.y = null
    }
  }

  // 绘制单条线
  drawLine(x, y, x1, y1) {
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = `rgba(255, 255, 255, 1)`
    ctx.moveTo(x, y)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }

  // 初始化粒子数组, x，y为粒子坐标， xa,ya为粒子的轴加速度
  initDots() {
    for(let i=0; i<=120; i++){
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const xa = Math.random() * 2 - 1
      const ya = Math.random() * 2 - 1
      const dot = {
        x,
        y,
        xa,
        ya,
        max: 6000
      }
      this.dots.push(dot)
    }
  }

  animation = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.copy = [this.mouseDot, ...this.dots]

    this.dots.forEach(dot => {
      // 处理粒子位移效果
      dot.x += dot.xa
      dot.y += dot.ya
      // 边界判断反向移动
      dot.xa *= (dot.x > canvas.width || dot.x < 0) ? -1 : 1
      dot.ya *= (dot.y > canvas.height || dot.y < 0) ? -1 : 1

      ctx.fillStyle = "#fff";
      ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1.5, 1.5)

      for(let i=0; i<this.copy.length; i++){
        let d2 = this.copy[i]
        if (dot === d2 || d2.x === null || d2.y === null) continue;
        let xc = dot.x - d2.x
        let yc = dot.y - d2.y
        let dis = xc*xc + yc*yc
        if(dis < d2.max){

          // 如果是鼠标，则让粒子向鼠标的位置移动，判断dis距离一旦超过距离就限制在范围内
          if (d2 === this.mouseDot && dis > (d2.max / 2)) {
            dot.x -= xc * 0.03;
            dot.y -= yc * 0.03;
          }

          this.drawLine(dot.x, dot.y, d2.x, d2.y)
        }
      }
      // 避免重复计算粒子
      this.copy.splice(this.copy.indexOf(dot), 1);
    })
    window.requestAnimationFrame(this.animation)
  }


  init(){
    this.mouse()
    this.setCanvasSize()
    this.resize()
    this.initDots()
    this.animation()
  }
}


new Net()
