import all from "./chicagoNeighbourhoods";
let i = 4;
const sel = [];
const getIndex = () => {
  const random = Math.random() * all.length
  return Math.floor(random)
}

while (i--) {
  sel.push(all[getIndex()]);
}

<h3>Here are {{ sel.length }} hoods</h3>
<ul><li v-for="a in sel">{{ a }}</li></ul>
