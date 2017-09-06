const express = require('express');
const cors = require('cors');
const vm = require('vm');
const assert = require('assert');
const bodyParser = require('body-parser');

const corsOptions = {
  origin: 'http://localhost'
};

const PORT = process.env.PATH_PORT || 8080;
const TIMEOUT = process.env.PATH_TIMEOUT || 2000;
const app = express();

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.post('/submit', (req, res) => {
  const box = vm.createContext();
  const errors = [];
  const header = req.body.header || '';
  const code = req.body.code || '';
  const testCases = req.body.test_cases || [];
  try {
    vm.runInContext(header, box, { timeout: TIMEOUT });
    vm.runInContext(code, box, { timeout: TIMEOUT });
  } catch (e) {
    res.json({
      is_correct: false,
      is_error: true,
      message: `An exception occured when evaluating the program\n${e.toString()}`
    });
    return;
  }
  for (const testCase of testCases) {
    const result = vm.runInContext(expression, box, { timeout: TIMEOUT });
    try {
      assert.deepEqual(result, expected);
    } catch (e) {
      errors.push(testCase);
    }
  }
  const isCorrect = errors.length === 0;
  const message = isCorrect
    ? 'Your solution passed all test cases'
    : 'Your solution failed on some test cases';
  res.json({
    is_correct: isCorrect,
    is_error: false,
    message: message,
    errors: errors
  });
});

app.listen(PORT);
