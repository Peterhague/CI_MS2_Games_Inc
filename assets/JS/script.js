/*let headingContainer = document.getElementById("heading-container");
for (i = 0; i < 10; i++) {
    let titleRows = document.createElement("div");
    titleRows.classList.add("title-rows")
    for (x = 0; x < 100; x++) {
        let titlePixels = document.createElement("div");
        titlePixels.classList.add("title-pixels");
        titlePixels.style.backgroundColor = "white";
        titlePixels.id = "pixel" + ((i*100)+x);titlePixels.addEventListener("click", changeColor);
        titleRows.appendChild(titlePixels);
    }
    headingContainer.appendChild(titleRows);
}
function changeColor() {
    this.style.backgroundColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
    console.log(this.id);
}*/
let randomSquares = []; //creates the array to be populated by the randomise function
let grid = document.getElementById("grid");
let gridRow = ""; //these will be the rows (divs) to be appended to the minesweeper grid
let difficulty = document.getElementById("difficulty"); //targets the dropdown selector per the html file
difficulty.addEventListener("change", variableVariables);
let selectedRows = 9;
let selectedBombs = 15;
let selectedSquares = 81;
let gridRowsList = document.getElementsByClassName("grid-rows"); // to create an array of the grid rows to iterate over
let scoreContainer = document.getElementById("score-container"); // gets the div to be populated by the remaining flags tally
let play = document.getElementById("play"); // gets the start game button from the html file
function addPlayFunctions(pixelsClicked) {
    play.addEventListener("click", generatedGridRows); // generates the number of rows as per the difficulty selected
    play.addEventListener("click", randomise);
    play.addEventListener("click", newGame);
    play.addEventListener("click", squareSize);
    play.addEventListener("click", checkerboard);
    play.addEventListener("click", addFlags);
    play.addEventListener("click", assignRelativePosition);
    play.addEventListener("click", assignHTML);
    play.addEventListener("click", bombIcon);
    play.addEventListener("click", flags);
}
function removePlayFunctions() {
    play.removeEventListener("click", generatedGridRows); // generates the number of rows as per the difficulty selected
    play.removeEventListener("click", randomise);
    play.removeEventListener("click", newGame);
    play.removeEventListener("click", squareSize);
    play.removeEventListener("click", checkerboard);
    play.removeEventListener("click", addFlags);
    play.removeEventListener("click", assignRelativePosition);
    play.removeEventListener("click", assignHTML);
    play.removeEventListener("click", bombIcon);
    play.removeEventListener("click", flags);
}
addPlayFunctions();
function variableVariables() {
    let selectedDifficulty = difficulty.value;
    if (selectedDifficulty == "Medium") {
        selectedRows = 15;
        selectedBombs = 40;
        selectedSquares = 225;
    } else if (selectedDifficulty == "Hard") {
        selectedRows = 20;
        selectedBombs = 99;
        selectedSquares = 400;
    } else {
        selectedRows = 9;
        selectedBombs = 15;
        selectedSquares = 81;
    }
}
function generatedGridRows() {
    grid.innerHTML = "";
    for (i = 0; i < selectedRows; i++) {
        gridRow = document.createElement("div");
        gridRow.classList.add("grid-rows", `grid-row-${i}`) // to be able to identify the row precisely when necessary
        grid.appendChild(gridRow);
    } // this loop creates the number of rows determined by the selected difficulty and adds them to the grid
}
function randomise() {
/*Adds random numbers to the randomSquares variable (15 for easy, 40 for medium and 99 for hard). 
Multiplies each random number by the number of squares on the grid, and pushes them to the array 
IF the random number y does NOT appear in the list already, ie so that each number in the array
is unique. This ensures that ultimately the grids will have the correct number of mines, and no
squares with > 1 mine.*/
randomSquares = []; // to be populated by array of random numbers to be iterated to randomly place the "mines"
    while (randomSquares.length < selectedBombs) {
        let y = Math.floor(Math.random()*selectedSquares);
        if (randomSquares.includes(y) === false) {
            randomSquares.push(y);
        }  
    }    
}
function newGame() {
    for (x = 0; x < selectedRows; x++) {
        for (y = 0; y < selectedRows; y++) {
            /* the for x loop iterates through the rows of the grid and the nested y loop generates 9 squares for each row,
            to end up with a 9x9 grid of squares.*/ 
            let squares = document.createElement("button"); // these are the "square" button elements created x9 for each x loop
            squares.classList.add("squares");
            squares.classList.add("hovered-squares"); // this class adds the highlight on hover effect 
            let squaresNumber = (y*selectedRows)+x; 
            /* variable to be assigned to each square as a unique id, so they can be "searched"
            for the presence of "mines"*/
            if (randomSquares.includes(squaresNumber)) {
                /* This code whether the list of random numbers generated by the randomise function includes the number assigned 
                to the squaresNumber variable, and if so to assign the square the class of "bomb" and if not the class of 
                "no-bomb". This effectively checks whether the square's id is included in the list of random numbers. */ 
                squares.classList.add("bomb");
            } else {
                squares.classList.add("no-bomb");
            }
            squaresFunctions(squares);
            squares.id = squaresNumber; // assigns each square a uniqe id based on its position in the grid
            gridRowsList[y].appendChild(squares); // adds each of the 9 squares created in each iteration of the outer loop
        }   
    }        
}
function squareSize() {
    let squares = document.getElementsByClassName("squares");
    let selectedDifficulty = difficulty.value;
    for (square of squares) {
        if (selectedDifficulty == "Easy") {
            square.classList.add("squaresBig");   
        } else if (selectedDifficulty == "Medium") {
            square.classList.add("squaresMedium") ;   
        } else {
            square.classList.add("squaresSmall");   
        }
    }
}
function squaresFunctions(squares) {
    squares.addEventListener("click", minesweep); // function to detect how many mines are in the squares surrounding the clicked square
    squares.addEventListener("click", counter); // function counts how many squares with no mines have been clicked to determine ultimate success
    squares.addEventListener("click", gameOverOne); // performs part of the game over "animation" sequence
    squares.addEventListener("click", gameOverTwo); // performs part of the game over "animation" sequence
}
function checkerboard() {
/* the outer loop iterates over the rows of the grid and the nested loop iterates over the 
    squares (ie children of the row). The code says if the row's index is even then the first square
    of that row is given the class of "odd-squares", and every alternate square of that row is
    given the class of "even-squares", and then the reverse for rows with indices that are odd.
    This is purely for styling in the checkerboard pattern, and to distinguish the code applied to 
    every alternate row of the grid. If the same code was applied to every row the grid would have
    vertical stripes and not a chequered effect. */
    for (let i = 0; i < selectedRows; i++) {
        for (let x = 0; x < selectedRows; x++) {
            if (i % 2 === 0 && x % 2 === 0) {
                gridRowsList[i].children[x].classList.add("odd-squares");
            }   else if (i % 2 === 0 && x % 2 > 0) {
                gridRowsList[i].children[x].classList.add("even-squares");
            } 
        }
        for (let x = 0; x < selectedRows; x++) {
            if (i % 2 > 0 && x % 2 > 0) {
                gridRowsList[i].children[x].classList.add("odd-squares");
            } else if (i % 2 > 0 && x % 2 === 0) {
                gridRowsList[i].children[x].classList.add("even-squares");
            }
        }
    }
}
function addFlags() {
    let squares = document.getElementsByClassName("squares");
    $(squares).mousedown(function(event) {
        // code for placing and removing "flags" on squares as mine-markers, via a right-click (hence "case 3")
        if (!this.classList.contains("selected")) {
            // ie if the square hasn't already been left-clicked on to reveal no mine
            switch (event.which) {
            case 3:
                if (this.classList.contains("even-squares")) {
                    $(this).removeClass("even-squares"); // removes the styling
                    $(this).removeClass("hovered-squares"); // removes hover pseudo class
                    $(this).addClass("evenReserved"); 
                    /* this purely nominal class reserves that the square DID have class of "even-squares"
                    within the element's attributes, so that fact can be accessed later on if the flag is removed*/
                    $(this).addClass("flagged");
                    $(this).attr("data-id", this.innerHTML);
                    /* this custom attribute reserves the square's inner html (ie what number of mines surrounds it)
                    so that it can be accessed later on if the flag is removed (the inner html will change to the
                    flag icon)*/
                    $(this).html(`<i class="fas fa-flag"></i>`); // square displays the flag icon
                    scoreContainer.innerHTML = scoreContainer.innerHTML - 1; // reduces the display of number of flags in hand by 1
                } else if (this.classList.contains("odd-squares")) {
                    // same process as above but for "odd-squares"
                    $(this).removeClass("odd-squares");
                    $(this).removeClass("hovered-squares");
                    $(this).addClass("oddReserved");
                    $(this).addClass("flagged");
                    $(this).attr("data-id", this.innerHTML);
                    $(this).html(`<i class="fas fa-flag"></i>`);
                    scoreContainer.innerHTML = scoreContainer.innerHTML - 1;
                } else if (this.classList.contains("flagged") && this.classList.contains("evenReserved")) {
                    // reverses the process when an even square already has a flag
                    $(this).removeClass("flagged");
                    $(this).removeClass("evenReserved");
                    $(this).addClass("even-squares");
                    $(this).addClass("hovered-squares");
                    $(this).html($(this).attr("data-id"));
                    scoreContainer.innerHTML = parseInt(scoreContainer.innerHTML) + 1;
                } else if (this.classList.contains("flagged") && this.classList.contains("oddReserved")) {
                    // reverses the process when an odd square already has a flag
                    $(this).removeClass("flagged");
                    $(this).removeClass("oddReserved");
                    $(this).addClass("odd-squares");
                    $(this).addClass("hovered-squares");
                    $(this).html($(this).attr("data-id"));
                    scoreContainer.innerHTML = parseInt(scoreContainer.innerHTML) + 1;
                }
            }
        }
    });
}
function assignRelativePosition() {
    let squares = document.getElementsByClassName("squares");
    for (square of squares) {
        let sqid = parseInt(square.id);
        if (sqid === 0) {
            square.classList.add("top-left");
        } else if (sqid > 0 && sqid < (selectedRows -1)) {
            square.classList.add("top-edge")
        } else if (sqid === selectedRows -1) {
            square.classList.add("top-right");
        } else if (sqid > 0 && sqid % selectedRows === 0 && sqid != (selectedSquares - selectedRows)) {
            square.classList.add("left-edge");
        } else if (sqid > 0 && (sqid +1) % selectedRows === 0 && sqid != (selectedSquares - 1)) {
            square.classList.add("right-edge");
        } else if (sqid === (selectedSquares - selectedRows)) {
            square.classList.add("bottom-left");
        } else if (sqid === (selectedSquares - 1)) {
            square.classList.add("bottom-right");
        } else if (sqid > (selectedSquares - selectedRows) && sqid < (selectedSquares - 1)) {
            square.classList.add("bottom-edge");
        } else {
            square.classList.add("middle");
        }
    }
}
function assignHTML() {
/* This function assigns the numbers to each square that represent how many of that square's surrounding squares
contain mines. It does so by getting each square's id and checking the "mine" content of squares with ids that 
define them as being in the checking square's radius/orbit etc. This can be achieved because each square has an id
that can identify its position in the grid, and therefore its position relative to every other square. In a 400 square
"Hard" grid, the top left square has an id of 0 and the bottom right has an id of 399, with the sequence running left
to right along each row in turn.

This is a complex function because the number and relative position of the squares to evaluate vary depending on
(a) the size of the grid and
(b) whether the square is in the middle of the grid, on the edge, or in a corner.

-- squareSentinel is the square checking its neighbours
-- squareTarget are the squares being checked

The value of the the total variable is increased by one for every "mine" found. This value at the end of the outer loop
is then assigned as the sentinelSquare's inner html. */
let squares = document.getElementsByClassName("squares");
    for (squareSentinel of squares) {
        if (squareSentinel.classList.contains("right-edge") || squareSentinel.classList.contains("top-right")) {
        /*for squares with ids longer than 1 and divisible by 9 after the addition of 1 to its total.
        This captures the squares at the right-hand edge of the grid*/
            assignHTMLRight(squares, squareSentinel); 
        } else if (squareSentinel.classList.contains("left-edge") || squareSentinel.classList.contains("bottom-left")) {
        /*for squares with ids longer than 1, and divisible by 9. This captures the squares at the left-hand edge of the grid*/
            assignHTMLLeft(squares, squareSentinel);
        } else if (squareSentinel.classList.contains("top-left")) {
        //captures the top-left square only
            assignHTMLTopLeft(squares, squareSentinel);             
        } else {
        /*applies to all other squares in grid not picked out above*/
            assignHTMLMiddle(squares, squareSentinel);
        }        
    }
}
function assignHTMLRight(squares, inputSquare) {
    let total = 0;
    for (squareTarget of squares) {
        if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + selectedRows) && squareTarget.classList.contains("bomb")) {// squareTarget is below
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + (selectedRows -1)) && squareTarget.classList.contains("bomb")) {// squareTarget is to bottom left
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - 1) && squareTarget.classList.contains("bomb")) {// squareTarget is to left
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - selectedRows) && squareTarget.classList.contains("bomb")) {// squareTarget is above
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - (selectedRows +1)) && squareTarget.classList.contains("bomb")) {// squareTarfet is to top left
            total += 1;      
        } 
    }
    inputSquare.innerHTML = total;
}
function assignHTMLLeft(squares, inputSquare) {
    let total = 0;
    for (squareTarget of squares) {
        if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + selectedRows) && squareTarget.classList.contains("bomb")) {// squareTarget is below
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + (selectedRows +1)) && squareTarget.classList.contains("bomb")) {// squareTarget is to bottom right 
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + 1) && squareTarget.classList.contains("bomb")) {// squareTarget is to right
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - selectedRows) && squareTarget.classList.contains("bomb")) {// squareTarget is above
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - (selectedRows -1)) && squareTarget.classList.contains("bomb")) {// squareTarget is to top right
            total += 1;
        }
    } 
    inputSquare.innerHTML = total;
}
function assignHTMLTopLeft(squares, inputSquare) {
    let total = 0;
    for (squareTarget of squares) {
        if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + 1) && squareTarget.classList.contains("bomb")) {// squareTarget is to right
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + selectedRows) && squareTarget.classList.contains("bomb")) {// squareTarget is below
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + (selectedRows +1)) && squareTarget.classList.contains("bomb")) {// squareTarget is to bottom right
            total += 1;
        } 
    } 
    inputSquare.innerHTML = total;
}
function assignHTMLMiddle(squares, inputSquare) {
    let total = 0;
    for (squareTarget of squares) {
        if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + selectedRows) && squareTarget.classList.contains("bomb")) {// squareTarget is below
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + (selectedRows +1)) && squareTarget.classList.contains("bomb")) {//squareTarget is to bottom right
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + (selectedRows -1)) && squareTarget.classList.contains("bomb")) {// squareTarget is to bottom left
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - selectedRows) && squareTarget.classList.contains("bomb")) {// squareTarget is above
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - (selectedRows -1)) && squareTarget.classList.contains("bomb")) {// squareTarget is top right
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - (selectedRows +1)) && squareTarget.classList.contains("bomb")) {// squareTarget is to top left
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) - 1) && squareTarget.classList.contains("bomb")) {// squareTarget is to left
            total += 1;
        } else if (parseInt(squareTarget.id) === (parseInt(inputSquare.id) + 1) && squareTarget.classList.contains("bomb")) {// squareTarget is to right
            total += 1;
        }
    }
    inputSquare.innerHTML = total;
}
function bombIcon() {
    let squares = document.getElementsByClassName("squares");  
    for (square of squares) { // simple loop to assign squares with class of "bomb" the skull font awesome icon as innerHTML
        if (square.classList.contains("bomb")) {
            square.innerHTML = `<i class="fas fa-skull"></i>`;
        }
    }
}
function flags() {
    /* Assigns the starting value of the number flags in hand counter depending on the selected difficulty*/
    scoreContainer.innerHTML = "";
    scoreContainer.innerHTML = selectedBombs;    
}
function minesweep() {
/* This code runs when the player left clicks on any square in the grid.
Its main function is to check if any of the surrounding squares of the clicked
square have an innerHTML value of zero. If the value of the clicked square is zero,
this function will then automatically "click" on any of its surrounding squares that
ALSO have a value of zero. */
    this.removeEventListener("click", minesweep);// so a square can only be clicked once
    this.classList.remove("hovered-squares");// removes the highlight effect from clicked squares
    this.classList.remove("even-squares", "odd-squares");
    this.classList.add("selected");// adds identifier to clicked squares
    if (parseInt(this.innerHTML) === 0) { // changes the styling of clicked squares
        this.classList.add("text-grey");
    } else {
        this.classList.add("text-white");
    }
    let squares = document.getElementsByClassName("squares");
    for (square of squares) {
        /* removes the class identifier from the squares selected by the below code as
        surrounding the clicked square. This prevents the automated clicking code from
        clicking on squares previously identified as surrounding OTHER squares but which weren't
        selected for automatic clicking because the initially clicked square didn't have a value
        of zero*/
        square.classList.remove("clicked-square-radius");
    }
    if (this.classList.contains("right-edge")) {
        minesweepRight(squares, this);
    } else if (this.classList.contains("left-edge")) {
        minesweepLeft(squares, this);
    } else if (this.classList.contains("top-left")) {
        minesweepTopLeft(squares, this);        
    } else if (this.classList.contains("top-edge")) {
        minesweepTop(squares, this);        
    } else if (this.classList.contains("top-right")) {
        minesweepTopRight(squares, this);        
    } else if (this.classList.contains("bottom-edge")) {
        minesweepBottom(squares, this);        
    } else if (this.classList.contains("bottom-left")) {
        minesweepBottomRight(squares, this);        
    } else if (this.classList.contains("bottom-right")) {
        minesweepBottomRight(squares, this);        
    } else if (this.classList.contains("middle")) {
        minesweepMiddle(squares, this);
    }
    automatedClick(this);
}
function minesweepRight(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) + selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + (selectedRows -1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - (selectedRows +1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - 1].classList.add("clicked-square-radius");
}
function minesweepLeft(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) - selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - (selectedRows -1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + (selectedRows +1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + 1].classList.add("clicked-square-radius");
}
function minesweepTopLeft(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) + (selectedRows +1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + 1].classList.add("clicked-square-radius");
}
function minesweepTop(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) + selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + (selectedRows -1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + (selectedRows +1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - 1].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + 1].classList.add("clicked-square-radius");
}
function minesweepTopRight(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) + (selectedRows -1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - 1].classList.add("clicked-square-radius");
}
function minesweepBottom(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) - selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - (selectedRows -1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - (selectedRows +1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - 1].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + 1].classList.add("clicked-square-radius");
}
function minesweepBottomLeft(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) -selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - (selectedRows -1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + 1].classList.add("clicked-square-radius");
}
function minesweepBottomRight(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) - selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - (selectedRows +1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - 1].classList.add("clicked-square-radius");
}
function minesweepMiddle(squares, that) {
    let thisID = that.id;
    squares[parseInt(thisID) - selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - (selectedRows -1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - (selectedRows +1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + selectedRows].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + 1].classList.add("clicked-square-radius");
    squares[parseInt(thisID) - 1].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + (selectedRows -1)].classList.add("clicked-square-radius");
    squares[parseInt(thisID) + (selectedRows +1)].classList.add("clicked-square-radius");
}
function automatedClick(that) {
    let clickedSquareRadius = document.getElementsByClassName("clicked-square-radius");
    for (square of clickedSquareRadius) {
        square.classList.add(`csr-${that.id}`)
    }   
    let automatedClickers = document.getElementsByClassName(`csr-${that.id}`)     
    for (clicker of automatedClickers) {   
        if (parseInt(that.innerHTML) === 0) {
            clicker.click();
        }
    }
}
function counter() {
    let randomSquaresAll = [];
    let squares = document.getElementsByClassName("squares");
    if (this.classList.contains("no-bomb")) {
        let clearedSquares = document.getElementsByClassName("selected");
        if (clearedSquares.length > (selectedSquares - selectedBombs - 1)) {
            while (randomSquaresAll.length < selectedSquares) {// populate random numbers array until it's 81 numbers long
                let x = Math.floor(Math.random()*selectedSquares);
                if (randomSquaresAll.includes(x) === false) {
                    randomSquaresAll.push(x);
                }
            }
            for (let j = 0; j < selectedSquares; j++) {
                task(j);
            }
            function task(j) {            
                setTimeout(function() {
                    squares[j].innerHTML = `<i class="fas fa-laugh-squint"></i>`;
                    squares[randomSquaresAll[j]].classList.remove("selected", "hovered-squares", "even-squares", "odd-squares", "text-white");
                    if (j % 3 === 0) {
                        squares[randomSquaresAll[j]].classList.add("yellow-square");
                    } else if (j % 3 > 0 && j % 2 === 0) {
                        squares[randomSquaresAll[j]].classList.add("orange-square");
                    } else {
                        squares[randomSquaresAll[j]].classList.add("pink-square");
                    }
                    squares[j].removeEventListener("click", minesweep);                    
                }, 7 * j);
                setTimeout(function() {            
                    for (square of squares) {
                        square.style.backgroundColor = "white";
                        square.style.color = "rgb(17, 231, 238)";
                    };
                }, 2000);
            }
        }
    }    
}
function gameOverOne() {
    let randomSquaresBombs = [];
    let bombs = document.getElementsByClassName("bomb");
    if (this.classList.contains("bomb") && !this.classList.contains("flagged")) {
        for (bomb of bombs) {
            bomb.innerHTML = `<i class="fas fa-skull"></i>`
        }
        while (randomSquaresBombs.length < selectedBombs) {
            let x = Math.floor(Math.random()*selectedBombs);
            if (randomSquaresBombs.includes(x) === false) {
                randomSquaresBombs.push(x);
            }
        }
        for (let j = 0; j < selectedBombs; j++) {
            task(j);
        }
        function task(j) {            
            setTimeout(function() {
                bombs[randomSquaresBombs[j]].classList.add("text-red");
                bombs[randomSquaresBombs[j]].classList.remove("invisible-text");
                }, 10 * j);
        }  
    }          
}
function gameOverTwo() {
    let squares = document.getElementsByClassName("squares");// gets all the squares on the grid
    let flaggedSquares = document.getElementsByClassName("flagged");
    if (this.classList.contains("bomb") && !this.classList.contains("flagged")) {
        removePlayFunctions();
        //ie player has clicked on a mine without a flag, and it's game over
        for (square of squares) {
            square.classList.add("invisible-text");
            square.classList.remove("selected");
        }
        for (flag of flaggedSquares) {
            if (flag.classList.contains("no-bomb")) {
                flag.style.color = "rgba(0, 0, 0, 0.0)";
            }
        }
        let randomSquaresAll = [];
        while (randomSquaresAll.length < selectedSquares) {// populate random numbers array until same length as the number of squares in grid
            let x = Math.floor(Math.random()*selectedSquares);
            if (randomSquaresAll.includes(x) === false) {
                randomSquaresAll.push(x);
            }
        }
        for (let j = 0; j < selectedSquares; j++) {
            task(j);
        }
        function task(j) {            
            setTimeout(function() {
                squares[randomSquaresAll[j]].classList.remove("hovered-squares", "even-squares", "odd-squares", "text-white");
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
        setTimeout(function() {            
            for (square of squares) {
                square.style.backgroundColor = "black";
                square.style.color = "red";
                square.innerHTML = `<i class="fas fa-skull"></i>`;
            };
        }, (selectedRows * 100) + 500);
        setTimeout(function() {                
            addPlayFunctions();
        }, (selectedRows * 100) + 700);
    }  
}
/*
let titlePixelsColored = ["pixel102", "pixel103", "pixel202", "pixel302", "pixel402", "pixel302", "pixel502", "pixel602", "pixel702", "pixel802",
 "pixel803", "pixel703", "pixel603", "pixel503", "pixel403", "pixel303", "pixel203", "pixel104", "pixel204", "pixel205", "pixel305", "pixel306",
 "pixel307", "pixel406", "pixel208", "pixel207", "pixel209", "pixel109", "pixel108", "pixel110", "pixel210", "pixel309", "pixel409", "pixel509", "pixel609",
 "pixel709", "pixel809", "pixel810", "pixel610", "pixel410", "pixel310", "pixel510", "pixel710", "pixel113", "pixel114", "pixel313", "pixel413", "pixel513", "pixel613", "pixel713", "pixel813", "pixel814", "pixel714", "pixel614", "pixel414", "pixel314",
 "pixel514", "pixel517", "pixel617", "pixel717", "pixel817", "pixel818", "pixel718", "pixel518", "pixel618", "pixel418", "pixel318", "pixel317", "pixel417",
 "pixel217", "pixel118", "pixel117", "pixel219", "pixel218", "pixel319", "pixel220", "pixel120", "pixel121", "pixel122", "pixel123", "pixel223", "pixel224",
 "pixel324", "pixel325", "pixel424", "pixel524", "pixel424", "pixel624", "pixel724", "pixel824", "pixel825", "pixel725", "pixel625", "pixel525",
 "pixel425", "pixel428", "pixel328", "pixel228", "pixel628", "pixel528", "pixel728", "pixel729", "pixel629", "pixel229", "pixel329",
 "pixel429", "pixel529", "pixel829", "pixel830", "pixel831", "pixel832", "pixel833", "pixel129", "pixel130", "pixel131", "pixel132",
 "pixel133", "pixel430", "pixel431", "pixel133", "pixel437", "pixel336", "pixel337", "pixel437", "pixel438", "pixel238", "pixel237", "pixel138", "pixel140", "pixel139", "pixel241", "pixel537", "pixel538", "pixel539",
 "pixel639", "pixel640", "pixel641", "pixel741", "pixel740", "pixel840", "pixel839", "pixel838", "pixel736", "pixel837", "pixel244", "pixel344", "pixel444",
 "pixel544", "pixel545", "pixel445", "pixel345", "pixel245", "pixel145", "pixel445", "pixel546", "pixel646", "pixel645", "pixel746", "pixel846", "pixel847",
 "pixel747", "pixel748", "pixel648", "pixel649", "pixel650", "pixel750", "pixel751", "pixel851", "pixel852", "pixel752", "pixel652", "pixel653", "pixel552",
 "pixel553", "pixel554", "pixel453", "pixel353", "pixel253", "pixel153", "pixel254", "pixel354", "pixel454", "pixel357", "pixel358", "pixel457",
 "pixel557", "pixel657", "pixel757", "pixel758", "pixel658", "pixel558", "pixel458", "pixel257", "pixel258", "pixel159", "pixel160", "pixel158",
 "pixel161", "pixel162", "pixel459", "pixel460", "pixel858", "pixel859", "pixel860", "pixel861", "pixel862", "pixel465", "pixel365",
 "pixel265", "pixel266", "pixel366", "pixel466", "pixel566", "pixel666", "pixel766", "pixel565", "pixel665", "pixel765",
 "pixel867", "pixel866", "pixel869", "pixel870", "pixel868", "pixel467", "pixel468", "pixel167", "pixel166", "pixel168", "pixel170", "pixel169", "pixel273",
 "pixel274", "pixel174", "pixel374", "pixel373", "pixel474", "pixel473", "pixel573", "pixel673", "pixel773", "pixel873", "pixel874", "pixel774",
 "pixel674", "pixel574", "pixel175", "pixel176", "pixel177", "pixel275", "pixel178", "pixel278", "pixel279", "pixel379", "pixel380", "pixel479", "pixel478",
 "pixel578", "pixel577", "pixel576", "pixel575", "pixel574", "pixel475", "pixel383", "pixel283", "pixel284", "pixel384", "pixel484", "pixel584", "pixel684",
 "pixel784", "pixel783", "pixel683", "pixel583", "pixel483", "pixel884", "pixel885", "pixel886", "pixel887", "pixel888", "pixel184",
 "pixel185", "pixel187", "pixel186", "pixel188", "pixel485", "pixel486", "pixel191", "pixel291", "pixel391", "pixel491", "pixel192", "pixel292", "pixel392",
 "pixel492", "pixel592", "pixel591", "pixel691", "pixel791", "pixel892", "pixel891", "pixel792", "pixel692", "pixel193", "pixel194", "pixel195", "pixel295",
 "pixel296", "pixel396", "pixel397", "pixel496", "pixel495", "pixel595", "pixel594", "pixel594", "pixel593", "pixel695", "pixel696", "pixel796", "pixel797",
 "pixel897", "pixel141", "pixel836", "pixel137", "pixel128", "pixel828", "pixel157", "pixel857", "pixel865", "pixel165", "pixel173", "pixel183", "pixel883",
 "pixel144", "pixel154", "pixel549", "pixel124", "pixel225", "pixel236"]
let titlePixels = document.getElementsByClassName("title-pixels");
for (pixel of titlePixels) {
    if (titlePixelsColored.includes(pixel.id)) {
        pixel.style.backgroundColor = `rgb(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)})`;
    }
}*/

