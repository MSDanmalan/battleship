import './style.css';
import {
    playerBoardPanel,
    computerBoardPanel,
    initializeGameUI,
} from './dom';

const container = document.querySelector('.container');

container.append(playerBoardPanel, computerBoardPanel);

initializeGameUI();
