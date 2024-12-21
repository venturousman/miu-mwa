[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/sXxskYpC)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=17511000)
### CS572-Homework-09-RAG

Provided is the `movies.json` file, which contains an array of movie name and description `{name: string, description: string}`.
1. Generate Embedding for each movie object `{name: string, description: string, embedding: number[]}`
2. Save the data in Atlas collection
3. Create an Vector Search Index for the collection and `embedding` field
4. Write a function to perform semantic vector search using the aggregation pipeline

Note: You may use `readline` core module to read input from the console:
```typescript
import readline from "node:readline/promises";

const readline_interface = readline.createInterface({ input: process.stdin, output: process.stdout });
const user_answer = await readline_interface.question('What is your name?');
if (user_answer === 'exit') process.exit(0);
```
Alternatively, you may use [readline-sync](https://www.npmjs.com/package/readline-sync).
