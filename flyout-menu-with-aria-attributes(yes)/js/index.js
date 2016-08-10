var nav = $("nav");
var toggle = $("<button>menu</button>");
var close = $("<button>×</button>");
var expanded = "aria-expanded";

// Triggers toggleAttr()
var buttons = toggle
  .add(close);

// Uses toggleAttr()
var items = nav
  .add(toggle)
  .add(close);

// Create the toggle and close buttons
toggle.insertBefore(nav);
close.prependTo(nav);

// Add toggle button ARIA attributes
toggle.attr({
  id: "nav--toggle",
  title: "toggle main menu",
  role: "button",
  "aria-label": "toggle main menu",
  "aria-controls": "navigation",
  "aria-expanded": "false"
});

// Add close button ARIA attributes
close.attr({
  id: "nav--close",
  title: "close main menu",
  role: "button",
  "aria-label": "close main menu",
  "aria-controls": "navigation",
  "aria-expanded": "false"
});

// Add nav region ARIA attributes
nav.attr({
  "aria-label": "main menu region",
  "aria-expanded": "false"
});

// Navigation toggle events
buttons.on("click", function() {
  toggleAttr(items);
});

// Function to toggle attributes
function toggleAttr(el) {
  el.each(function() {
    if ($(this).attr(expanded) == "false") {
      $(this).attr(expanded, "true");
    } else {
      $(this).attr(expanded, "false");
    }
  });
}