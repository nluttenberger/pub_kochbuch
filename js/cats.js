const catNames = [
    'für Gäste',
    'für jeden Tag',
    'für\'s Büffet',
    'für\'s Frühstück',
    'zum Sekt',
    'klein, aber fein',
    'Quiches',
    'orientalisch u asiatisch',
    'italienisch',
    'deutsch',
    'meine Lieblinge'
]
const categories = [
  {catName: 'für Gäste', catColor: '#587291'},
  {catName: 'für jeden Tag', catColor: '#587291'},
  {catName: 'für\'s Büffet', catColor: '#587291'},
  {catName: 'für\'s Frühstück', catColor: '#587291'},
  {catName: 'zum Sekt', catColor: '#fe621d'},
  {catName: 'klein, aber fein', catColor: '#fe621d'},
  {catName: 'Quiches', catColor: '#419d78'},
  {catName: 'orientalisch u asiatisch', catColor: '#565554'},
  {catName: 'italienisch', catColor: '#565554'},
  {catName: 'deutsch', catColor: '#565554'},
  {catName: 'meine Lieblinge', catColor: '#a71d31'}
]
let chapters = [];
let recipesChapterwise = new Map;
let myColl;

function getChapters () {
// create list of chapters
  let url_str;
  apiKey = localStorage.getItem('apiKey');
  hdrs = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': apiKey
  }
  myColl = window.location.hostname;
  console.log (myColl);
  myColl = myColl.substring(0,myColl.indexOf('.'));
  url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents`;
  fetch(url_str,{headers: hdrs})
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      let ix = data.indexOf(data.filter(function(item) {
        return item.path === "recipes_xml"
      })[0])
      let sha = data[ix].sha;
      url_str = `https://api.github.com/repos/nluttenberger/${myColl}/git/trees/${sha}?recursive=true`;
      fetch(url_str,{headers: hdrs})
        .then (resp =>  {
          console.log('Sammlungsindex eingelesen: ', resp.status, resp.statusText);
          return resp.json()
        })
        .then(data => {
          let tree = data.tree;
          tree.sort (function (a, b) {
            return a.path.localeCompare(b.path, 'de-DE-1996')
          });
          // extract chapters
          chapters = tree.filter (item => {
            return (item.type === 'tree')
          }).map (item => item.path);
          for (chapter of chapters) {
            // extract recipes
            let zz = tree.filter (item => {
              return (item.path.substring (0,chapter.length) === chapter && item.path.substring (chapter.length+1,2*chapter.length+1) != chapter && item.type === 'blob')
            }).map (item => item.path.substring(0,item.path.indexOf('.xml')));
            // map recipes to chapters
            recipesChapterwise.set(chapter,zz);
          }
          buildCatForm();
        })
        .catch ((error) => {
          console.log('Error while reading directory listings:', error);
        })
    })
    .catch ((error) => {
      console.log('Error while reading collection sha:', error);
    })
}

function buildCatForm () {
  for (const [chapter,recipes] of recipesChapterwise) {
    // console.log (chapter);
    // console.log (recipes);
    let tabtab = document.getElementById('tabtab');
    let h4El = document.createElement('h4');
    h4El.innerHTML = `<h4>${chapter}</h4>`;
    tabtab.appendChild(h4El);
    for (recipe of recipes) {
      let row = document.querySelector('#formRow');
      let td = row.content.querySelectorAll("td");
      td[0].firstChild.innerHTML = `<a href="/recipes/${recipe}.html">${recipe.substring(chapter.length+1)}</a>`;
      for (let i=1;i<td.length;i++) {
        td[i].firstChild.value = recipe;
        td[i].firstChild.name = catNames[i-1];
      }
      // clone row and insert into table
      let tab = document.getElementById("tabtab");
      let clone = document.importNode(row.content, true);
      tab.appendChild(clone);
    }
  }
}

function saveCatAssignments() {
  let text = '<?xml version="1.0" encoding="UTF-8"?> \n' +
    '<!DOCTYPE stylesheet SYSTEM "file:///C:/Users/nlutt/Documents/Websites/tools/entities.dtd">\n' +
    '<cat:assignments \n' +
    '    xmlns:cat="http://fruschtique.de/ns/recipe-cat" \n' +
    '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n' +
    '    xsi:schemaLocation= "http://fruschtique.de/ns/recipe-cat ../../tools/cat-assign.xsd"> \n' +
    '</cat:assignments>';
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(text, "application/xml");
  for (category of categories) {
    let assignment = document.createElementNS("http://fruschtique.de/ns/recipe-cat",'assignment');
    let cat = document.createElementNS("http://fruschtique.de/ns/recipe-cat",'cat');
    let rcps = document.createElementNS("http://fruschtique.de/ns/recipe-cat",'recipes');
    let color = document.createElementNS("http://fruschtique.de/ns/recipe-cat",'color');
    cat.textContent = category.catName;
    assignment.appendChild(cat);
    const checked = Array.from (document.querySelectorAll(`input[name="${category.catName}"]:checked`)).map(item=>item.value);
    rcps.textContent = checked;
    assignment.appendChild(rcps);
    color.textContent = category.catColor;
    assignment.appendChild(color);
    xmlDoc.documentElement.appendChild (assignment);
  }
  let xmlText = new XMLSerializer().serializeToString(xmlDoc);
  console.log (xmlText)
}