const canvas = document.getElementById('gravityCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let maxBalls = prompt("Enter the maximum number of balls (type 'infinite' for unlimited):");
maxBalls = maxBalls.toLowerCase() === 'infinite' ? Infinity : parseInt(maxBalls, 10);

const circles = [];

function Circle(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = getRandomColor();
  this.velocityY = 0;
  this.velocityX = (Math.random() - 0.5) * 4; // Random initial horizontal velocity
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function spawnCircle(x, y) {
  if (circles.length < maxBalls) {
    const radius = 20;
    circles.push(new Circle(x, y, radius));
  }
}

function detectCollision(circle1, circle2) {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < circle1.radius + circle2.radius;
}

function handleCollision(circle1, circle2) {
  const overlap = circle1.radius + circle2.radius - Math.sqrt((circle1.x - circle2.x)**2 + (circle1.y - circle2.y)**2);
  const angle = Math.atan2(circle1.y - circle2.y, circle1.x - circle2.x);

  const moveX = overlap * Math.cos(angle) / 2;
  const moveY = overlap * Math.sin(angle) / 2;

  circle1.x += moveX;
  circle1.y += moveY;
  circle2.x -= moveX;
  circle2.y -= moveY;

  const tempVelocityX = circle1.velocityX;
  circle1.velocityX = circle2.velocityX;
  circle2.velocityX = tempVelocityX;

  const tempVelocityY = circle1.velocityY;
  circle1.velocityY = circle2.velocityY;
  circle2.velocityY = tempVelocityY;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach((circle, index) => {
    circle.velocityY += 0.5;
    circle.y += circle.velocityY;
    circle.x += circle.velocityX;

    if (circle.y + circle.radius > canvas.height) {
      circle.y = canvas.height - circle.radius;
      circle.velocityY *= -0.8;
      circle.velocityX *= 0.95;
    }

    if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width) {
      circle.velocityX *= -1;
    }

    for (let i = index + 1; i < circles.length; i++) {
      if (detectCollision(circle, circles[i])) {
        handleCollision(circle, circles[i]);
      }
    }

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.closePath();
  });

  requestAnimationFrame(update);
}

canvas.addEventListener('click', (e) => {
  spawnCircle(e.clientX, e.clientY);
});

update();
