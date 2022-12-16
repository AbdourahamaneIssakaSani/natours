const express = require("express");
const PORT = 9000;

const app = express();

app.listen(PORT, () => {
    console.log(`App running at ${PORT}`); // eslint-disable-line
});