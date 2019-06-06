# My solution to QWIC's test.

My solution to QWIC's selection proccess test.

## Basic usage:

First installing dependencies:

`$ npm install`

After that building the project:

`$ npm run tsc:build`

Now you can solve a problem like this:

`$ node dist/main.js --simple=f --file=data/manyDays.json`

Use the `--file` flag to specify the file containing the data for the problem.

By default it will solve the problem by branch and cut. If the `--simple` flag is set to false it will solve the problem by brute force too and then compare results.



## Tests:

Inside the data folder there is a script `simpleGenerator.js` that generates random customized statements.

I've included a few tests that can be executed with 

`$ npm run test`

As expected, increasing the span of days affects how long it takes to the branch and cut algorithm to find the optimun solution. This is caused by interpreting each day as a separate restriction.

Interestingly enough the "monster case" is faster to solve than the "lots of days" case. Maybe the longer tasks cause more restrictions to be outside the aceptability space since every variable appears in many restrictions. 


## Genetic algorithm
I hadnt found a good way to compare the three of them at the same time yet.

If there are too many tasks the brute force will take too long, if there are too few the genetic algorithm finds the solution too fast.

I've managed to get some interesting results with `manyTasks.json`. Like this one:

```
Improvement in gen 0; currentBest: 37
Improvement in gen 44; currentBest: 38
Improvement in gen 105; currentBest: 39
Improvement in gen 131; currentBest: 40
Improvement in gen 191; currentBest: 41
Improvement in gen 244; currentBest: 42
Improvement in gen 250; currentBest: 43
Improvement in gen 301; currentBest: 44

Maximum viable production is 45 units   
Gen algorithm result is 44 units
About to brute force 2.037035976334486e+90 combinations, this may take a while (under 4.243824950696846e+82 minutes)
```

I think is good enough to ilustrate the differences between:
 - Branch and cut: An algorithm designed for this exact problem. Always finds the best solution in under 50 ms.
 - Genetic algorithm: A more general algorithm that can be used to many different situations. Finds a pretty good solution (this one was running for about 500ms).
 - Brute force: Depends heavily on the input. Thanks to separating the data into subproblems, it has been viable in many cases, but is easy to go from miliseconds to years.



The genetic algorithm can be executed adding this piece of code in the main file: 
```
problems.forEach(problem => {
    const solver = new GenAlgSolver(problem);
    const sol = solver.solve();
    console.log(`ga: ${sol}`);
    
    gaResult += sol;
    
});
```    