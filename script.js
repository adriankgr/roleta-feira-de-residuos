const wheel = document.getElementById("wheel");
const wheelLabels = document.getElementById("wheelLabels");
const spinButton = document.getElementById("spinButton");
const resultCard = document.getElementById("resultCard");
const resultKicker = document.getElementById("resultKicker");
const resultTitle = document.getElementById("resultTitle");

let shouldWinNext = true;
let rotation = 0;
let isSpinning = false;

const results = {
  win: {
    kicker: "Parabéns",
    title: "Pegue seu brinde!",
    cardClass: "is-win",
  },
  lose: {
    kicker: "Quase",
    title: "Não foi dessa vez",
    cardClass: "is-lose",
  },
};

const sectors = Array.from({ length: 8 }, (_, index) => {
  const result = index % 2 === 0 ? "win" : "lose";
  const centerAngle = index * 45 + 22.5;

  return {
    result,
    centerAngle,
    label: result === "win" ? ["PEGUE", "SEU", "BRINDE"] : ["NÃO FOI", "DESSA VEZ"],
  };
});

function createWheelLabels() {
  const labels = document.createDocumentFragment();

  sectors.forEach((sector) => {
    const label = document.createElement("span");
    const radians = (sector.centerAngle * Math.PI) / 180;
    const radius = 31;
    const x = 50 + Math.sin(radians) * radius;
    const y = 50 - Math.cos(radians) * radius;
    const textAngle =
      sector.centerAngle > 90 && sector.centerAngle < 270
        ? sector.centerAngle + 180
        : sector.centerAngle;

    label.className = `segment-label is-${sector.result}`;
    label.style.setProperty("--label-x", `${x}%`);
    label.style.setProperty("--label-y", `${y}%`);
    label.style.setProperty("--text-angle", `${textAngle}deg`);

    sector.label.forEach((line) => {
      const lineElement = document.createElement("span");

      lineElement.textContent = line;
      label.appendChild(lineElement);
    });

    labels.appendChild(label);
  });

  wheelLabels.appendChild(labels);
}

function setResult(resultKey) {
  const result = results[resultKey];

  resultCard.classList.remove("is-win", "is-lose");
  resultCard.classList.add(result.cardClass);
  resultKicker.textContent = result.kicker;
  resultTitle.textContent = result.title;
}

function getRandomSector(resultKey) {
  const availableSectors = sectors.filter((sector) => sector.result === resultKey);
  return availableSectors[Math.floor(Math.random() * availableSectors.length)];
}

function spin() {
  if (isSpinning) return;

  isSpinning = true;
  spinButton.disabled = true;
  spinButton.textContent = "Girando";
  resultCard.classList.remove("is-win", "is-lose");
  resultKicker.textContent = "Roleta";
  resultTitle.textContent = "Girando...";

  const resultKey = shouldWinNext ? "win" : "lose";
  const targetSector = getRandomSector(resultKey);
  const fullTurns = 6 + Math.floor(Math.random() * 3);
  const smallOffset = Math.floor(Math.random() * 22) - 11;
  const currentPosition = ((rotation % 360) + 360) % 360;
  const nextPosition = (360 - targetSector.centerAngle + smallOffset + 360) % 360;
  const correction = (nextPosition - currentPosition + 360) % 360;

  rotation += fullTurns * 360 + correction;
  wheel.style.transform = `rotate(${rotation}deg)`;

  window.setTimeout(() => {
    setResult(resultKey);
    shouldWinNext = !shouldWinNext;
    spinButton.disabled = false;
    spinButton.textContent = "Girar";
    isSpinning = false;
  }, 4300);
}

createWheelLabels();
spinButton.addEventListener("click", spin);
