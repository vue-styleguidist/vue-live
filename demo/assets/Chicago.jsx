import all from "chicagoNeighbourhoods";
let i = 4;
const four = [];
while (i--) {
  let indexInList = Math.floor(Math.random() * all.length);
  four.push(all[indexInList]);
}

<h3>What Chicago do you wish to visit tonight?</h3>
<ul><li v-for="a in four">{{ a }}</li></ul>
