const { readFileSync } = require("fs");

try {

    const code = readFileSync("/app/usercode.js", "utf8");


    const result = eval(code);
    console.log(result);
} catch (err) {
    console.error("Error:", err.message);
}
