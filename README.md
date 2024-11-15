# Ski Game TDD

## Description

A simple browser based game where the player has to go down a ski slope avoiding obstacles.  
I have built it mainly to learn browser Canvas and TDD'ing videogames.

## How to play

- Go to the [game](https://erikologic.github.io/ski-game-tdd/).  
- Use the arrow keys to move the skier.  
- Avoid rocks and trees.
- Use space to jump over rocks.  
- Eventually Rhino will eat you - try to survive as long as possible!

## How to run locally

- Clone the repo
- Run `npm install`
- Run `npm run dev` to start the development server
- Open `http://localhost:8080/` in your browser.  
- Run `npm run test` to run the tests.

## How to develop

I extensively used TDD to develop the game, although not as much as I'd like.  
It should be easy to expand features by adding a new test first.  

## What I do like

I was curious to learn about HTML Canvas and TDD a game in that environment.  
I think overall it is a success.  

I focused much on leveraging that TDD approach working out a [Player](./src/Entity/Player.ts) code that is easy to read and extend, because:

- each player state is a class,
- each player state class well encapsulate behaviours for that particular state,
- behaviours are reusable across states.

I generally tried to follow this approach of testing behaviours from the outside, although in some case I tested small units of code to explain complex algorithms.

During the journey of this project, I learned so much about Canvas - that was fun!

## What I don't like

I started spiking some code and converted that into the solution.  
I usually treat spike code as throwaway, but in this case I was so lost initially trying to get this "TDD a game" thing that I ended up keeping some of that.

I could have used some more documenting.
I general try to leverage code and test rather than comments, but I can see few places where adding some comments would have clarified.

I have left few magic numbers here and there.  
I could have extracted those into constants or tweakable properties.

There is plenty of refactor to do, but I think the code is good enough for now to demonstrate the overall idea of "you can TDD a videogame".
