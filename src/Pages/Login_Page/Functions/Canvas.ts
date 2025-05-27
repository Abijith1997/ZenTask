export const initializeCanvas = () => {
  const canvas = document.getElementById(
    "backgroundCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;

    constructor(canvasWidth: number, canvasHeight: number) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.size = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.3 + 0.1;
    }

    update(canvasWidth: number, canvasHeight: number) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = canvasWidth;
      if (this.x > canvasWidth) this.x = 0;
      if (this.y < 0) this.y = canvasHeight;
      if (this.y > canvasHeight) this.y = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(144, 238, 144, ${this.opacity})`;
      ctx.fill();
    }
  }

  const particles: Particle[] = [];
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.width, canvas.height));
  }

  // Shape type
  class Shape {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    type: number;

    constructor(canvasWidth: number, canvasHeight: number) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.size = Math.random() * 40 + 15;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.005;
      this.opacity = Math.random() * 0.06 + 0.02;
      this.type = Math.floor(Math.random() * 2);
    }

    update(canvasWidth: number, canvasHeight: number) {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.x < -this.size) this.x = canvasWidth + this.size;
      if (this.x > canvasWidth + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = canvasHeight + this.size;
      if (this.y > canvasHeight + this.size) this.y = -this.size;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.strokeStyle = `rgba(34, 139, 34, ${this.opacity})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      if (this.type === 0) {
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      } else {
        ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  const shapes: Shape[] = [];
  const shapeCount = 8;

  for (let i = 0; i < shapeCount; i++) {
    shapes.push(new Shape(canvas.width, canvas.height));
  }

  let waveOffset = 0;

  function drawWaves(
    canvasWidth: number,
    canvasHeight: number,
    ctx: CanvasRenderingContext2D
  ) {
    const waveHeight = 25;
    const waveFreq = 0.008;

    ctx?.beginPath();
    ctx?.moveTo(0, canvasHeight);
    for (let x = 0; x <= canvasWidth; x++) {
      const y =
        canvasHeight - waveHeight + Math.sin(x * waveFreq + waveOffset) * 12;
      ctx?.lineTo(x, y);
    }
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(
      0,
      canvasHeight - waveHeight * 2,
      0,
      canvasHeight
    );
    gradient.addColorStop(0, "rgba(46, 125, 50, 0.08)");
    gradient.addColorStop(1, "rgba(46, 125, 50, 0.04)");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= canvasWidth; x++) {
      const y =
        waveHeight + Math.sin(x * waveFreq * 0.6 + waveOffset * 1.2) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvasWidth, 0);
    ctx.closePath();

    const topGradient = ctx.createLinearGradient(0, 0, 0, waveHeight * 2);
    topGradient.addColorStop(0, "rgba(46, 125, 50, 0.04)");
    topGradient.addColorStop(1, "rgba(46, 125, 50, 0.08)");
    ctx.fillStyle = topGradient;
    ctx.fill();
  }

  function animate(
    canvasWidth: number,
    canvasHeight: number,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (canvas) drawWaves(canvas.width, canvas.height, ctx);
    waveOffset += 0.008;
    if (canvas)
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(144, 238, 144, ${(80 - distance) / 2000})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    if (canvas)
      shapes.forEach((s) => {
        s.update(canvas.width, canvas.height);
        s.draw(ctx);
      });
    if (canvas)
      requestAnimationFrame(() => animate(canvas.width, canvas.height, ctx));
  }

  animate(canvas.width, canvas.height, ctx);

  canvas.addEventListener("mousemove", (e: MouseEvent) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const ripple = {
      x: mouseX,
      y: mouseY,
      radius: 0,
      opacity: 0.15,
      maxRadius: 60,
    };

    function animateRipple(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(144, 238, 144, ${ripple.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ripple.radius += 1.5;
      ripple.opacity -= 0.008;

      if (ripple.radius < ripple.maxRadius && ripple.opacity > 0) {
        requestAnimationFrame(() => animateRipple(ctx));
      }
    }

    animateRipple(ctx);
  });
};
