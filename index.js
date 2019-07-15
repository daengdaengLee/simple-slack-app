/* eslint-disable no-console */

const https = require("https");
const express = require("express");

const app = express();
const port = process.env.PORT || 4356;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World"));

app.post("/slack/daengdaenglee", (req, res) => {
  const { command, text, response_url: responseUrl } = req.body;

  if (command !== "/daengdaenglee") {
    res.status(400).end();
    return;
  }

  res.status(200).end();

  if (text.startsWith("echo")) {
    const str = text.replace(/^echo/, "");
    console.log(`[echo][request ${responseUrl}] ${str}`);
    const body = JSON.stringify({ text: str });
    const responseToSlack = https.request(
      responseUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      ({ statusCode }) => {
        if (statusCode === 200)
          console.log(`[echo][response ${statusCode}] success to echo ${str}`);
        else
          console.log(`[echo][response ${statusCode}] failed to echo ${str}`);
      }
    );
    responseToSlack.on("error", error =>
      console.log(
        `[echo][response error] failed to echo ${str} with error : `,
        error
      )
    );
    responseToSlack.write(body);
    responseToSlack.end();
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
