// keep in mind: img and thumbs pathes don't include chapter info
const basePathThumbs = 'https://storage.googleapis.com/testx.fruschtique.de/thumbs/';
const basePathImg = 'https://storage.googleapis.com/testx.fruschtique.de/img/';
const basePathRecipes;
let i = 0;
let innerCarousel = document.getElementById('inner');
// get image
function fetchResource(recipeName) {
	let path2Thumb = basePathThumbs;
	path2Thumb += recipeName.substring(recipeName.indexOf('/') + 1);
	path2Thumb += '.jpg';
	console.log (path2Thumb);
	fetch(path2Thumb, {
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
			buildCarousel(i++, recipeName, imgUrl);
	})
		.catch(function (err) {
			console.log (err);
	})
}
// add image to carousel
function buildCarousel(i, recipeName, imgUrl) {
	const imgDiv = document.createElement('div');
	imgDiv.className = 'item';
	const linkEl = document.createElement('a');
	linkEl.href = basePathRecipes + recipeName + '.html';
	linkEl.target = '_blank';
	const imageEl = document.createElement('img');
	imageEl.src = imgUrl;
	linkEl.appendChild(imageEl);
	imgDiv.appendChild(linkEl);
	innerCarousel.appendChild(imgDiv);
	if (i === 0) {
		imgDiv.classList.add('active')
	}
}
// start here onload
apiKey = localStorage.getItem('apiKey');
hdrs = {
	'Accept': 'application/vnd.github.v3+json',
	'Authorization': apiKey
}
// create list of recipes
let myColl;
myColl = window.location.hostname;
basePathRecipes = `${myColl}/recipes`;
myColl = myColl.substring(0,myColl.indexOf('.'));
let url_str;
url_str = `https://api.github.com/repos/nluttenberger/${myColl}/contents`;
fetch(url_str, {
	headers: hdrs
}).then(resp => {
	return resp.json();
}).then(data => {
	let ix = data.indexOf(data.filter(function (item) {
		return item.path === "recipes_xml"
	})[0])
	let sha = data[ix].sha;
	url_str = `https://api.github.com/repos/nluttenberger/${myColl}/git/trees/${sha}?recursive=true`;
	fetch(url_str, {
		headers: hdrs
	}).then(resp => {
		console.log('Sammlungsindex eingelesen: ', resp.status, resp.statusText);
		return resp.json()
	}).then(data => {
		let tree = data.tree;
		tree.sort(function (a, b) {
			return a.path.localeCompare(b.path, 'de-DE-1996')
		});
		let recp;
		let re = /^\d\d /;
		for (let entry of tree) {
			recp = entry.path;
			recp = recp.substring(0, recp.indexOf('.xml'));
			let xx = recp.substring(recp.indexOf('/')+1);
			if (recp.length > 0 && xx.match(re)===null) {
				fetchResource(recp);
			}
		}
	}).catch((error) => {
		console.log('Error while reading directory listings:', error);
	})
}).catch((error) => {
	console.log('Error while reading collection sha:', error);
})

