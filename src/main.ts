const $squares = document.querySelectorAll(".grid div");
const $resultDisplay = document.querySelector("#result");

const l = console.log;
const width = 15;
let currentShooterIndex = 202;
const currentInvaderIndex = 0;
const alienInvadersTakenDown: Array<number> = [];
let result: number = 0;
let direction = 1;
let invaderId: number;

enum classes {
   INVADER = "invader",
   LASER = "laser",
   SHOOTER = "shooter",
   BOOM = "boom",
}

/* Define the alien invaders */
const alienInvaders: Array<number> = [
   0,
   1,
   2,
   3,
   4,
   5,
   6,
   7,
   8,
   9,
   15,
   16,
   17,
   18,
   19,
   20,
   21,
   22,
   23,
   24,
   30,
   31,
   32,
   33,
   34,
   35,
   36,
   37,
   38,
   39,
];

/* Draw the alien invaders */
alienInvaders.forEach((i) => {
   //TODO: Why to sum i + currentInvaderIndex?
   $squares[currentInvaderIndex + i].classList.add(classes.INVADER);
});

/* Draw the shooter */
$squares[currentShooterIndex].classList.add(classes.SHOOTER);

/* Move the shooter along a line */
function moveShooter(e: KeyboardEvent) {
   $squares[currentShooterIndex].classList.remove(classes.SHOOTER);

   switch (e.key) {
      case "ArrowLeft":
         if (currentShooterIndex % width !== 0) {
            currentShooterIndex -= 1;
         }
         break;
      case "ArrowRight":
         if (currentShooterIndex % width < width - 1) {
            currentShooterIndex += 1;
         }
         break;
   }

   $squares[currentShooterIndex].classList.add(classes.SHOOTER);
}

/* Move the alien invaders */
function moveInvaders() {
   const leftEdge = alienInvaders[0] % width === 0;
   const rigthEdge =
      alienInvaders[alienInvaders.length - 1] % width === width - 1;

   if ((rigthEdge && direction === 1) || (leftEdge && direction === -1)) {
      direction = width;
   } else if (direction === width) {
      if (rigthEdge) {
         direction = -1;
      } else {
         direction = 1;
      }
   }

   for (let i = 0; alienInvaders.length - 1 >= i; i++) {
      $squares[alienInvaders[i]].classList.remove(classes.INVADER);
   }

   for (let i = 0; alienInvaders.length - 1 >= i; i++) {
      alienInvaders[i] += direction;
   }

   for (let i = 0; alienInvaders.length - 1 >= i; i++) {
      if (!alienInvadersTakenDown.includes(i)) {
         $squares[alienInvaders[i]].classList.add(classes.INVADER);
      }
   }

   /* Decide game over */
   if ($squares[currentShooterIndex].classList.contains(classes.INVADER)) {
      $resultDisplay?.textContent = "Game Over";
      $squares[currentShooterIndex].classList.add(classes.BOOM);

      clearInterval(invaderId);
   }

   for (let i = 0; alienInvaders.length - 1 >= i; i++) {
      if (alienInvaders[i] > $squares.length - (width - 2)) {
         clearInterval(invaderId);
         $resultDisplay?.textContent = "Game Over";
      }
   }

   /* Decide win */
   if (alienInvadersTakenDown.length === alienInvaders.length) {
      $resultDisplay?.textContent = "You win!";
      document.removeEventListener("keydown", moveShooter);
      document.removeEventListener("keyup", shoot);
      clearInterval(invaderId);
   }
}

/* Shoot at aliens */
function shoot(e: KeyboardEvent) {
   let laserId: number;
   let currentLaserIndex = currentShooterIndex;

   /* move laser from the shooter to the alien invader*/
   function moveLaser() {
      $squares[currentLaserIndex].classList.remove(classes.LASER);
      currentLaserIndex -= width;
      $squares[currentLaserIndex].classList.add(classes.LASER);

      if ($squares[currentLaserIndex].classList.contains(classes.INVADER)) {
         $squares[currentLaserIndex].classList.remove(classes.LASER);
         $squares[currentLaserIndex].classList.remove(classes.INVADER);
         $squares[currentLaserIndex].classList.add(classes.BOOM);

         setTimeout(() => {
            $squares[currentLaserIndex].classList.remove(classes.BOOM);
         }, 250);

         clearInterval(laserId);

         const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
         alienInvadersTakenDown.push(alienTakenDown);

         result += 1;
         $resultDisplay?.textContent = result;
      }

      if (currentLaserIndex < width) {
         clearInterval(laserId);
         setTimeout(() => {
            $squares[currentLaserIndex].classList.remove(classes.LASER);
         }, 100);
      }
   }

   switch (e.key) {
      case "ArrowUp":
         laserId = setInterval(moveLaser, 100);
         break;
   }
}

invaderId = setInterval(() => {
   moveInvaders();
}, 500);

document.addEventListener("keydown", moveShooter);
document.addEventListener("keyup", shoot);
