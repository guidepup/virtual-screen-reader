/**
 * @namespace aria
 */

var aria = aria || {};
window.aria = aria;

/**
 * @description
 *  Key code constants
 */
aria.KeyCode = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  SHIFT: 16,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46,
};

aria.Utils = aria.Utils || {};

// Polyfill src https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
aria.Utils.matches = function (element, selector) {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = element.parentNode.querySelectorAll(s);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {
          // empty
        }
        return i > -1;
      };
  }

  return element.matches(selector);
};

aria.Utils.remove = function (item) {
  if (item.remove && typeof item.remove === "function") {
    return item.remove();
  }
  if (
    item.parentNode &&
    item.parentNode.removeChild &&
    typeof item.parentNode.removeChild === "function"
  ) {
    return item.parentNode.removeChild(item);
  }
  return false;
};

aria.Utils.isFocusable = function (element) {
  if (element.tabIndex < 0) {
    return false;
  }

  if (element.disabled) {
    return false;
  }

  switch (element.nodeName) {
    case "A":
      return !!element.href && element.rel != "ignore";
    case "INPUT":
      return element.type != "hidden";
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA":
      return true;
    default:
      return false;
  }
};

aria.Utils.getAncestorBySelector = function (element, selector) {
  if (!aria.Utils.matches(element, selector + " " + element.tagName)) {
    // Element is not inside an element that matches selector
    return null;
  }

  // Move up the DOM tree until a parent matching the selector is found
  var currentNode = element;
  var ancestor = null;
  while (ancestor === null) {
    if (aria.Utils.matches(currentNode.parentNode, selector)) {
      ancestor = currentNode.parentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return ancestor;
};

aria.Utils.hasClass = function (element, className) {
  return new RegExp("(\\s|^)" + className + "(\\s|$)").test(element.className);
};

aria.Utils.addClass = function (element, className) {
  if (!aria.Utils.hasClass(element, className)) {
    element.className += " " + className;
  }
};

aria.Utils.removeClass = function (element, className) {
  var classRegex = new RegExp("(\\s|^)" + className + "(\\s|$)");
  element.className = element.className.replace(classRegex, " ").trim();
};

aria.Utils.bindMethods = function (object /* , ...methodNames */) {
  var methodNames = Array.prototype.slice.call(arguments, 1);
  methodNames.forEach(function (method) {
    object[method] = object[method].bind(object);
  });
};
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

aria.Utils = aria.Utils || {};

(function () {
  /*
   * When util functions move focus around, set this true so the focus listener
   * can ignore the events.
   */
  aria.Utils.IgnoreUtilFocusChanges = false;

  aria.Utils.dialogOpenClass = "has-dialog";

  /**
   * @description Set focus on descendant nodes until the first focusable element is
   *       found.
   * @param element
   *          DOM node for which to find the first focusable descendant.
   * @returns {boolean}
   *  true if a focusable element is found and focus is set.
   */
  aria.Utils.focusFirstDescendant = function (element) {
    for (var i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];
      if (
        aria.Utils.attemptFocus(child) ||
        aria.Utils.focusFirstDescendant(child)
      ) {
        return true;
      }
    }
    return false;
  }; // end focusFirstDescendant

  /**
   * @description Find the last descendant node that is focusable.
   * @param element
   *          DOM node for which to find the last focusable descendant.
   * @returns {boolean}
   *  true if a focusable element is found and focus is set.
   */
  aria.Utils.focusLastDescendant = function (element) {
    for (var i = element.childNodes.length - 1; i >= 0; i--) {
      var child = element.childNodes[i];
      if (
        aria.Utils.attemptFocus(child) ||
        aria.Utils.focusLastDescendant(child)
      ) {
        return true;
      }
    }
    return false;
  }; // end focusLastDescendant

  /**
   * @description Set Attempt to set focus on the current node.
   * @param element
   *          The node to attempt to focus on.
   * @returns {boolean}
   *  true if element is focused.
   */
  aria.Utils.attemptFocus = function (element) {
    if (!aria.Utils.isFocusable(element)) {
      return false;
    }

    aria.Utils.IgnoreUtilFocusChanges = true;
    try {
      element.focus();
    } catch {
      // continue regardless of error
    }
    aria.Utils.IgnoreUtilFocusChanges = false;
    return document.activeElement === element;
  }; // end attemptFocus

  /* Modals can open modals. Keep track of them with this array. */
  aria.OpenDialogList = aria.OpenDialogList || new Array(0);

  /**
   * @returns {object} the last opened dialog (the current dialog)
   */
  aria.getCurrentDialog = function () {
    if (aria.OpenDialogList && aria.OpenDialogList.length) {
      return aria.OpenDialogList[aria.OpenDialogList.length - 1];
    }
  };

  aria.closeCurrentDialog = function () {
    var currentDialog = aria.getCurrentDialog();
    if (currentDialog) {
      currentDialog.close();
      return true;
    }

    return false;
  };

  aria.handleEscape = function (event) {
    var key = event.which || event.keyCode;

    if (key === aria.KeyCode.ESC && aria.closeCurrentDialog()) {
      event.stopPropagation();
    }
  };

  document.addEventListener("keyup", aria.handleEscape);

  /**
   * @class
   * @description Dialog object providing modal focus management.
   *
   * Assumptions: The element serving as the dialog container is present in the
   * DOM and hidden. The dialog container has role='dialog'.
   * @param dialogId
   *          The ID of the element serving as the dialog container.
   * @param focusAfterClosed
   *          Either the DOM node or the ID of the DOM node to focus when the
   *          dialog closes.
   * @param focusFirst
   *          Optional parameter containing either the DOM node or the ID of the
   *          DOM node to focus when the dialog opens. If not specified, the
   *          first focusable element in the dialog will receive focus.
   */
  aria.Dialog = function (dialogId, focusAfterClosed, focusFirst) {
    this.dialogNode = document.getElementById(dialogId);
    if (this.dialogNode === null) {
      throw new Error('No element found with id="' + dialogId + '".');
    }

    var validRoles = ["dialog", "alertdialog"];
    var isDialog = (this.dialogNode.getAttribute("role") || "")
      .trim()
      .split(/\s+/g)
      .some(function (token) {
        return validRoles.some(function (role) {
          return token === role;
        });
      });
    if (!isDialog) {
      throw new Error(
        "Dialog() requires a DOM element with ARIA role of dialog or alertdialog."
      );
    }

    // Wrap in an individual backdrop element if one doesn't exist
    // Native <dialog> elements use the ::backdrop pseudo-element, which
    // works similarly.
    var backdropClass = "dialog-backdrop";
    if (this.dialogNode.parentNode.classList.contains(backdropClass)) {
      this.backdropNode = this.dialogNode.parentNode;
    } else {
      this.backdropNode = document.createElement("div");
      this.backdropNode.className = backdropClass;
      this.dialogNode.parentNode.insertBefore(
        this.backdropNode,
        this.dialogNode
      );
      this.backdropNode.appendChild(this.dialogNode);
    }
    this.backdropNode.classList.add("active");

    // Disable scroll on the body element
    document.body.classList.add(aria.Utils.dialogOpenClass);

    if (typeof focusAfterClosed === "string") {
      this.focusAfterClosed = document.getElementById(focusAfterClosed);
    } else if (typeof focusAfterClosed === "object") {
      this.focusAfterClosed = focusAfterClosed;
    } else {
      throw new Error(
        "the focusAfterClosed parameter is required for the aria.Dialog constructor."
      );
    }

    if (typeof focusFirst === "string") {
      this.focusFirst = document.getElementById(focusFirst);
    } else if (typeof focusFirst === "object") {
      this.focusFirst = focusFirst;
    } else {
      this.focusFirst = null;
    }

    // Bracket the dialog node with two invisible, focusable nodes.
    // While this dialog is open, we use these to make sure that focus never
    // leaves the document even if dialogNode is the first or last node.
    var preDiv = document.createElement("div");
    this.preNode = this.dialogNode.parentNode.insertBefore(
      preDiv,
      this.dialogNode
    );
    this.preNode.tabIndex = 0;
    var postDiv = document.createElement("div");
    this.postNode = this.dialogNode.parentNode.insertBefore(
      postDiv,
      this.dialogNode.nextSibling
    );
    this.postNode.tabIndex = 0;

    // If this modal is opening on top of one that is already open,
    // get rid of the document focus listener of the open dialog.
    if (aria.OpenDialogList.length > 0) {
      aria.getCurrentDialog().removeListeners();
    }

    this.addListeners();
    aria.OpenDialogList.push(this);
    this.clearDialog();
    this.dialogNode.className = "default_dialog"; // make visible

    if (this.focusFirst) {
      this.focusFirst.focus();
    } else {
      aria.Utils.focusFirstDescendant(this.dialogNode);
    }

    this.lastFocus = document.activeElement;
  }; // end Dialog constructor

  aria.Dialog.prototype.clearDialog = function () {
    Array.prototype.map.call(
      this.dialogNode.querySelectorAll("input"),
      function (input) {
        input.value = "";
      }
    );
  };

  /**
   * @description
   *  Hides the current top dialog,
   *  removes listeners of the top dialog,
   *  restore listeners of a parent dialog if one was open under the one that just closed,
   *  and sets focus on the element specified for focusAfterClosed.
   */
  aria.Dialog.prototype.close = function () {
    aria.OpenDialogList.pop();
    this.removeListeners();
    aria.Utils.remove(this.preNode);
    aria.Utils.remove(this.postNode);
    this.dialogNode.className = "hidden";
    this.backdropNode.classList.remove("active");
    this.focusAfterClosed.focus();

    // If a dialog was open underneath this one, restore its listeners.
    if (aria.OpenDialogList.length > 0) {
      aria.getCurrentDialog().addListeners();
    } else {
      document.body.classList.remove(aria.Utils.dialogOpenClass);
    }
  }; // end close

  /**
   * @description
   *  Hides the current dialog and replaces it with another.
   * @param newDialogId
   *  ID of the dialog that will replace the currently open top dialog.
   * @param newFocusAfterClosed
   *  Optional ID or DOM node specifying where to place focus when the new dialog closes.
   *  If not specified, focus will be placed on the element specified by the dialog being replaced.
   * @param newFocusFirst
   *  Optional ID or DOM node specifying where to place focus in the new dialog when it opens.
   *  If not specified, the first focusable element will receive focus.
   */
  aria.Dialog.prototype.replace = function (
    newDialogId,
    newFocusAfterClosed,
    newFocusFirst
  ) {
    aria.OpenDialogList.pop();
    this.removeListeners();
    aria.Utils.remove(this.preNode);
    aria.Utils.remove(this.postNode);
    this.dialogNode.className = "hidden";
    this.backdropNode.classList.remove("active");

    var focusAfterClosed = newFocusAfterClosed || this.focusAfterClosed;
    new aria.Dialog(newDialogId, focusAfterClosed, newFocusFirst);
  }; // end replace

  aria.Dialog.prototype.addListeners = function () {
    document.addEventListener("focus", this.trapFocus, true);
  }; // end addListeners

  aria.Dialog.prototype.removeListeners = function () {
    document.removeEventListener("focus", this.trapFocus, true);
  }; // end removeListeners

  aria.Dialog.prototype.trapFocus = function (event) {
    if (aria.Utils.IgnoreUtilFocusChanges) {
      return;
    }
    var currentDialog = aria.getCurrentDialog();
    if (currentDialog.dialogNode.contains(event.target)) {
      currentDialog.lastFocus = event.target;
    } else {
      aria.Utils.focusFirstDescendant(currentDialog.dialogNode);
      if (currentDialog.lastFocus == document.activeElement) {
        aria.Utils.focusLastDescendant(currentDialog.dialogNode);
      }
      currentDialog.lastFocus = document.activeElement;
    }
  }; // end trapFocus

  window.openDialog = function (dialogId, focusAfterClosed, focusFirst) {
    new aria.Dialog(dialogId, focusAfterClosed, focusFirst);
  };

  window.closeDialog = function (closeButton) {
    var topDialog = aria.getCurrentDialog();
    if (topDialog.dialogNode.contains(closeButton)) {
      topDialog.close();
    }
  }; // end closeDialog

  window.replaceDialog = function (
    newDialogId,
    newFocusAfterClosed,
    newFocusFirst
  ) {
    var topDialog = aria.getCurrentDialog();
    if (topDialog.dialogNode.contains(document.activeElement)) {
      topDialog.replace(newDialogId, newFocusAfterClosed, newFocusFirst);
    }
  }; // end replaceDialog
})();

function setupAriaModal(ariaModal = "true") {
  document.body.innerHTML = `
<h1>Non-modal heading</h1>
<button type="button" onclick="openDialog('dialog1', this)">Add Delivery Address</button>
<div id="dialog_layer" class="dialogs">
  <div role="dialog" id="dialog1" aria-labelledby="dialog1_label" aria-modal="${ariaModal}" class="hidden">
    <h2 id="dialog1_label" class="dialog_label">Add Delivery Address</h2>
    <div class="dialog_form">
      <div class="dialog_form_item">
        <label>
          <span class="label_text">Street:</span>
          <input type="text" class="wide_input">
        </label>
      </div>
      <div class="dialog_form_item">
        <label>
          <span class="label_text">City:</span>
          <input type="text" class="city_input">
        </label>
      </div>
      <div class="dialog_form_item">
        <label>
          <span class="label_text">State:</span>
          <input type="text" class="state_input">
        </label>
      </div>
      <div class="dialog_form_item">
        <label>
          <span class="label_text">Zip:</span>
          <input type="text" class="zip_input">
        </label>
      </div>

      <div class="dialog_form_item">
        <label for="special_instructions">
          <span class="label_text">Special instructions:</span>
        </label>
        <input id="special_instructions" type="text" aria-describedby="special_instructions_desc" class="wide_input">
        <div class="label_info" id="special_instructions_desc">For example, gate code or other information to help the driver find you</div>
      </div>
    </div>
    <div class="dialog_form_actions">
      <button type="button" onclick="openDialog('dialog2', this, 'dialog2_para1')">Verify Address</button>
      <button type="button" onclick="replaceDialog('dialog3', undefined, 'dialog3_close_btn')">Add</button>
      <button type="button" onclick="closeDialog(this)">Cancel</button>
    </div>
  </div>
  
  <div id="dialog2" role="dialog" aria-labelledby="dialog2_label" aria-describedby="dialog2_desc" aria-modal="true" class="hidden">
    <h2 id="dialog2_label" class="dialog_label">Verification Result</h2>
    <div id="dialog2_desc" class="dialog_desc">
      <p tabindex="-1" id="dialog2_para1">
        This is just a demonstration.
        If it were a real application, it would provide a message telling whether the entered address is valid.
      </p>
      <p>
        For demonstration purposes, this dialog has a lot of text.
        It demonstrates a scenario where:
      </p>
      <ul>
        <li>The first interactive element, the help link, is at the bottom of the dialog.</li>
        <li>If focus is placed on the first interactive element when the dialog opens, the validation message may not be visible.</li>
        <li>If the validation message is visible and the focus is on the help link, then the focus may not be visible.</li>
        <li>
          When the dialog opens, it is important that both:
          <ul>
            <li>The beginning of the text is visible so users do not have to scroll back to start reading.</li>
            <li>The keyboard focus always remains visible.</li>
          </ul>
        </li>
      </ul>
      <p>There are several ways to resolve this issue:</p>
      <ul>
        <li>Place an interactive element at the top of the dialog, e.g., a button or link.</li>
        <li>Make a static element focusable, e.g., the dialog title or the first block of text.</li>
      </ul>
      <p>Please <em>DO NOT </em> make the element with role dialog focusable!</p>
      <ul>
        <li>The larger a focusable element is, the more difficult it is to visually identify the location of focus, especially for users with a narrow field of view.</li>
        <li>The dialog has a visual border, so creating a clear visual indicator of focus when the entire dialog has focus is not very feasible.</li>
        <li>
          Screen readers read the label and content of focusable elements.
          The dialog contains its label and a lot of content! If a dialog like this one has focus, the actual focus is difficult to comprehend.
        </li>
      </ul>
      <p>
        In this dialog, the first paragraph has <code>tabindex=<q>-1</q></code>.
        The first paragraph is also contained inside the element that provides the dialog description, i.e., the element that is referenced by <code>aria-describedby</code>.
        With some screen readers, this may have one negative but relatively insignificant side effect when the dialog opens -- the first paragraph may be announced twice.
        Nonetheless, making the first paragraph focusable and setting the initial focus on it is the most broadly accessible option.
      </p>
    </div>
    <div class="dialog_form_actions">
      <a href="#" onclick="openDialog('dialog4', this)">link to help</a>
      <button type="button" onclick="openDialog('dialog4', this)">accepting an alternative form</button>
      <button type="button" onclick="closeDialog(this)">Close</button>
    </div>
  </div>

  <div id="dialog3" role="dialog" aria-labelledby="dialog3_label" aria-describedby="dialog3_desc" aria-modal="true" class="hidden">
    <h2 id="dialog3_label" class="dialog_label">Address Added</h2>
    <p id="dialog3_desc" class="dialog_desc">
      The address you provided has been added to your list of delivery addresses.
      It is ready for immediate use.
      If you wish to remove it, you can do so from <a href="#" onclick="openDialog('dialog4', this)">your profile.</a>
    </p>
    <div class="dialog_form_actions">
      <button type="button" id="dialog3_close_btn" onclick="closeDialog(this)">OK</button>
    </div>
  </div>

  <div id="dialog4" role="dialog" aria-labelledby="dialog4_label" aria-describedby="dialog4_desc" class="hidden" aria-modal="true">
    <h2 id="dialog4_label" class="dialog_label">End of the Road!</h2>
    <p id="dialog4_desc" class="dialog_desc">You activated a fake link or button that goes nowhere! The link or button is present for demonstration purposes only.</p>
    <div class="dialog_form_actions">
      <button type="button" id="dialog4_close_btn" onclick="closeDialog(this)">Close</button>
    </div>
  </div>
</div>`;

  return () => {
    document.body.innerHTML = "";
  };
}

module.exports = { setupAriaModal };
