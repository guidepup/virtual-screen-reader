export function setupBasicPage() {
  document.body.innerHTML = `
  <nav>Nav Text</nav>
  <section>
    <h1>Section Heading 1</h1>
    <p>Section Text</p>
    <article>
      <header>
        <h1>Article Header Heading 1</h1>
        <p>Article Header Text</p>
      </header>
      <p>Article Text</p>
    </article> 
  </section>
  <footer>Footer</footer>
  `;
}

export function setupButtonPage() {
  document.body.innerHTML = `<p id="status">Not Clicked</p>`;

  const button = document.createElement("button");

  button.onclick = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById("status")!.innerHTML = "Clicked";
  };

  button.innerHTML = "Click Me";

  document.body.appendChild(button);
}
