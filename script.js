// script.js
const htmlInput = document.getElementById("html-input");
const cssInput = document.getElementById("css-input");
const jsInput = document.getElementById("js-input");
const resultFrame = document.getElementById("result-frame");
const errorList = document.getElementById("error-list");
const exportHtmlButton = document.getElementById("export-html");
const exportImageButton = document.getElementById("export-image");

function updatePreview() {
  const htmlCode = htmlInput.value;
  const cssCode = `<style>${cssInput.value}</style>`;
  const jsCode = `<script>${jsInput.value}</script>`;

  const combinedCode = `
        <html>
        <head>
            ${cssCode}
        </head>
        <body>
            ${htmlCode}
            ${jsCode}
        </body>
        </html>
    `;

  resultFrame.srcdoc = combinedCode;

  // Clear the error list
  errorList.innerHTML = "";

  // Try to execute the JavaScript code and capture errors
  try {
    resultFrame.contentWindow.eval(jsInput.value);
  } catch (error) {
    // Display errors in the error console
    const errorItem = document.createElement("li");
    errorItem.textContent = error.message;
    errorList.appendChild(errorItem);
  }
}

// Function to export the code as an HTML file
function exportHTML() {
  const combinedCode = `
        <html>
        <head>
            ${cssInput.value}
        </head>
        <body>
            ${htmlInput.value}
            <script>${jsInput.value}</script>
        </body>
        </html>
    `;

  const blob = new Blob([combinedCode], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Create a download link
  const a = document.createElement("a");
  a.href = url;
  a.download = "code.html";
  a.click();

  URL.revokeObjectURL(url);
}

// Function to export the preview as an image
function exportImage() {
  // Capture the current state of the preview iframe as an image
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = resultFrame.clientWidth;
  canvas.height = resultFrame.clientHeight;

  ctx.drawImage(resultFrame, 0, 0, canvas.width, canvas.height);

  // Convert the canvas to a data URL
  const dataURL = canvas.toDataURL("image/png");

  // Create a download link for the image
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "preview.png";
  a.click();
}

// Attach event listeners
htmlInput.addEventListener("input", updatePreview);
cssInput.addEventListener("input", updatePreview);
jsInput.addEventListener("input", updatePreview);
exportHtmlButton.addEventListener("click", exportHTML);
exportImageButton.addEventListener("click", exportImage);

// Initial preview update
updatePreview();
// HTML tag auto-completion data
const htmlTags = [
    'html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'p', 'div', 'span',
    'a', 'img', 'ul', 'ol', 'li', 'form', 'input', 'button', 'script', 'link',
    // Add more tags as needed
];

htmlInput.addEventListener('input', function () {
    const inputValue = htmlInput.value.toLowerCase();
    const lastWord = inputValue.split(/[<\s>]/).pop(); // Get the last word

    if (lastWord) {
        const suggestions = htmlTags.filter(tag => tag.startsWith(lastWord));

        if (suggestions.length > 0) {
            const suggestionsHTML = suggestions.map(tag => `<div class="suggestion">${tag}</div>`).join('');
            suggestionsContainer.innerHTML = suggestionsHTML;
        } else {
            suggestionsContainer.innerHTML = '';
        }
    } else {
        suggestionsContainer.innerHTML = '';
    }
});

// Listen for clicks on suggestions
suggestionsContainer.addEventListener('click', function (event) {
    const clickedSuggestion = event.target.textContent;

    if (clickedSuggestion) {
        // Insert the suggestion into the input field
        htmlInput.value += clickedSuggestion;
        suggestionsContainer.innerHTML = ''; // Clear suggestions
        htmlInput.focus(); // Return focus to the input field
    }
});

// Listen for Enter key press to insert suggestion
htmlInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const selectedSuggestion = suggestionsContainer.querySelector('.suggestion');
        if (selectedSuggestion) {
            // Insert the suggestion into the input field
            htmlInput.value += selectedSuggestion.textContent;
            suggestionsContainer.innerHTML = ''; // Clear suggestions
        }
    }
});

