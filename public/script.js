const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dino = {
  x: 50,
  y: canvas.height - 80,
  width: 80,
  height: 80,
  jumping: false,
  jumpHeight: 170,
};


const obstacles = [];

const dinoImage = new Image();
dinoImage.src = 'choi.jpg'; // 공룡 이미지 파일 경로

dinoImage.onload = function () {
  init();
};
const obstacleImage = new Image();
obstacleImage.src = 'li.jpg'; // 장애물 이미지 파일 경로

function updatemaxCounter() {
    
  }

const counterElement = document.getElementById('counter');
let counterValue = 0;

function updateCounter() {
  counterValue += 1;
  counterElement.textContent = counterValue;
}

setInterval(updateCounter, 100);
  
function updatemaxCounter(maxId) {
    console.log('Received maxId:', maxId);
    document.getElementById('HI').textContent = maxId;
  }
  
  function getMaxcount() {
    fetch('/get-maxcount')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          updatemaxCounter(data.maxId);
        } else {
          console.error('Failed to get maxId from server.');
        }
      })
      .catch((error) => {
        console.error('Error during fetch:', error);
      });
  }
  getMaxcount();

function stopcounter() {
  fetch('/update-counter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ counterValue }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Server Response:', data); 
      if (data.success) {
        console.log('Counter value sent to server:', counterValue);
        document.location.reload();
      } else {
        console.error('Failed to send counter value to server.');
      }
    })
    .catch((error) => {
      console.error('Error during fetch:', error);
    });
}



obstacleImage.onload = function () {
  // 이미지가 로드되었을 때 할 일
};

function drawDino() {
  ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
}

function drawObstacles() {
  for (const obstacle of obstacles) {
    ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

function update() {
  if (dino.jumping) {
    dino.y -= 3;
    if (dino.y <= canvas.height - dino.jumpHeight) {
      dino.jumping = false;
    }
  } else if (dino.y < canvas.height - dino.height) {
    dino.y += 3;
  }

  // Update obstacles
  for (const obstacle of obstacles) {
    obstacle.x -= 3;
  }

  // Remove off-screen obstacles
  obstacles.forEach((obstacle, index) => {
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
    }
  });

  // Check for collisions
  for (const obstacle of obstacles) {
    if (
      dino.x < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y < obstacle.y + obstacle.height &&
      dino.y + dino.height > obstacle.y
    ) {
      stopcounter();
      document.location.reload();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDino();
  drawObstacles();
}

function init() {
  // Use setInterval to add new obstacles every 3 seconds
  setInterval(() => {
    obstacles.push({
      x: canvas.width,
      y: canvas.height - 30, // 장애물 높이 수정
      width: 30, // 장애물 너비 수정
      height: 30, // 장애물 높이 수정
    });
  }, 3000); // 3000 milliseconds (3 seconds)

  // Event listener for jumping
  document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !dino.jumping) {
      dino.jumping = true;
    }
  });

  gameLoop();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}