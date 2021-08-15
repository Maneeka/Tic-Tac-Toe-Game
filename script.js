const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cellElements = document.querySelectorAll('[data-cell')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn //to indicate if it is x or circles turn


const spButton = document.getElementById("singlePlayer")
const dpButton = document.getElementById("doublePlayer")
const playingOptionsMessage = document.getElementById('playingOptionsEntry')
const spButtonAgain = document.getElementById('singlePlayerAgain')
const dpButtonAgain = document.getElementById('doublePlayerAgain')

dpButton.addEventListener('click', startGameDP)
spButton.addEventListener('click', startGameSP)
spButtonAgain.addEventListener('click', startGameSP)
dpButtonAgain.addEventListener('click', startGameDP)



// start of double player logic
function startGameDP(){
    winningMessageElement.classList.remove('show')
    playingOptionsMessage.classList.add('remove')
    board.classList.add('show')
    circleTurn = false
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClickDP)
        cell.removeEventListener('click', handleClickSP)

        cell.addEventListener('click', handleClickDP, {once : true})
    })

    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
} 



function handleClickDP(e){
    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS

    placeMark(cell, currentClass)

    if(checkWin(currentClass)){
        endGame(false) //false indicating it's not a draw
    } else if(isDraw()){
        endGame(true)
    }
    else{ //keep playing
        swapTurns()
        setBoardHoverClass()
    }
}

function endGame(draw){
    if(draw){
        winningMessageTextElement.innerText = 'Draw!'
    } else{
        let winner = circleTurn ? 'O' : 'X'
        winningMessageTextElement.innerText = winner + ' wins !'
    }

    winningMessageElement.classList.add('show')
}



function placeMark(cell, currentClass){
    cell.classList.add(currentClass)  //setting the class of the cell we clicked. so an x or circle shows up as per our x and circle class cell definitions
}

function swapTurns(){
    circleTurn = !circleTurn
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if(circleTurn){
        board.classList.add(CIRCLE_CLASS)
    } else{
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass){
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || 
        cell.classList.contains(CIRCLE_CLASS)
    })
}

//start of single player logic
function startGameSP(){
    winningMessageElement.classList.remove('show')
    playingOptionsMessage.classList.add('remove')
    circleTurn = false

    board.classList.add('show')
    board.classList.remove(CIRCLE_CLASS)
    board.classList.add(X_CLASS)

    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClickSP)
        cell.removeEventListener('click', handleClickDP)

        cell.addEventListener('click', handleClickSP, {once : true})
    })

}

function handleClickSP(e){
    const cell = e.target
    //click on a cell is handled only as long as it has not 
    //been occupied by the AI, i.e, circle 
    if(!cell.classList.contains(CIRCLE_CLASS)){  

        placeMark(cell, X_CLASS)

        if(checkWin(X_CLASS)){
            winningMessageTextElement.innerText = 'You win !'
            winningMessageElement.classList.add('show')
        } else if(isDraw()){
            endGame(true)
        }
        else{
            circleTurn = true
            aiTurn()
            circleTurn = false
        }

    }
}

function aiTurn(){
    
    let pos
    gridCells = Array.from(board.children) //array of the 9 cells

    do{ //get position(cell)
        pos = minimax()
    }while(gridCells[pos].classList.contains(X_CLASS) || gridCells[pos].classList.contains(CIRCLE_CLASS));

    
    placeMark(gridCells[pos], CIRCLE_CLASS)

    //checking for win/draw
    if(checkWin(CIRCLE_CLASS)){
        winningMessageTextElement.innerText = 'Computer wins !'
        winningMessageElement.classList.add('show')
    } else if(isDraw()){
        endGame(true)
    } else{
        board.classList.add(X_CLASS)
    }
}

function minimax(){
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

      return getRandomInt(9)
}

