[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/HIG9QhG6)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=17417264)
### CS572-Homework-05-Services
### Exercise
1. Refactor yesterday's code and create a service layer that sends an actual HTTP Get request to `https://dummyjson.com/recipes?limit=4&skip=0` and display 4 recipes at a time. Practice working with the HTTP stream:
   * Consume the Observable with `.subscribe()`
   * Consume the Observable with `AsyncPipe`
   * Convert the Observable to a Signal
2. Create an `effect` that reacts to the current pagination index and change the page title to show: `Showing page {current} of {total}`. Use the `Title` service to set the page. 
