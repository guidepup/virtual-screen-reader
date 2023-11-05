import { virtual } from "../../..";

/**
 * https://github.com/web-platform-tests/wpt/blob/master/html-aam/table-roles.html
 */

describe("HTML-AAM Table Role Verification Tests", () => {
  beforeEach(async () => {
    document.body.innerHTML = `
    <table data-testname="el-table" data-expectedrole="table" class="ex">
      <caption data-testname="el-caption" data-expectedrole="caption" class="ex">caption</caption>
      <thead data-testname="el-thead" data-expectedrole="rowgroup" class="ex">
        <tr data-testname="el-tr-thead" data-expectedrole="row" class="ex">
          <th data-testname="el-th" data-expectedrole="columnheader" class="ex">a</th>
          <th>b</th>
          <th>c</th>
        </tr>
      </thead>
      <tbody data-testname="el-tbody" data-expectedrole="rowgroup" class="ex">
        <tr data-testname="el-tr-tbody" data-expectedrole="row" class="ex">
          <th data-testname="el-th-in-row" data-expectedrole="rowheader" class="ex">1</th>
          <td data-testname="el-td" data-expectedrole="cell" class="ex">2</td>
          <td>3</td>
        </tr>
        <tr>
          <th>4</th>
          <td>5</td>
          <td>6</td>
        </tr>
      </tbody>
      <tfoot data-testname="el-tfoot" data-expectedrole="rowgroup" class="ex">
        <tr>
          <th>x</th>
          <th>y</th>
          <th>z</th>
        </tr>
      </tfoot>
    </table>
    `;

    await virtual.start({ container: document.body });

    while ((await virtual.lastSpokenPhrase()) !== "end of document") {
      await virtual.next();
    }
  });

  afterEach(async () => {
    await virtual.stop();

    document.body.innerHTML = "";
  });

  test("verifies roles", async () => {
    expect(await virtual.spokenPhraseLog()).toEqual([
      "document",
      "table, caption",
      "caption",
      "rowgroup",
      "row, a b c",
      "columnheader, a",
      "columnheader, b",
      "columnheader, c",
      "end of row, a b c",
      "end of rowgroup",
      "rowgroup",
      "row, 1 2 3",
      "columnheader, 1",
      "cell, 2",
      "cell, 3",
      "end of row, 1 2 3",
      "row, 4 5 6",
      "columnheader, 4",
      "cell, 5",
      "cell, 6",
      "end of row, 4 5 6",
      "end of rowgroup",
      "rowgroup",
      "row, x y z",
      "columnheader, x",
      "columnheader, y",
      "columnheader, z",
      "end of row, x y z",
      "end of rowgroup",
      "end of table, caption",
      "end of document",
    ]);
  });
});
