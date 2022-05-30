const basePathThumbs = 'https://storage.googleapis.com/testx.fruschtique.de/thumbs/';
const basePathImg = 'https://storage.googleapis.com/testx.fruschtique.de/img/';
let basePathRecipes;
let i = 0;
let innerCarousel = document.getElementById('inner');

// get image
function fetchResource(recipe) {
	let path2Img = basePathImg;
	let rcpName = recipe.substring(recipe.indexOf('/') + 1);
	path2Img += rcpName;
	path2Img += '.jpg';
	fetch(path2Img, {
		cache: "no-store"
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Could not read image');
			}
			return response.blob()
		})
		.then((resp) => {
			const imgUrl = URL.createObjectURL(resp);
			buildCarousel(i++, recipe, imgUrl);
	})
		.catch(function (err) {
			console.log (err);
	})
}
// add image to carousel
function buildCarousel(i,recipe,imgUrl) {
	const imgDiv = document.createElement('div');
	imgDiv.className = 'item';
	const linkEl = document.createElement('a');
	linkEl.href = basePathRecipes + recipe + '.html';
	linkEl.target = '_blank';
	const imageEl = document.createElement('img');
	imageEl.src = imgUrl;
	linkEl.appendChild(imageEl);
	imgDiv.appendChild(linkEl);
	const captionDiv = document.createElement('div');
	captionDiv.className = 'carousel-caption';
	const caption = document.createElement ('h3');
	caption.textContent = recipe.substring(recipe.indexOf('/') + 1);
	captionDiv.appendChild(caption);
	imgDiv.appendChild(captionDiv);
	innerCarousel.appendChild(imgDiv);
	if (i === 0) {
		imgDiv.classList.add('active')
	}
}
// keep in mind: img and thumbs paths don't need chapter info
let myCat;
myCat = window.location.pathname;
myCat = myCat.substring(myCat.indexOf('cat')-3,myCat.indexOf('cat')+5);
console.log (myCat);
//myCat = myCat.substring(0,myCat.indexOf('.html'))
//console.log (myCat);
let oLength = document.getElementById(myCat).options.length;
let rcpArr = [];
for (let i=0;i<oLength;i++) {
	rcpArr.push (document.getElementById(myCat).options[i].value);
}
// set links to recipes and get recipe images
let x;
let myBase = window.location.origin;
let myColl;
myColl = window.location.hostname;
basePathRecipes = 'recipes/';
for (let rcp of rcpArr) {
	let rcpName = rcp.substring(rcp.indexOf('/') + 1);
	x = `<li><a href="${myBase}/recipes/${rcp}.html" target="_blank"> ${rcpName}</a></li>`;
	$('#catRcpList').append(x);
	fetchResource(rcp);
}
