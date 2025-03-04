const boardInputs = document.querySelectorAll('.board-input');
const boardSizeInput = document.getElementById('boardSize');
const clearButton = document.getElementById('clearBoard');
const board = document.getElementById('myBoard');
const downloadButton = document.getElementById('save');
const subButton = document.getElementById('numLeft');
const addButton = document.getElementById('numRight')

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