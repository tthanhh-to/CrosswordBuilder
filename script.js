const gridInputs = document.querySelectorAll('.grid-input');
const gridSizeInput = document.getElementById('gridSize');
const generateButton = document.getElementById('generateGrid');
const grid = document.getElementById('myGrid');

// this function is used to create the size grid requested for the user dynamically
generateButton.addEventListener('click', generateDynamicGrid);

function generateDynamicGrid() {
  const size = parseInt(gridSizeInput.value);
  if (isNaN(size) || size < 1) return; // Prevent invalid input

  grid.innerHTML = ''; // Clear previous grid

  for (let i = 0; i < size; i++) {
    const row = grid.insertRow();
    for (let j = 0; j < size; j++) {
      const cell = row.insertCell();
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'grid-input';
      input.maxLength = 1;
      cell.appendChild(input);
      input.addEventListener('input', (event) => {
        event.target.value = event.target.value.toUpperCase();
      });
    }
  }
}

// Generate initial grid on page load
generateDynamicGrid();

// Re-generate grid when the size changes via keyboard entry.
gridSizeInput.addEventListener('change', generateDynamicGrid)


// this function is for putting each letter in each grid space

gridInputs.forEach(input => {
  input.addEventListener('change', (event) => {
    console.log('Input changed:', event.target.value);
    // Add validation or data processing here
  });
});

function getGridData() {
  const data = [];
  const rows = document.querySelectorAll('#myGrid tr');
  rows.forEach(row => {
    const rowData = [];
    const inputs = row.querySelectorAll('.grid-input');
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
  const size = parseInt(gridSizeInput.value);
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    var $canfocus = $(':focusable');
    var index = $canfocus.index(this); // Get current element index

    if (e.key === 'ArrowUp') {
      index = index-size; // Move to the element above
      if (index < 0) index = $canfocus.length; // Wrap around to the last element
    } else if (e.key === 'ArrowDown'){
      index = index+size; // Move to the element below
      if (index >= $canfocus.length) index = $canfocus.length; // Wrap around to the first element
    } else if (e.key === 'ArrowRight'){
      index++
      if (index >= $canfocus.length) index = $canfocus.index(this) + 1;
    } else{
      index--
      if (index >= $canfocus.length) index = $canfocus.index(this) - 1;
    }

    $canfocus.eq(index).focus();
  }
});
