##REACT
index.js represents current react scoreboard(work in progress)

it is not typical react app because it is loaded into existing game(div with reactRoot id)

if you wish to modify it, run 

`
npx babel --watch scoreboard --out-dir public/scoreboard --presets react-app/prod 
`

and it will transpile reactJSX to the classic JS(transpiled file is imported in index.html)

