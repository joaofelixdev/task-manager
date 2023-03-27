import { parse } from 'csv-parse';
import fs from 'node:fs'

(async() => {
  const readableStream = fs.createReadStream('./tasks.csv')
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    // .on('data', function (row) {
    //   submitTask(row)
    // })

    for await (const row of readableStream) {
      submitTask(row)
    }
})();

function submitTask(data) {

  const [ title, description ] = [...data]
  const requestBody = { title, description }

  fetch('http://localhost:3333/tasks', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(requestBody)
  })
  .then((res) => console.log(`Upload realizado, status code ${res.status}`))
  .catch((res) => console.log(`Erro ao realizar upload da task ${title}`))
}