/* event handler for click of square. If the square clicked on doesn't have a bomb, this and all other
successfully cleared squares are collected in a variable clearedSquares*/
function counter() {
    let randomSquaresAll = [];
    let squares = document.getElementsByClassName("squares");
    if (this.classList.contains("no-bomb")) {
        let clearedSquares = document.getElementsByClassName("selected");
        gameOverClassifier(randomSquaresAll, squares, clearedSquares);
    }    
}
/*called from counter fn: checks the length of the clearedSquares variable. If it's greater than the total number of
squares, less than the total amount of 'mine' squares, then all non-mine squares have been successfully cleared.
The code then calls the various 'victory' functions to indicate success
@param randomSquaresAll [array of all grid squares in random order]
@param squares [square divs constituting minesweeper grid]
@param clearedSquares [all squares clicked to this point]
*/
function gameOverClassifier(randomSquaresAll, squares, clearedSquares) {
    if (clearedSquares.length > (selectedSquares - selectedBombs - 1)) {
        victorySquaresSmiley(squares);
        generateArrayRandomSquares(randomSquaresAll,selectedSquares);
        for (let j = 0; j < selectedSquares; j++) {
            victoryStyleSquaresSequentially(j, randomSquaresAll, squares);
        }
    }
}
/* on winning the game: all event listeners removed from the squares, inner html changed to a smiley icon,
and their colour changed to 'invisible' text.
@param squares [square divs constituting minesweeper grid]
*/
function victorySquaresSmiley(squares) {
    for (square of squares) {
        square.style.color = "rgba(0,0,0,0.0)";
        square.innerHTML = `<i class="fas fa-laugh-squint"></i>`;
        square.removeEventListener("click", minesweep);
        square.removeEventListener("click", addFlags);
        square.removeEventListener("click", gameOverOne);
        square.removeEventListener("click", gameOverTwo);
    }
}
/* generates an array of unique random numbers between 0 and the # of squares on the grid, until it's the same
length as the number of squares on the grid (ie a random list of the square's ids).
@param emptyArray [literally an empty array]
@param arrayLength [number of minesweeper grid squares]
*/
function generateArrayRandomSquares(emptyArray, arrayLength) {
    while (emptyArray.length < arrayLength) {
        let x = Math.floor(Math.random()*arrayLength);
        if (emptyArray.includes(x) === false) {
            emptyArray.push(x);
        }
    }
}
/* arguments: j is just the iteration of a loop of all the squares in the grid, as per the code in the gameOverClassifier
function. randomSquaresAll is the array of random numbers per the generateArrayRandomSquares function. Squares is just all the
squares on the grid. The code takes each of the squares and assigns it an index of the random array (randomSquaresAll) for each
of those indices in turn (j). It removes certain classes from ALL of the squares, to change their styling appropriately for the
victory 'animation'. It then applies a test to determine what the square's background color should be, in order to divide them into 
3 roughly equal groups of squares: those divisible by 3; those not divisble by 3 but divisible by 2, ie the remaining even numbers; and
then the remainder, ie those not divisible by 2 or 3. Each of these 3 groups are assigned a different background color to create
random patterns. Finally, this process is separated by 7ms for each assignment by the containing setTimeout function. This 
creates a randomised 'colouring in' effect. 
@param j [iteration of for loop length = # of squares on grid]
@param randomSquaresAll [array of all grid squares in random order]
@param squares [square divs constituting minesweeper grid]
*/
function victoryStyleSquaresSequentially(j, randomSquaresAll, squares) {      
    setTimeout(function() {
        squares[randomSquaresAll[j]].classList.remove("selected", "hovered-squares", "even-squares", "odd-squares", "flagged");
        if (j % 3 === 0) {
            squares[randomSquaresAll[j]].classList.add("yellow-square");
            squares[randomSquaresAll[j]].style.color = "rgba(0,0,0,1)";
        } else if (j % 3 > 0 && j % 2 === 0) {
            squares[randomSquaresAll[j]].classList.add("orange-square");
            squares[randomSquaresAll[j]].style.color = "rgba(0,0,0,1)";
        } else {
            squares[randomSquaresAll[j]].classList.add("pink-square");
            squares[randomSquaresAll[j]].style.color = "rgba(0,0,0,1)";
        }
        squares[j].removeEventListener("click", minesweep);                    
    }, 7 * j);
    victorySquaresSmileysWhite(squares);
} 
/* function changes all squares to their final 'victory' state following the previous cascade of colours
@param squares [square divs constituting minesweeper grid]
*/
function victorySquaresSmileysWhite(squares) {
    setTimeout(function() {            
        for (square of squares) {
            square.style.backgroundColor = "white";
            square.style.color = "rgb(17, 231, 238)";
        }
    }, 2000);
}
/*if the square clicked on contains a mine, generates a random array of all mined squares and passes it to the next function
in the game over sequence*/
function gameOverOne() {
    let randomSquaresBombs = [];
    let bombs = document.getElementsByClassName("bomb");
    if (this.classList.contains("bomb") && !this.classList.contains("flagged")) {
        for (bomb of bombs) {
            bomb.innerHTML = `<i class="fas fa-skull"></i>`;
        }
        generateArrayRandomSquares(randomSquaresBombs,selectedBombs);
        for (let j = 0; j < selectedBombs; j++) {
            defeatStyleBombSquaresSequentially(j, bombs, randomSquaresBombs);
        }
    }          
}
/* on defeat, all squares assigned invisible text
@param squares [square divs constituting minesweeper grid]
@param flaggedSquares [squares right clicked, "flagged"]
*/
function defeatStyleBombs(squares, flaggedSquares) {
    for (square of squares) {
        square.classList.add("invisible-text");
        square.classList.remove("selected");
    }
    for (flag of flaggedSquares) {
        if (flag.classList.contains("no-bomb")) {
            flag.style.color = "rgba(0, 0, 0, 0.0)";
        }
    }
}
/* on game over assigns all mined squares assigned red text in random order
@param j [iteration of for loop, length = # of bombs on grid]
@param bombs [minesweeper squares with bombs/mines]
@param randomSquaresBombs [array of variable bombs in random order]
*/
function defeatStyleBombSquaresSequentially(j, bombs, randomSquaresBombs) {
    setTimeout(function() {
        bombs[randomSquaresBombs[j]].classList.add("text-red");
        bombs[randomSquaresBombs[j]].classList.remove("invisible-text");
        }, 10 * j);
}
/* on game over, calls the defeatStyleBombs function and passes a random list of all the squares to the defeatStyleSquaresSequentially
function. Once the game over sequence has return, the play button's event listeners are reinstated after a 0.7s pause.*/
function gameOverTwo() {
    let squares = document.getElementsByClassName("squares");// gets all the squares on the grid
    let flaggedSquares = document.getElementsByClassName("flagged");
    if (this.classList.contains("bomb") && !this.classList.contains("flagged")) {
        removePlayFunctions();
        //ie player has clicked on a mine without a flag, and it's game over
        defeatStyleBombs(squares, flaggedSquares);
        let randomSquaresAll = [];
        generateArrayRandomSquares(randomSquaresAll, selectedSquares);
        for (let j = 0; j < selectedSquares; j++) {
            defeatStyleSquaresSequentially(j, squares, randomSquaresAll);
        }
        defeatStyleChangesFinal(squares);
        setTimeout(function() {                
            addPlayFunctions();
        }, (selectedRows * 100) + 700);
    }  
}
/*called from gameOverTwo, when the player clicks on a mine. Square background colour is changed to either white, black, or
grey in the same random fashion as for a victory sequence as per the victoryStyleSquaresSequentially function
@param j [iteration of for loop, length = # squares on grid]
@param squares [square divs constituting minesweeper grid]
@ param randomSquaresAll [array of all grid squares in random order]
*/
function defeatStyleSquaresSequentially(j, squares, randomSquaresAll) {
    setTimeout(function() {
        squares[randomSquaresAll[j]].classList.remove("hovered-squares", "even-squares", "odd-squares", "blue");
        if (j % 3 === 0) {
            squares[randomSquaresAll[j]].classList.add("black-square");
        } else if (j % 3 > 0 && j % 2 === 0) {
            squares[randomSquaresAll[j]].classList.add("grey-square");
        } else {
            squares[randomSquaresAll[j]].classList.add("white-square");
        }
        squares[j].removeEventListener("click", minesweep);                    
    }, 5 * j);
}
/* changes the grid to black with red skull icons on each square as the final defeat state for each game
@param squares [square divs constituting minesweeper grid]
*/
function defeatStyleChangesFinal(squares) {
    setTimeout(function() {            
        for (square of squares) {
            square.style.backgroundColor = "black";
            square.style.color = "red";
            square.innerHTML = `<i class="fas fa-skull"></i>`;
        }
    }, (selectedRows * 100) + 500);
}