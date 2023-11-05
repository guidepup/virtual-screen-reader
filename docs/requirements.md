# Specification Requirements

## WAI-ARIA 1.2

https://www.w3.org/TR/wai-aria-1.2/

### Requirements

#### Conformance

https://www.w3.org/TR/wai-aria-1.2/#conformance

> Normative sections provide requirements that authors, user agents and assistive technologies MUST follow for an implementation to conform to this specification.

#### article

https://www.w3.org/TR/wai-aria-1.2/#article

> Assistive technologies MAY provide a feature allowing the user to navigate the hierarchy of any nested article elements.

#### feed

https://www.w3.org/TR/wai-aria-1.2/#feed

> When an assistive technology reading cursor moves from one article to another, assistive technologies SHOULD set user agent focus on the article that contains the reading cursor.

> If the reading cursor lands on a focusable element inside the article, the assistive technology MAY set focus on that element in lieu of setting focus on the containing article.

#### figure

https://www.w3.org/TR/wai-aria-1.2/#figure

> Assistive technologies SHOULD enable users to quickly navigate to figures. Mainstream user agents MAY enable users to quickly navigate to figures.

#### landmark

https://www.w3.org/TR/wai-aria-1.2/#landmark

> Assistive technologies SHOULD enable users to quickly navigate to landmark regions. Mainstream user agents MAY enable users to quickly navigate to landmark regions.

#### region

https://www.w3.org/TR/wai-aria-1.2/#region

> Assistive technologies SHOULD enable users to quickly navigate to elements with role region. Mainstream user agents MAY enable users to quickly navigate to elements with role region.

#### status

https://www.w3.org/TR/wai-aria-1.2/#status

> Assistive technologies MAY reserve some cells of a Braille display to render the status.

#### Definitions of States and Properties (all aria-\* attributes)

https://www.w3.org/TR/wai-aria-1.2/#state_prop_def

> aria-busy
> Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.

#### aria-atomic

https://www.w3.org/TR/wai-aria-1.2/#aria-atomic

> When aria-atomic is true, assistive technologies MAY choose to combine several changes and present the entire changed region at once.

#### aria-busy

https://www.w3.org/TR/wai-aria-1.2/#aria-busy

> Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.

> The default value of aria-busy is false for all elements. When aria-busy is true for an element, assistive technologies MAY ignore changes to content owned by that element and then process all changes made during the busy period as a single, atomic update when aria-busy becomes false.

> If an element with role feed is marked busy, assistive technologies MAY defer rendering changes that occur inside the feed with the exception of user-initiated changes that occur inside the article that the user is reading during the busy period.

#### aria-flowto

https://www.w3.org/TR/wai-aria-1.2/#aria-flowto

> When aria-flowto has a single ID reference, it allows assistive technologies to, at the user's request, forego normal document reading order and go to the targeted object. However, when aria-flowto is provided with multiple ID references, assistive technologies SHOULD present the referenced elements as path choices.

> In the case of one or more ID references, user agents or assistive technologies SHOULD give the user the option of navigating to any of the targeted elements. The name of the path can be determined by the name of the target element of the aria-flowto attribute. Accessibility APIs can provide named path relationships.

#### aria-haspopup

https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup

> Assistive technologies SHOULD NOT expose the aria-haspopup property if it has a value of false.

#### aria-live

https://www.w3.org/TR/wai-aria-1.2/#aria-live

> User agents or assistive technologies MAY choose to clear queued changes when an assertive change occurs. (e.g., changes in an assertive region may remove all currently queued changes)

> When live regions are marked as polite, assistive technologies SHOULD announce updates at the next graceful opportunity, such as at the end of speaking the current sentence or when the user pauses typing.

> When live regions are marked as assertive, assistive technologies SHOULD notify the user immediately.

#### aria-modal

https://www.w3.org/TR/wai-aria-1.2/#aria-modal

> When a modal element is displayed, assistive technologies SHOULD navigate to the element unless focus has explicitly been set elsewhere.

> Assistive technologies MAY limit navigation to the modal element's contents.

> If focus moves to an element outside the modal element, assistive technologies SHOULD NOT limit navigation to the modal element.

#### aria-roledescription

https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription

> Assistive technologies SHOULD use the value of aria-roledescription when presenting the role of an element, but SHOULD NOT change other functionality based on the role of an element that has a value for aria-roledescription. For example, an assistive technology that provides functions for navigating to the next region or button SHOULD allow those functions to navigate to regions and buttons that have an aria-roledescription.

#### aria-selected

https://www.w3.org/TR/wai-aria-1.2/#aria-selected

> If no DOM element in the widget is explicitly marked as selected, assistive technologies MAY convey implicit selection which follows the keyboard focus of the managed focus widget.

#### aria-valuenow

https://www.w3.org/TR/wai-aria-1.2/#aria-valuenow

> For progressbar elements and scrollbar elements, assistive technologies SHOULD render the value to users as a percent, calculated as a position on the range from aria-valuemin to aria-valuemax if both are defined, otherwise the actual value with a percent indicator.

> For elements with role slider and spinbutton, assistive technologies SHOULD render the actual value to users.

#### aria-valuetext

https://www.w3.org/TR/wai-aria-1.2/#aria-valuetext

> If aria-valuetext is specified, assistive technologies SHOULD render that value instead of the value of aria-valuenow.

## HTML-AAM 1.0

https://www.w3.org/TR/html-aam-1.0/

### Requirements

#### Conformance

https://www.w3.org/TR/html-aam-1.0/#conformance

> Normative sections provide requirements that authors, user agents, and assistive technologies MUST follow for an implementation to conform to this specification.
