(function() {

//Initialize variables
	var scale = 6
		,svgNS = 'http://www.w3.org/2000/svg'
		,layer1 = document.getElementById('layer1')
		,selBead = false
		,selButton = false
		,checkBeads = []
		,verticalBeads = {}
		,beads = {}
		,indexCounter = 0
		,debug = true;

	function init() {

    var abacus = document.getElementById("abacus");

		/* Create vertical rods */
		for (var i = 1; i <= 4; i += 1) {
			createRod(i * 25, 0, i * 25, 70);
		}

		/* Create horizontal rod */
		createRod(0, 20, 120, 20);
		
		/* put a dot on the ONES COLUMN of the abacus */
		createDot(100,20); // x and y coords of dot
	
		/* Create upper beads */
// 		for (var i = 0; i < 4; i += 1) {
// 			createBead(25 + 25 * i, 5, i, true, true);
// 		}
			var upper = new Array();
			upper[1] = createBead(25 + 25 * 0, 5, 0, true, true);
			upper[2] = createBead(25 + 25 * 1, 5, 1, true, true);
			upper[3] = createBead(25 + 25 * 2, 5, 2, true, true);
			upper[4] = createBead(25 + 25 * 3, 5, 3, true, true);
			

// Create lower beads
		var lower = new Array();
		lower[0] = new Array();
		lower[1] = new Array();
		lower[2] = new Array();
		lower[3] = new Array();
		
		for (var i = 0; i < 4; i += 1) {
			for (var j = 0; j < 4; j += 1) {
				lower[i][j] = createBead(25 + i * 25, /* x location: 25 + gap of 25 between each column */
				40 + (j * 9), /* y location: 35 for first bead, 40 for second, etc*/
				i, /* Row */ 
				j,
				false, /*is upper */ 
				j === 0); /* is checkbead.. so this comes out as no except if j=0 (first bead). 
				not sure what checkbead does, seems to work the same even when I make this "true"*/
			}
		}
// Create some buttons
		var button = new Array();
		button[0] = new Array();
		button[1] = new Array();
		button[2] = new Array();
		button[3] = new Array();
		button[4] = new Array();

		for (var i = 0; i < 4; i += 1) {
			for (var j = 0; j < 5; j +=1){
			button[i][j] = createButton(25 + 25 * i, 75 + 9*j, i, j);
		}
		}
		// write +5 on a bead	
		var sign = new Array();
		sign[0] = new Array();
		sign[1] = new Array();
		sign[2] = new Array();
		sign[3] = new Array();
		
// 		for (var i = 0; i < 4; i += 1) {
// 			for (var j = 0; j < 5; j +=1){
// 			sign[i][j] = createText(20 + 25*i, 81 + 9*j, "+",i,j);
// 		}
// 		}
		
		for (var i = 0; i < 4; i += 1) {
			for (var j = 1; j < 6; j += 1){
			if (j === 1) var value = 5
			else var value = j-1
			sign[i][j] = createText(20 + 25 * i, 81 + 9 * (j-1), "+" + value,i,j);
// 			alert(sign[i][j].textContent)
		}
		}	
		
		
		

		
// Touchscreen controls		
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {

      abacus.addEventListener('touchstart', function(e) {
        e.preventDefault(); 
        if (e.touches.length > 0) {
		  for (var i = 0; i < e.touches.length; i++){
		  touch[i] = e.touches[i];
          node[i] = touch[i].target; //SVG ellipse element
          if (node[i] && node[i].tagName && node[i].tagName === 'rect') {
            selButton[i] = node[i];         
            selButton[i].setAttribute('fill', 'white');

          }
        }
        }
      });
      
      abacus.addEventListener('touchend', function(e) {
        if (e.touches.length == 0) {
        	selSign[i] = sign[selButton[i]._row][selButton[i].column+1]
//START FROM LINE 144
        }
      });
      
 abacus.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (selBead && e.touches.length > 0) {
			for (var i = 0; i < e.touches.length; i++){
			touch[i] = e.touches[i];
          setY(selBead[i], touch[i].pageY / scale);
          }
        }
      });

    } else {
//Mouse Controls
      abacus.addEventListener('mousedown', function(e) {
        if (e.target && e.target.tagName && e.target.tagName === 'rect') {
          selButton = e.target;
          selButton.setAttribute('fill', 'white');
          }
      });

      abacus.addEventListener('mouseup', function(e) {
      selSign = sign[selButton._row][selButton.column+1]
//       alert(selSign.textContent)
        if(selSign.textContent == "+5"){//top row, add 5
        	selBead = upper[selButton._row+1];
     		setY(selBead, 15); 
     		selButton.setAttribute('fill','orange');
        	selSign.textContent = "-5";
        	}
        else if(selSign.textContent == "-5"){//top row, add 5
        	selBead = upper[selButton._row+1];
     		setY(selBead, 5); 
     		selButton.setAttribute('fill','green');
        	selSign.textContent = "+5";
        	}
        else if(selSign.textContent == "+1"){//lower row, add 1
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 25 + (selBead.column * 9), 'up');
        	selButton.setAttribute('fill','orange');
        	selSign.textContent = "-1";
			
			if(sign[selButton._row][selButton.column-1]){
        	sign[selButton._row][selButton.column].textContent = "-2";
        	}
        	if(sign[selButton._row][selButton.column-2]){
        	sign[selButton._row][selButton.column-1].textContent = "-3";
        	}
        	if(sign[selButton._row][selButton.column-3]){
        	sign[selButton._row][selButton.column-2].textContent = "-4";
        	}
        	if(sign[selButton._row][selButton.column+2]){
        	sign[selButton._row][selButton.column+2].textContent = "+1";
        	}
        	if(sign[selButton._row][selButton.column+3]){
        	sign[selButton._row][selButton.column+3].textContent = "+2";
        	}
        	if(sign[selButton._row][selButton.column+4]){
        	sign[selButton._row][selButton.column+4].textContent = "+3";
        	}
        	}
        	// 
        else if(selSign.textContent == "-1"){//lower row, add 1
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','green');
        	selSign.textContent = "+1";
        	
        	if(sign[selButton._row][selButton.column-1]){ //a bead above (other than the 5s bead)
        	sign[selButton._row][selButton.column].textContent = "-1";
        	}
        	if(sign[selButton._row][selButton.column-2]){
        	sign[selButton._row][selButton.column-1].textContent = "-2";
        	}
        	if(sign[selButton._row][selButton.column-3]){
        	sign[selButton._row][selButton.column-2].textContent = "-3";
        	}
        	if(sign[selButton._row][selButton.column+2]){
        	sign[selButton._row][selButton.column+2].textContent = "+2";
        	}
        	if(sign[selButton._row][selButton.column+3]){
        	sign[selButton._row][selButton.column+3].textContent = "+3";
        	}
        	if(sign[selButton._row][selButton.column+4]){
        	sign[selButton._row][selButton.column+4].textContent = "+4";
        	}
        	}
        	
        	else if(selSign.textContent == "+2"){//lower row, add 1
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','orange');
        	selSign.textContent = "-1";
        	
        	if(sign[selButton._row][selButton.column-1]){ //a bead above (other than the 5s bead)
        	sign[selButton._row][selButton.column].textContent = "-2";
        	button[selButton._row][selButton.column-1].setAttribute('fill','orange')
        	}
        	if(sign[selButton._row][selButton.column-2]){ // 2 beads above
        	sign[selButton._row][selButton.column-1].textContent = "-3";
        	}
        	if(sign[selButton._row][selButton.column-3]){ //3 beads above
        	sign[selButton._row][selButton.column-2].textContent = "-4";
        	}
        	if(sign[selButton._row][selButton.column+2]){// 1 bead below
        	sign[selButton._row][selButton.column+2].textContent = "+1";
        	}
        	if(sign[selButton._row][selButton.column+3]){
        	sign[selButton._row][selButton.column+3].textContent = "+2";
        	}
        	if(sign[selButton._row][selButton.column+4]){
        	sign[selButton._row][selButton.column+4].textContent = "+3";
        	}
        	}
        	
        	else if(selSign.textContent == "-2"){//lower row, subtract 2
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','green');
        	selSign.textContent = "+1";
        	
        	if(sign[selButton._row][selButton.column-1]){ //a bead above (other than the 5s bead)
        	sign[selButton._row][selButton.column].textContent = "-1";
        	}
        	if(sign[selButton._row][selButton.column-2]){
        	sign[selButton._row][selButton.column-1].textContent = "-2";
        	}
        	if(sign[selButton._row][selButton.column-3]){
        	sign[selButton._row][selButton.column-2].textContent = "-3";
        	}
        	if(sign[selButton._row][selButton.column+2]){
        	sign[selButton._row][selButton.column+2].textContent = "+2";
        	button[selButton._row][selButton.column+1].setAttribute('fill','green')
        	}
        	if(sign[selButton._row][selButton.column+3]){
        	sign[selButton._row][selButton.column+3].textContent = "+3";
        	}
        	if(sign[selButton._row][selButton.column+4]){
        	sign[selButton._row][selButton.column+4].textContent = "+4";
        	}
        	}
        	
        	else if(selSign.textContent == "+3"){//lower row, add 3
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','orange');
        	selSign.textContent = "-1";
        	
        	if(sign[selButton._row][selButton.column-1]){ //a bead above (other than the 5s bead)
        	sign[selButton._row][selButton.column].textContent = "-2";
        	button[selButton._row][selButton.column-1].setAttribute('fill','orange')
        	}
        	if(sign[selButton._row][selButton.column-2]){ // 2 beads above
        	sign[selButton._row][selButton.column-1].textContent = "-3";
        	button[selButton._row][selButton.column-2].setAttribute('fill','orange')
        	}
        	if(sign[selButton._row][selButton.column-3]){ //3 beads above
        	sign[selButton._row][selButton.column-2].textContent = "-4";
        	button[selButton._row][selButton.column-3].setAttribute('fill','orange')
        	}
        	if(sign[selButton._row][selButton.column+2]){// 1 bead below
        	sign[selButton._row][selButton.column+2].textContent = "+1";
        	button[selButton._row][selButton.column+1].setAttribute('fill','green')
        	}
        	if(sign[selButton._row][selButton.column+3]){
        	sign[selButton._row][selButton.column+3].textContent = "+2";
        	button[selButton._row][selButton.column+2].setAttribute('fill','green')
        	}
        	if(sign[selButton._row][selButton.column+4]){
        	sign[selButton._row][selButton.column+4].textContent = "+3";
        	button[selButton._row][selButton.column+3].setAttribute('fill','green')
        	}
        	}
        	
        	else if(selSign.textContent == "-3"){//lower row, subtract 3
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','green');
        	selSign.textContent = "+1";
        	
        	if(sign[selButton._row][selButton.column-1]){ //a bead above (other than the 5s bead)
        	sign[selButton._row][selButton.column].textContent = "-1";
        	}
        	if(sign[selButton._row][selButton.column-2]){
        	sign[selButton._row][selButton.column-1].textContent = "-2";
        	}
        	if(sign[selButton._row][selButton.column-3]){
        	sign[selButton._row][selButton.column-2].textContent = "-3";
        	}
        	if(sign[selButton._row][selButton.column+2]){
        	sign[selButton._row][selButton.column+2].textContent = "+2";
        	button[selButton._row][selButton.column+1].setAttribute('fill','green')
        	}
        	if(sign[selButton._row][selButton.column+3]){
        	sign[selButton._row][selButton.column+3].textContent = "+3";
        	button[selButton._row][selButton.column+2].setAttribute('fill','green')
        	}
        	if(sign[selButton._row][selButton.column+4]){
        	sign[selButton._row][selButton.column+4].textContent = "+4";
        	button[selButton._row][selButton.column+3].setAttribute('fill','green')
        	}
        	}
        	
        	else if(selSign.textContent == "+4"){//lower row, add 3
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','orange');
        	selSign.textContent = "-1";
        	
        	if(sign[selButton._row][selButton.column-1]){ //a bead above (other than the 5s bead)
        	sign[selButton._row][selButton.column].textContent = "-2";
        	button[selButton._row][selButton.column-1].setAttribute('fill','orange')
        	}
        	if(sign[selButton._row][selButton.column-2]){ // 2 beads above
        	sign[selButton._row][selButton.column-1].textContent = "-3";
        	button[selButton._row][selButton.column-2].setAttribute('fill','orange')
        	}
        	if(sign[selButton._row][selButton.column-3]){ //3 beads above
        	sign[selButton._row][selButton.column-2].textContent = "-4";
        	button[selButton._row][selButton.column-3].setAttribute('fill','orange')
        	}
        	}
        	
        	else if(selSign.textContent == "-4"){//lower row, subtract 3
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','green');
        	selSign.textContent = "+1";
        	
			if(sign[selButton._row][selButton.column+2]){
        	sign[selButton._row][selButton.column+2].textContent = "+2";
        	button[selButton._row][selButton.column+1].setAttribute('fill','green')
        	}
        	if(sign[selButton._row][selButton.column+3]){
        	sign[selButton._row][selButton.column+3].textContent = "+3";
        	button[selButton._row][selButton.column+2].setAttribute('fill','green')
        	}
        	if(sign[selButton._row][selButton.column+4]){
        	sign[selButton._row][selButton.column+4].textContent = "+4";
        	button[selButton._row][selButton.column+3].setAttribute('fill','green')
        	}
        	}
        	
        	

       	else{
        	return
//         		setY(selBead, 5);
//         		selButton.setAttribute('fill','green');
// //         		selSign.textContent = "+";
        	}
//         }
//         else if(sign[selButton._row][selButton.column].textContent == "+1"){ // FOR + 1: move bead corresponding to button up
// 			selBead = lower[selButton._row][selButton.column-1];
// 			setY(selBead, 25 + (selBead.column * 9), 'up');
// 			}
//         				
//         
//         	selBead = lower[selButton._row][selButton.column-1];
//         	selSign = sign[selButton._row][selButton.column];
//         	if(selBead.cy.baseVal.value < 39 + (selBead.column * 9)){
//         		setY(selBead, 40 + (selBead.column * 9), 'down'); 
//         		selButton.setAttribute('fill','green');
//         		selSign.textContent = "+";
//         	}
//         	else{
//         		setY(selBead, 25 + (selBead.column * 9), 'up');
// 				selButton.setAttribute('fill','orange'); // 
//         		selSign.textContent = "-";
//         	}
//         }
        selBead = false;
        selButton = false;
        selSign = false;
      });

      abacus.addEventListener('mousemove', function(e) {
        if (selBead) {
          setY(selBead, e.clientY / scale); 
        }
      });
    }

	}
//Auxiliary functions
	function createRod(x1, y1, x2, y2)
	{
		var el = document.createElementNS(svgNS, 'line');
		el.x1.baseVal.value = x1;
		el.y1.baseVal.value = y1;
		el.x2.baseVal.value = x2;
		el.y2.baseVal.value = y2;
		el.setAttribute('class', 'rod');
		// el.setAttribute('stroke', '#777');
		// el.setAttribute('stroke-width', .5);
		layer1.appendChild(el);
	}
	
		function createDot(x1, y1)
	{
		var el = document.createElementNS(svgNS, 'ellipse');
		el.cx.baseVal.value = x1;
		el.cy.baseVal.value = y1;
		el.rx.baseVal.value = 1;
		el.ry.baseVal.value = 1;
		el.setAttribute('class', 'dot');
		// el.setAttribute('stroke', '#777');
		// el.setAttribute('stroke-width', .5);
		layer1.appendChild(el);
	}
	
		function createButton(x1, y1, row, column)
		{
		var el = document.createElementNS(svgNS, 'rect');
		el.x.baseVal.value = x1-10;
		el.y.baseVal.value = y1;
		el.width.baseVal.value = 20;
		el.height.baseVal.value = 7;
		el.setAttribute('class', 'button');
		el._row = row;
		el.column = column;
		el.setAttribute('fill','green');
		// el.setAttribute('stroke', '#777');
		// el.setAttribute('stroke-width', .5);
		layer1.appendChild(el);
		return el;
	}

	function createBead(x, y, row, column, isUpper, isCheckBead)
	{
		var el = document.createElementNS(svgNS, 'ellipse');
		el.cx.baseVal.value = x;
		el.cy.baseVal.value = y;
		el.rx.baseVal.value = 10; // Bead is 10 wide
		el.ry.baseVal.value = 4; // and 4 tall
		el.setAttribute('class', 'bead');
		el._index = indexCounter++;
		el._row = row;
		el.column = column;
		el._isCheckBead = isCheckBead;
		el._isUpper = isUpper;
		el.isIn = 0;
		layer1.appendChild(el);
		if (!beads.hasOwnProperty(x)) { //??
			beads[x] = [];
		}
		beads[x].push(el);
		if (isCheckBead === true) {
			checkBeads.push(el);
		}
		if (!verticalBeads.hasOwnProperty(row)) {
			verticalBeads[row] = [];
		}
		verticalBeads[row].push(el);
		return el;
	}
	
	
	function createText(x, y, val, row, column){
		var el = document.createElementNS(svgNS, 'text');
// // 		el.cx.baseVal.value = x;
// // 		el.cy.baseVal.value = y;
			el.setAttributeNS(null,"x",x);     
			el.setAttributeNS(null,"y",y); 
// // 		var textNode = document.createTextNode(val);
// 		newText.appendChild(textNode);
//        newText.setAttributeNS(null,"text-anchor","middle");
// 		alert('el = ', el);// 
// 		el.x.baseVal.value = x1-10;
// 		el.y.baseVal.value = y1;
// 		el.setAttributeNS(null, 'class', 'btext');
		el._row = row;
		el.column = column;
// 		var textNode = document.createTextNode(val);
// 		el.appendChild(textNode);
		el.textContent = val;
		layer1.appendChild(el);
		return el;
		}
		
		

	
	

// SET BEAD LOCATION
	function setY(bead, y, dir)
	{
		var x = bead.cx.baseVal.value //column
			b = checkBoundaries(bead, y); //true/false: is bead movement within boundaries?

		if (b) {
			return false; //if not, no change to bead movement
		}

		for (var i = 0, len = beads[x].length; i < len; i += 1) { //FOR EVERY BEAD
			var bead2 = beads[x][i] //the bead on this iteration (beads[x] indexes all beads in the column
				,y2 = bead2.cy.baseVal.value; //y location of bead
				
			if (bead === bead2) { //if this is the bead in the argument of setY
				continue; //move current bead
			}

			if (dir) {
				if (dir === 'up' && bead._index < bead2._index) { //bead 2 is above bead: move them both
					continue;
				}

				if (dir === 'down' && bead._index > bead2._index) { //bead 2 is below bead: move them both
					continue;
				}
			} //what is the point of this? it just says continue either way.
			
			if (y >= y2 - 9 && y <= y2 + 9) { //increasing this made all the beads come together! //if they are within 5 of each other, move them both
				// raise
				if (bead._index > bead2._index) { 
					if (!setY(bead2, y - 9, 'up')) { //this is a recursive thing: 
					//I think the idea is that if bead2 is already at the top, the beads can't go up more
						return false;
					}
				}
				// lower
				else {
					if (!setY(bead2, y + 9, 'down')) { //same for down
						return false;
					}
				}
			}
		}

		bead.cy.baseVal.value = y;
		return true;
	}

	function checkBoundaries(bead, y)
	{
		/* Upper beads */
		if (bead.cy.baseVal.value < 20) { //upper bound for upper bead
			if (y <= 4.5) {
				return true;
			} else if (y >= 16) { //20 minus height of bead (4) lower bound
				return true;
			}
		}
		/* Lower beads */
		else {
			if (y <= 24) { //upper bound for lower beads
				return true;
			} else if (y >= 67.5) { //lower bound
				return true;
			}
		}

		return false;
	}
	
	//Computes value on abacus
	function updateValue()
	{
		var value = 0;

		for (var i = 0, len = checkBeads.length; i < len; i += 1) { //+= means i = i+1
			var bead = checkBeads[i]
				,x = bead.cy.baseVal.value
				,y = bead.cy.baseVal.value
				,rowBeads = verticalBeads[bead._row]
				,checkUpper = false
				,beadValue = Math.pow(10, (((bead._row) *-1)+8)) //changed to make right bead 1s place 
				//THIS just says what the value of each row is, not how it should be changed.

			/* Upper beads */
			if (y < 20 && y > 13) { //if bead is within 4 of the center bar CHANGE Y VALUE TO CHANGE SENSITIVITY OF UPPER BEAD TO BAR
				if (debug) {
					bead.setAttribute('fill', 'yellow');
				}
				checkUpper = true;
				value += beadValue * 5;
			}
			/* Lower beads */
			else if (y > 22 && y < 25) { //if bead is within 3 of center bar
				if (debug) {
					bead.setAttribute('fill', 'purple');
				}
				checkUpper = false;
				value += beadValue;
			} else {
				continue;
			}

			var prevy = y;

           // this part about dealing with additional beads?
			for (var j = 0, l2 = rowBeads.length; j < l2; j += 1) {
				var otherBead = rowBeads[j];

				if (otherBead._isCheckBead) {
					continue;
				}

				if (otherBead._isUpper !== checkUpper) {
					continue;
				}

				if (Math.abs(prevy - otherBead.cy.baseVal.value) < 10) { //this is just saying if the new bead is close to the old bead
					if (debug) {
						otherBead.setAttribute('fill', 'blue');
					}
					prevy = otherBead.cy.baseVal.value;
					if (checkUpper) {
						value += beadValue * 5;
					} else {
						value += beadValue; 
					}
				} else {
					break;
				}
			}
		}
		// change decimal place at end, make precise to the number of decimal places
		// Did this here b/c the decimals are inexact and it's easier to fix all at once at the end.
// 		alert("value1= " + value);
		tmp_val = value;
		while(tmp_val%10 ==0 && tmp_val > value*(Math.pow(10,-5))){
			tmp_val = tmp_val/10
// 			alert(tmp_val)
		}
		vallength = tmp_val.toString().length;
// 		alert("length= " +length);
		value = value*(Math.pow(10,-5));
// 		alert("value2 ="+value)
		
		/* If a whole number, just write the number (w/ no decimal places)*/
// 		alert("mod = " + (value % 1))
		// if (value % 1 == 0) { /* if there are no decimal places */
// 		document.getElementById('value').textContent = "GOOD MORNING";
// 		} else {// 
// 		document.getElementById('value').textContent = value.toPrecision(vallength);
// 		vallength = 0;
// 		}

	}

	init();

})();
