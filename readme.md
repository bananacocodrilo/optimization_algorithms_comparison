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

As expected, increasing the span of days affects how long it takes to the branch and cut algorythm to find the optimun solution. This is caused by interpreting each day as a separate restriction.

Interestingly enough the "monster case" is faster to solve than the "lots of days" case. Maybe the longer tasks cause more restrictions to be outside the aceptability space since every variable appears in many restrictions. 


## Next steps

Tweak the numbers for the genetyc algorythm