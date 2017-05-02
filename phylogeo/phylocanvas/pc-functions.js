<!--
function loadPredefinedTree() {
	var defaultTree = '(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;'
	const tree = Phylocanvas.createTree('phylocanvas'); // see API for config options
    tree.load(defaultTree);
	return tree;
}

function selectme(event) {
	var x = event.which || event.keyCode;
	var y = String.fromCharCode(x);
	if (typeof tree.branches[y] !== 'undefined') {
		tree.branches[y].selected = !tree.branches[y].selected;
		tree.draw();
	}
}

function showmeatdata() {

	mapSource = {'Care facility': 'rgb(255, 0, 0)','School': 'rgb(0, 255, 0)','The Frying Dutchman':'rgb(0, 0, 255)'};

	tree.leaves['0']['data'] = {'Source': 'Care facility'};
	tree.leaves['1']['data'] = {'Source': 'School'};
	tree.leaves['2']['data'] = {'Source': 'School'};
	tree.leaves['3']['data'] = {'Source': 'The Frying Dutchman'};
	
	//alert(mapSource[tree.leaves['0']['data']['Source']]);
	
	for(count = 0; count < 4; count++) {
		var theStyle = mapSource[tree.leaves[count]['data']['Source']];
		tree.leaves[count].setDisplay({ size: 20, leafStyle: { fillStyle: theStyle, lineWidth: 2, },});
	}
	
	tree.draw();
}
/*	
	tree.viewMetadataColumns(); // Display columns
//	tree.active = !tree.active;
	tree.draw();
//	alert(tree.active);
*/
