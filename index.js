const express = require("express");

const app = express();


require("./startup")(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
