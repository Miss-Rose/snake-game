export const createMenu = (game) => {
  const radioContainer = document.getElementById('radio-container');
  const controlContainer = document.querySelector('.control-container');
  controlContainer.style.justifyContent = 'center';
  const menuBtn = document.getElementById('menu-btn');
  const exitBtn = document.getElementById('exit-btn');
  exitBtn.style.display = 'none';
  const playBtn = document.getElementById('play-btn');
  playBtn.style.display = 'none';
  const radioButtons = document.querySelectorAll('input[name="gameType"]');
  const isDisablePlayBtn = true;

  radioButtons.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const selectedGameType = e.target.value;
      game.setGameType(selectedGameType);
    });
  });

  menuBtn.addEventListener('click', () => {
    radioContainer.style.visibility = 'visible';
    playBtn.style.display = 'block';
    exitBtn.style.display = 'block';
    menuBtn.style.display = 'none';
    controlContainer.style.justifyContent = 'space-between';
  });

  exitBtn.addEventListener('click', () => {
    playBtn.disabled = !isDisablePlayBtn;
    game.stopGameLoop();
    game.resetGame();
  });

  playBtn.addEventListener('click', () => {
    game.startGame();
    playBtn.disabled = isDisablePlayBtn;
  });
};
