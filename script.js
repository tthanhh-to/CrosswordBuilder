const boardInputs = document.querySelectorAll('.board-input');
const boardSizeInput = document.getElementById('boardSize');
const clearButton = document.getElementById('clearBoard');
const board = document.getElementById('myBoard');
const downloadButton = document.getElementById('save');
const subButton = document.getElementById('numLeft');
const addButton = document.getElementById('numRight');
const blackoutButton = document.getElementById('blackout');
const boardInput = document.querySelector('.board-input'); // Select your element

// this function is used to create the size board requested for the user dynamically
clearButton.addEventListener('click', generateDynamicBoard);
function generateDynamicBoard() {
  const size = parseInt(boardSizeInput.value);
  if (isNaN(size) || size < 1) return; // Prevent invalid input

  board.innerHTML = ''; // Clear previous board

  for (let i = 0; i < size; i++) {
    const row = board.insertRow();
    for (let j = 0; j < size; j++) {
      const cell = row.insertCell();
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'board-input';
      input.maxLength = 1;
      cell.appendChild(input);
      input.addEventListener('input', (event) => {
        event.target.value = event.target.value.toUpperCase();
      });
    }
  }
}

// Generate initial board on page load
generateDynamicBoard();

// Re-generate board when the size changes via keyboard entry.
boardSizeInput.addEventListener('change', generateDynamicBoard);

// add number then call generate board with the +/- button(UI)
addButton.addEventListener('click', addBoard);
subButton.addEventListener('click', subBoard);

function addBoard(){
  boardSizeInput.value = parseInt(boardSizeInput.value) + 1;
  generateDynamicBoard();
}

function subBoard(){
  boardSizeInput.value -= 1;
  generateDynamicBoard();
}

// this function is for putting each letter in each board space

boardInputs.forEach(input => {
  input.addEventListener('change', (event) => {
    console.log('Input changed:', event.target.value);
    // Add validation or data processing here
  });
});

function getBoardData() {
  const data = [];
  const rows = document.querySelectorAll('#myBoard tr');
  rows.forEach(row => {
    const rowData = [];
    const inputs = row.querySelectorAll('.board-input');
    inputs.forEach(input => {
      rowData.push(input.value);
    });
    data.push(rowData);
  });
  return data;
}

// functions are used for retrieving the cell within the table that is currently being focused on 
// will be useful for blackout function and highlighting the row/column of the cell

// Helper function to find the closest ancestor with a given tag name
// uses the tag of the cell aka td(table data) to ensure that what's being focused on is a table cell
// without helper function the function picks up INPUT as the tag which is nested in the td so we need helper function
// event listener just updates whenever the cell is changed
function findAncestor(element, tagName) {
  let current = element;
  while (current) {
    if (current.tagName === tagName.toUpperCase()) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

function getFocusedTableCell() {
  const activeElement = document.activeElement;
  // Find the closest TD ancestor of the focused element
  const focusedCell = findAncestor(activeElement, 'TD');
  if (focusedCell) {
    return focusedCell;
  }
  return null; // No focused table cell found
}

board.addEventListener('focusin', (event) => {
  const focusedElement = event.target;
  const focusedCell = findAncestor(focusedElement, 'TD');

  if (focusedCell) {
    console.log("Focused cell (via focusin):", focusedCell);
    console.log("Row index:", focusedCell.parentNode.rowIndex);
    console.log("Column index:", focusedCell.cellIndex);
  }
});


// implement highlight function that highlights the specific cell + the cells in the same row + coloumn
function highlightFocusedRow() { // Removed the 'color' argument
  const previouslyHighlighted = document.querySelector('.highlighted-row');
  if (previouslyHighlighted) {
    previouslyHighlighted.classList.remove('highlighted-row');
  }

  const focusedRow = getFocusedTableCell();
  if (focusedRow) {
    focusedRow.classList.add('highlighted-row');
  }
}

// Highlight on initial focus
highlightFocusedRow();

// Highlight when focus changes within the table
board.addEventListener('focusin', () => {
  highlightFocusedRow();
});


// blackout the cell and makes it unavailable to type/traverse in unless it's pressed 
// blackoutButton.addEventListener('click', blackoutCell);
// function blackoutCell(){
//   let isBlackout = false;
//   let focusedElement = null;

// }


// $(document).ready(function() {
//   let isBlackout = false;
//   let focusedElement = null;

//   $(document).on('focus', 'input, select', function() {
//     focusedElement = $(this);
//     focusColor[this] = $(this).css('background-color');
//   });

//   $('#blackout').click(function() {
//     isBlackout = !isBlackout;

//     if (isBlackout && focusedElement) {
//       focusedElement.each(function() {
//         $(this).data('originalColor', $(this).css('background-color'));
//         $(this).css('background-color', 'black');
//         $(this).prop('readOnly', true); // Disable typing, not the entire element
//       });
//     } else if (!isBlackout && focusedElement) {
//       focusedElement.each(function() {
//         $(this).css('background-color', $(this).data('originalColor'));
//         $(this).removeData('originalColor');
//         $(this).prop('readOnly', false); // Re-enable typing
//       });
//       focusedElement = null;
//     }
//   });
// });

// moves to the next cell when enter is pressed 
// register jQuery extension
jQuery.extend(jQuery.expr[':'], {
  focusable: function (el, index, selector) {
      return $(el).is('a, button, :input, [tabindex]');
  }
});

//for enter key
$(document).on('keypress', 'input,select', function (e) {
  if (e.key == "Enter") {//13 is unicode for enter 
      e.preventDefault();
      // Get all focusable elements on the page
      var $canfocus = $(':focusable');
      var index = $canfocus.index(this) + 1;
      if (index >= $canfocus.length) index = 0;
      $canfocus.eq(index).focus();
  }
});

// allows the arrow keys to traverse through the board
$(document).on('keydown', 'input,select', function (e) {
  const size = parseInt(boardSizeInput.value);
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    var $canfocus = $(':focusable');
    var index = $canfocus.index(this); // Get current element index
    let focusedInput = $('input:focus');

    if (e.key === 'ArrowUp') {
      index = index-size; // Move to the element above
      if (index < 0) index = $canfocus.length; // Wrap around to the last element
    } else if (e.key === 'ArrowDown'){
      index = index+size; // Move to the element below
      if (index >= $canfocus.length) index = $canfocus.length; // Wrap around to the first element
    } else if (e.key === 'ArrowRight'){
        if (focusedInput.length == 1){
          // Set the cursor to the end
          this.setSelectionRange(1,1);
          index++
          if (index >= $canfocus.length) index = $canfocus.index(this) + 1;
        }
        else{
          index++
          if (index >= $canfocus.length) index = $canfocus.index(this) + 1;
        }
      } else{
      index--
      if (index >= $canfocus.length) index = $canfocus.index(this) - 1;
    }
    $canfocus.eq(index).focus();
  }
});

downloadButton.addEventListener
('click', async function () {
    const filename = 'boardData.pdf';
    try {
        const opt = {
            margin: 1,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: 'in', format: 'letter',
                orientation: 'portrait'
            }
        };
        await html2pdf().set(opt).
            from(myBoard).save();
    } catch (error) {
        console.error('Error:', error.message);
    }
});