/* eslint-disable no-undef */
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

function setupComboboxWithListAutocomplete() {
  class ComboboxAutocomplete {
    constructor(comboboxNode, buttonNode, listboxNode) {
      this.comboboxNode = comboboxNode;
      this.buttonNode = buttonNode;
      this.listboxNode = listboxNode;

      this.comboboxHasVisualFocus = false;
      this.listboxHasVisualFocus = false;

      this.hasHover = false;

      this.isNone = false;
      this.isList = false;
      this.isBoth = false;

      this.allOptions = [];

      this.option = null;
      this.firstOption = null;
      this.lastOption = null;

      this.filteredOptions = [];
      this.filter = "";

      var autocomplete = this.comboboxNode.getAttribute("aria-autocomplete");

      if (typeof autocomplete === "string") {
        autocomplete = autocomplete.toLowerCase();
        this.isNone = autocomplete === "none";
        this.isList = autocomplete === "list";
        this.isBoth = autocomplete === "both";
      } else {
        // default value of autocomplete
        this.isNone = true;
      }

      this.comboboxNode.addEventListener(
        "keydown",
        this.onComboboxKeyDown.bind(this)
      );
      this.comboboxNode.addEventListener(
        "keyup",
        this.onComboboxKeyUp.bind(this)
      );
      this.comboboxNode.addEventListener(
        "click",
        this.onComboboxClick.bind(this)
      );
      this.comboboxNode.addEventListener(
        "focus",
        this.onComboboxFocus.bind(this)
      );
      this.comboboxNode.addEventListener(
        "blur",
        this.onComboboxBlur.bind(this)
      );

      document.body.addEventListener(
        "pointerup",
        this.onBackgroundPointerUp.bind(this),
        true
      );

      // initialize pop up menu

      this.listboxNode.addEventListener(
        "pointerover",
        this.onListboxPointerover.bind(this)
      );
      this.listboxNode.addEventListener(
        "pointerout",
        this.onListboxPointerout.bind(this)
      );

      // Traverse the element children of domNode: configure each with
      // option role behavior and store reference in.options array.
      var nodes = this.listboxNode.getElementsByTagName("LI");

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        this.allOptions.push(node);

        node.addEventListener("click", this.onOptionClick.bind(this));
        node.addEventListener(
          "pointerover",
          this.onOptionPointerover.bind(this)
        );
        node.addEventListener("pointerout", this.onOptionPointerout.bind(this));
      }

      this.filterOptions();

      // Open Button

      var button = this.comboboxNode.nextElementSibling;

      if (button && button.tagName === "BUTTON") {
        button.addEventListener("click", this.onButtonClick.bind(this));
      }
    }

    getLowercaseContent(node) {
      return node.textContent.toLowerCase();
    }

    isOptionInView(option) {
      var bounding = option.getBoundingClientRect();
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    setActiveDescendant(option) {
      if (option && this.listboxHasVisualFocus) {
        this.comboboxNode.setAttribute("aria-activedescendant", option.id);
        if (!this.isOptionInView(option)) {
          option.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      } else {
        this.comboboxNode.setAttribute("aria-activedescendant", "");
      }
    }

    setValue(value) {
      this.filter = value;
      this.comboboxNode.value = this.filter;
      this.comboboxNode.setSelectionRange(
        this.filter.length,
        this.filter.length
      );
      this.filterOptions();
    }

    setOption(option, flag) {
      if (typeof flag !== "boolean") {
        flag = false;
      }

      if (option) {
        this.option = option;
        this.setCurrentOptionStyle(this.option);
        this.setActiveDescendant(this.option);

        if (this.isBoth) {
          this.comboboxNode.value = this.option.textContent;
          if (flag) {
            this.comboboxNode.setSelectionRange(
              this.option.textContent.length,
              this.option.textContent.length
            );
          } else {
            this.comboboxNode.setSelectionRange(
              this.filter.length,
              this.option.textContent.length
            );
          }
        }
      }
    }

    setVisualFocusCombobox() {
      this.listboxNode.classList.remove("focus");
      this.comboboxNode.parentNode.classList.add("focus"); // set the focus class to the parent for easier styling
      this.comboboxHasVisualFocus = true;
      this.listboxHasVisualFocus = false;
      this.setActiveDescendant(false);
    }

    setVisualFocusListbox() {
      this.comboboxNode.parentNode.classList.remove("focus");
      this.comboboxHasVisualFocus = false;
      this.listboxHasVisualFocus = true;
      this.listboxNode.classList.add("focus");
      this.setActiveDescendant(this.option);
    }

    removeVisualFocusAll() {
      this.comboboxNode.parentNode.classList.remove("focus");
      this.comboboxHasVisualFocus = false;
      this.listboxHasVisualFocus = false;
      this.listboxNode.classList.remove("focus");
      this.option = null;
      this.setActiveDescendant(false);
    }

    // ComboboxAutocomplete Events

    filterOptions() {
      // do not filter any options if autocomplete is none
      if (this.isNone) {
        this.filter = "";
      }

      var option = null;
      var currentOption = this.option;
      var filter = this.filter.toLowerCase();

      this.filteredOptions = [];
      this.listboxNode.innerHTML = "";

      for (var i = 0; i < this.allOptions.length; i++) {
        option = this.allOptions[i];
        if (
          filter.length === 0 ||
          this.getLowercaseContent(option).indexOf(filter) === 0
        ) {
          this.filteredOptions.push(option);
          this.listboxNode.appendChild(option);
        }
      }

      // Use populated options array to initialize firstOption and lastOption.
      var numItems = this.filteredOptions.length;
      if (numItems > 0) {
        this.firstOption = this.filteredOptions[0];
        this.lastOption = this.filteredOptions[numItems - 1];

        if (currentOption && this.filteredOptions.indexOf(currentOption) >= 0) {
          option = currentOption;
        } else {
          option = this.firstOption;
        }
      } else {
        this.firstOption = null;
        option = null;
        this.lastOption = null;
      }

      return option;
    }

    setCurrentOptionStyle(option) {
      for (var i = 0; i < this.filteredOptions.length; i++) {
        var opt = this.filteredOptions[i];
        if (opt === option) {
          opt.setAttribute("aria-selected", "true");
          if (
            this.listboxNode.scrollTop + this.listboxNode.offsetHeight <
            opt.offsetTop + opt.offsetHeight
          ) {
            this.listboxNode.scrollTop =
              opt.offsetTop + opt.offsetHeight - this.listboxNode.offsetHeight;
          } else if (this.listboxNode.scrollTop > opt.offsetTop + 2) {
            this.listboxNode.scrollTop = opt.offsetTop;
          }
        } else {
          opt.removeAttribute("aria-selected");
        }
      }
    }

    getPreviousOption(currentOption) {
      if (currentOption !== this.firstOption) {
        var index = this.filteredOptions.indexOf(currentOption);
        return this.filteredOptions[index - 1];
      }
      return this.lastOption;
    }

    getNextOption(currentOption) {
      if (currentOption !== this.lastOption) {
        var index = this.filteredOptions.indexOf(currentOption);
        return this.filteredOptions[index + 1];
      }
      return this.firstOption;
    }

    /* MENU DISPLAY METHODS */

    doesOptionHaveFocus() {
      return this.comboboxNode.getAttribute("aria-activedescendant") !== "";
    }

    isOpen() {
      return this.listboxNode.style.display === "block";
    }

    isClosed() {
      return this.listboxNode.style.display !== "block";
    }

    hasOptions() {
      return this.filteredOptions.length;
    }

    open() {
      this.listboxNode.style.display = "block";
      this.comboboxNode.setAttribute("aria-expanded", "true");
      this.buttonNode.setAttribute("aria-expanded", "true");
    }

    close(force) {
      if (typeof force !== "boolean") {
        force = false;
      }

      if (
        force ||
        (!this.comboboxHasVisualFocus &&
          !this.listboxHasVisualFocus &&
          !this.hasHover)
      ) {
        this.setCurrentOptionStyle(false);
        this.listboxNode.style.display = "none";
        this.comboboxNode.setAttribute("aria-expanded", "false");
        this.buttonNode.setAttribute("aria-expanded", "false");
        this.setActiveDescendant(false);
        this.comboboxNode.parentNode.classList.add("focus");
      }
    }

    /* combobox Events */

    onComboboxKeyDown(event) {
      var flag = false,
        altKey = event.altKey;

      if (event.ctrlKey || event.shiftKey) {
        return;
      }

      switch (event.key) {
        case "Enter":
          if (this.listboxHasVisualFocus) {
            this.setValue(this.option.textContent);
          }
          this.close(true);
          this.setVisualFocusCombobox();
          flag = true;
          break;

        case "Down":
        case "ArrowDown":
          if (this.filteredOptions.length > 0) {
            if (altKey) {
              this.open();
            } else {
              this.open();
              if (
                this.listboxHasVisualFocus ||
                (this.isBoth && this.filteredOptions.length > 1)
              ) {
                this.setOption(this.getNextOption(this.option), true);
                this.setVisualFocusListbox();
              } else {
                this.setOption(this.firstOption, true);
                this.setVisualFocusListbox();
              }
            }
          }
          flag = true;
          break;

        case "Up":
        case "ArrowUp":
          if (this.hasOptions()) {
            if (this.listboxHasVisualFocus) {
              this.setOption(this.getPreviousOption(this.option), true);
            } else {
              this.open();
              if (!altKey) {
                this.setOption(this.lastOption, true);
                this.setVisualFocusListbox();
              }
            }
          }
          flag = true;
          break;

        case "Esc":
        case "Escape":
          if (this.isOpen()) {
            this.close(true);
            this.filter = this.comboboxNode.value;
            this.filterOptions();
            this.setVisualFocusCombobox();
          } else {
            this.setValue("");
            this.comboboxNode.value = "";
          }
          this.option = null;
          flag = true;
          break;

        case "Tab":
          this.close(true);
          if (this.listboxHasVisualFocus) {
            if (this.option) {
              this.setValue(this.option.textContent);
            }
          }
          break;

        case "Home":
          this.comboboxNode.setSelectionRange(0, 0);
          flag = true;
          break;

        case "End":
          var length = this.comboboxNode.value.length;
          this.comboboxNode.setSelectionRange(length, length);
          flag = true;
          break;

        default:
          break;
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }

    isPrintableCharacter(str) {
      return str.length === 1 && str.match(/\S| /);
    }

    onComboboxKeyUp(event) {
      var flag = false,
        option = null,
        char = event.key;

      if (this.isPrintableCharacter(char)) {
        this.filter += char;
      }

      // this is for the case when a selection in the textbox has been deleted
      if (this.comboboxNode.value.length < this.filter.length) {
        this.filter = this.comboboxNode.value;
        this.option = null;
        this.filterOptions();
      }

      if (event.key === "Escape" || event.key === "Esc") {
        return;
      }

      switch (event.key) {
        case "Backspace":
          this.setVisualFocusCombobox();
          this.setCurrentOptionStyle(false);
          this.filter = this.comboboxNode.value;
          this.option = null;
          this.filterOptions();
          flag = true;
          break;

        case "Left":
        case "ArrowLeft":
        case "Right":
        case "ArrowRight":
        case "Home":
        case "End":
          if (this.isBoth) {
            this.filter = this.comboboxNode.value;
          } else {
            this.option = null;
            this.setCurrentOptionStyle(false);
          }
          this.setVisualFocusCombobox();
          flag = true;
          break;

        default:
          if (this.isPrintableCharacter(char)) {
            this.setVisualFocusCombobox();
            this.setCurrentOptionStyle(false);
            flag = true;

            if (this.isList || this.isBoth) {
              option = this.filterOptions();
              if (option) {
                if (this.isClosed() && this.comboboxNode.value.length) {
                  this.open();
                }

                if (
                  this.getLowercaseContent(option).indexOf(
                    this.comboboxNode.value.toLowerCase()
                  ) === 0
                ) {
                  this.option = option;
                  if (this.isBoth || this.listboxHasVisualFocus) {
                    this.setCurrentOptionStyle(option);
                    if (this.isBoth) {
                      this.setOption(option);
                    }
                  }
                } else {
                  this.option = null;
                  this.setCurrentOptionStyle(false);
                }
              } else {
                this.close();
                this.option = null;
                this.setActiveDescendant(false);
              }
            } else if (this.comboboxNode.value.length) {
              this.open();
            }
          }

          break;
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }

    onComboboxClick() {
      if (this.isOpen()) {
        this.close(true);
      } else {
        this.open();
      }
    }

    onComboboxFocus() {
      this.filter = this.comboboxNode.value;
      this.filterOptions();
      this.setVisualFocusCombobox();
      this.option = null;
      this.setCurrentOptionStyle(null);
    }

    onComboboxBlur() {
      this.removeVisualFocusAll();
    }

    onBackgroundPointerUp(event) {
      if (
        !this.comboboxNode.contains(event.target) &&
        !this.listboxNode.contains(event.target) &&
        !this.buttonNode.contains(event.target)
      ) {
        this.comboboxHasVisualFocus = false;
        this.setCurrentOptionStyle(null);
        this.removeVisualFocusAll();
        setTimeout(this.close.bind(this, true), 300);
      }
    }

    onButtonClick() {
      if (this.isOpen()) {
        this.close(true);
      } else {
        this.open();
      }
      this.comboboxNode.focus();
      this.setVisualFocusCombobox();
    }

    /* Listbox Events */

    onListboxPointerover() {
      this.hasHover = true;
    }

    onListboxPointerout() {
      this.hasHover = false;
      setTimeout(this.close.bind(this, false), 300);
    }

    // Listbox Option Events

    onOptionClick(event) {
      this.comboboxNode.value = event.target.textContent;
      this.close(true);
    }

    onOptionPointerover() {
      this.hasHover = true;
      this.open();
    }

    onOptionPointerout() {
      this.hasHover = false;
      setTimeout(this.close.bind(this, false), 300);
    }
  }

  // Initialize comboboxes

  document.body.innerHTML = `
  <label for="cb1-input">State</label>
  <div class="combobox combobox-list">
    <div class="group">
      <input id="cb1-input" class="cb_edit" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="cb1-listbox">
      <button id="cb1-button" tabindex="-1" aria-label="States" aria-expanded="false" aria-controls="cb1-listbox">
        <svg width="18" height="16" aria-hidden="true" focusable="false" style="forced-color-adjust: auto">
          <polygon class="arrow" stroke-width="0" fill-opacity="0.75" fill="currentcolor" points="3,6 15,6 9,14"></polygon>
        </svg>
      </button>
    </div>
    <ul id="cb1-listbox" role="listbox" aria-label="States">
      <li id="lb1-al" role="option">Alabama</li>
      <li id="lb1-ak" role="option">Alaska</li>
      <li id="lb1-as" role="option">American Samoa</li>
      <li id="lb1-az" role="option">Arizona</li>
      <li id="lb1-ar" role="option">Arkansas</li>
      <li id="lb1-ca" role="option">California</li>
      <li id="lb1-co" role="option">Colorado</li>
      <li id="lb1-ct" role="option">Connecticut</li>
      <li id="lb1-de" role="option">Delaware</li>
      <li id="lb1-dc" role="option">District of Columbia</li>
      <li id="lb1-fl" role="option">Florida</li>
      <li id="lb1-ga" role="option">Georgia</li>
      <li id="lb1-gm" role="option">Guam</li>
      <li id="lb1-hi" role="option">Hawaii</li>
      <li id="lb1-id" role="option">Idaho</li>
      <li id="lb1-il" role="option">Illinois</li>
      <li id="lb1-in" role="option">Indiana</li>
      <li id="lb1-ia" role="option">Iowa</li>
      <li id="lb1-ks" role="option">Kansas</li>
      <li id="lb1-ky" role="option">Kentucky</li>
      <li id="lb1-la" role="option">Louisiana</li>
      <li id="lb1-me" role="option">Maine</li>
      <li id="lb1-md" role="option">Maryland</li>
      <li id="lb1-ma" role="option">Massachusetts</li>
      <li id="lb1-mi" role="option">Michigan</li>
      <li id="lb1-mn" role="option">Minnesota</li>
      <li id="lb1-ms" role="option">Mississippi</li>
      <li id="lb1-mo" role="option">Missouri</li>
      <li id="lb1-mt" role="option">Montana</li>
      <li id="lb1-ne" role="option">Nebraska</li>
      <li id="lb1-nv" role="option">Nevada</li>
      <li id="lb1-nh" role="option">New Hampshire</li>
      <li id="lb1-nj" role="option">New Jersey</li>
      <li id="lb1-nm" role="option">New Mexico</li>
      <li id="lb1-ny" role="option">New York</li>
      <li id="lb1-nc" role="option">North Carolina</li>
      <li id="lb1-nd" role="option">North Dakota</li>
      <li id="lb1-mp" role="option">Northern Marianas Islands</li>
      <li id="lb1-oh" role="option">Ohio</li>
      <li id="lb1-ok" role="option">Oklahoma</li>
      <li id="lb1-or" role="option">Oregon</li>
      <li id="lb1-pa" role="option">Pennsylvania</li>
      <li id="lb1-pr" role="option">Puerto Rico</li>
      <li id="lb1-ri" role="option">Rhode Island</li>
      <li id="lb1-sc" role="option">South Carolina</li>
      <li id="lb1-sd" role="option">South Dakota</li>
      <li id="lb1-tn" role="option">Tennessee</li>
      <li id="lb1-tx" role="option">Texas</li>
      <li id="lb1-ut" role="option">Utah</li>
      <li id="lb1-ve" role="option">Vermont</li>
      <li id="lb1-va" role="option">Virginia</li>
      <li id="lb1-vi" role="option">Virgin Islands</li>
      <li id="lb1-wa" role="option">Washington</li>
      <li id="lb1-wv" role="option">West Virginia</li>
      <li id="lb1-wi" role="option">Wisconsin</li>
      <li id="lb1-wy" role="option">Wyoming</li>
    </ul>
  </div>
  `;

  function onload() {
    var comboboxes = document.querySelectorAll(".combobox-list");

    for (var i = 0; i < comboboxes.length; i++) {
      var combobox = comboboxes[i];
      var comboboxNode = combobox.querySelector("input");
      var buttonNode = combobox.querySelector("button");
      var listboxNode = combobox.querySelector("[role=\"listbox\"]");
      new ComboboxAutocomplete(comboboxNode, buttonNode, listboxNode);
    }
  }

  window.addEventListener("load", onload);

  return () => window.removeEventListener("load", onload);
}

module.exports = { setupComboboxWithListAutocomplete };
