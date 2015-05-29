(function() {

//Initialize variables
	var scale = 6
		,svgNS = 'http://www.w3.org/2000/svg'
		,layer1 = document.getElementById('layer1')
		,selBead = false
		,selButton = false
		,lowestIn = false
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
// Create some buttons: now need 2 rows
		var button = new Array();
		button[0] = new Array();
		button[1] = new Array();
		button[2] = new Array();
		button[3] = new Array();
// 		button[4] = new Array();
		
		

		for (var i = 0; i < 4; i += 1) {
			button[i][0] = new Array();
			button[i][0][1] = createButton(25 + 25 * i, 75, i, 0,1);
			for (var j = 1; j < 5; j +=1){
			button[i][j] = new Array();
			button[i][j][1] = createButtonMini(25 + 25 * i, 75 + 9*j, i, j,1);
			button[i][j][2] = createButtonMini(36 + 25 * i, 75 + 9*j, i, j,2);
			button[i][j][2].setAttribute('fill','orange');
		}
		}	
		
		// write +5 on a bead	
		var sign = new Array();
		sign[0] = new Array();
		sign[1] = new Array();
		sign[2] = new Array();
		sign[3] = new Array();

		for (var i = 0; i < 4; i += 1) {
			sign[i][0] = new Array();
			sign[i][0][1] = createText(20 + 25 * i, 81 , "+5",i,0);
			for (var j = 1; j < 5; j += 1){
			sign[i][j] = new Array();
			sign[i][j][1] = createText(16 + 25 * i, 81 + 9 * (j), "+" + j,i,j);
			sign[i][j][2] = createText(27 + 25 * i, 81 + 9 * (j), "-" + j,i,j);
		}
		}	
		
				
		// create 0 opacity buttons on top of the other buttons, to be actually clicked on
		// THIS IS STILL TO-DO
		// Create some buttons: now need 2 rows
		for (var i = 0; i < 4; i += 1) {
				// tb[i][0] = new Array();
// 				tb[i][0][1] = 
			createTb(25 + 25 * i, 75, i, 0,1);
			for (var j = 1; j < 5; j +=1){
			createTbMini(25 + 25 * i, 75 + 9*j, i, j,1);
			createTbMini(36 + 25 * i, 75 + 9*j, i, j,2);
					}
		}
	
		
// Touchscreen controls		
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {

      abacus.addEventListener('touchstart', function(e) {
        e.preventDefault(); 
        if (e.touches.length == 1) {
          var touch = e.touches[0];
          var node = touch.target;
           if (e.target && e.target.tagName && e.target.tagName === 'rect') {
        	topButton = e.target;
          selButton = button[topButton._row][topButton.column][topButton.b12];
          selButton.setAttribute('fill', 'white');
          }
        }
      });
      
      abacus.addEventListener('touchend', function(e) {
        if (e.touches.length == 0) {
      selSign = sign[selButton._row][selButton.column][selButton.b12]
      
      for (var i = 0; i < 4; i += 1) { 
        if(lower[selButton._row][i].isIn == 1){
         lowestIn = i+1;
        }
        if (lowestIn==false){
        	lowestIn = 0;
        }
        }

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
        	if(lowestIn < 4){
        	selBead = lower[selButton._row][lowestIn];
        	setY(selBead, 25 + (selBead.column * 9), 'up');
        	selButton.setAttribute('fill','green');
        	}else{
        	selButton.setAttribute('fill','green');
        	}
        	} 	
        	
        else if(selSign.textContent == "-1"){//lower row, add 1
        	if(lowestIn > 0){
        	selBead = lower[selButton._row][lowestIn-1];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','orange');
        	}else{
        	selButton.setAttribute('fill','orange');
        	}
        	}
        	
        else if(selSign.textContent == "+2"){//lower row, add 1
        	if(lowestIn < 3){
        	selBead = lower[selButton._row][lowestIn+1];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','green');
        	}else{
        	selButton.setAttribute('fill','green');
        	}
        	} 	
        	
        else if(selSign.textContent == "-2"){//lower row, subtract 2
        	if(lowestIn > 1){
        	selBead = lower[selButton._row][lowestIn-2];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','orange');
        	}else{
        	selButton.setAttribute('fill','orange');
        	}
        	}
        	
        else if(selSign.textContent == "+3"){//lower row, add 3
        	if(lowestIn < 2){
        	selBead = lower[selButton._row][lowestIn+2];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','green');
        	}else{
        	selButton.setAttribute('fill','green');
        	}
        	}
        	
        else if(selSign.textContent == "-3"){//lower row, subtract 3
        	if(lowestIn > 2){
        	selBead = lower[selButton._row][lowestIn-3];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','orange');
        	}else{
        	selButton.setAttribute('fill','orange');
        	}
        	}
        	
        else if(selSign.textContent == "+4"){//lower row, add 3
        	if(lowestIn == 0){
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','green');
        	}else{
        	selButton.setAttribute('fill','green');

        		}
        	}
        else if(selSign.textContent == "-4"){//lower row, subtract 3
        		if(lowestIn == 4){
        			selBead = lower[selButton._row][0];
        			setY(selBead, 40 + (selBead.column * 9), 'down'); 
        			selButton.setAttribute('fill','orange');
        		}else{
        			selButton.setAttribute('fill','orange');
        		}
        	}     	
//        	else{
//         	return
//         	}
        	
		selBead = false;
        selButton = false;
        selSign = false;
        lowestIn = false;
        }
      });
      
      abacus.addEventListener('touchmove', function(e) {
        e.preventDefault(); 
        if (selBead && e.touches.length == 1) {
          var touch = e.touches[0];
          setY(selBead, touch.pageY / scale);
        }
      });

    } else {
//Mouse Controls
      abacus.addEventListener('mousedown', function(e) {
        if (e.target && e.target.tagName && e.target.tagName === 'rect') {
          topButton = e.target;
          selButton = button[topButton._row][topButton.column][topButton.b12];
          selButton.setAttribute('fill', 'white');
          }
      });

      abacus.addEventListener('mouseup', function(e) {
//       alert("selButton = " + selButton);
      selSign = sign[selButton._row][selButton.column][selButton.b12]
//       alert("selSign = " + selSign);
      
      for (var i = 0; i < 4; i += 1) { 
        if(lower[selButton._row][i].isIn == 1){
         lowestIn = i+1;
        }
        if (lowestIn==false){
        	lowestIn = 0;
        }
        }
//         alert("lowestIn:" + lowestIn);

      
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
        	if(lowestIn < 4){
        	selBead = lower[selButton._row][lowestIn];
        	setY(selBead, 25 + (selBead.column * 9), 'up');
        	selButton.setAttribute('fill','green');
        	}else{
        	selButton.setAttribute('fill','green');
        	}
        	} 	
        	
        else if(selSign.textContent == "-1"){//lower row, add 1
        	if(lowestIn > 0){
        	selBead = lower[selButton._row][lowestIn-1];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','orange');
        	}else{
        	selButton.setAttribute('fill','orange');
        	}
        	}
        	
        else if(selSign.textContent == "+2"){//lower row, add 1
        	if(lowestIn < 3){
        	selBead = lower[selButton._row][lowestIn+1];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','green');
        	}else{
        	selButton.setAttribute('fill','green');
        	}
        	} 	
        	
        else if(selSign.textContent == "-2"){//lower row, subtract 2
        	if(lowestIn > 1){
        	selBead = lower[selButton._row][lowestIn-2];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','orange');
        	}else{
        	selButton.setAttribute('fill','orange');
        	}
        	}
        	
        else if(selSign.textContent == "+3"){//lower row, add 3
        	if(lowestIn < 2){
        	selBead = lower[selButton._row][lowestIn+2];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','green');
        	}else{
        	selButton.setAttribute('fill','green');
        	}
        	}
        	
        else if(selSign.textContent == "-3"){//lower row, subtract 3
        	if(lowestIn > 2){
        	selBead = lower[selButton._row][lowestIn-3];
        	setY(selBead, 40 + (selBead.column * 9), 'down'); 
        	selButton.setAttribute('fill','orange');
        	}else{
        	selButton.setAttribute('fill','orange');
        	}
        	}
        	
        else if(selSign.textContent == "+4"){//lower row, add 3
        	if(lowestIn == 0){
        	selBead = lower[selButton._row][selButton.column-1];
        	setY(selBead, 25 + (selBead.column * 9), 'up'); 
        	selButton.setAttribute('fill','green');
        	}else{
        	selButton.setAttribute('fill','green');

        		}
        	}
        else if(selSign.textContent == "-4"){//lower row, subtract 3
        		if(lowestIn == 4){
        			selBead = lower[selButton._row][0];
        			setY(selBead, 40 + (selBead.column * 9), 'down'); 
        			selButton.setAttribute('fill','orange');
        		}else{
        			selButton.setAttribute('fill','orange');
        		}
        	}     	
//        	else{
//         	return
//         	}
        	
		selBead = false;
        selButton = false;
        selSign = false;
        lowestIn = false;
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
	
		function createButton(x1, y1, row, column, b12)
		{
		var el = document.createElementNS(svgNS, 'rect');
		el.x.baseVal.value = x1-10;
		el.y.baseVal.value = y1;
		el.width.baseVal.value = 20;
		el.height.baseVal.value = 7;
		el.setAttribute('class', 'button');
		el._row = row;
		el.column = column;
		el.b12 = b12;
		el.setAttribute('fill','green');
		// el.setAttribute('stroke', '#777');
		// el.setAttribute('stroke-width', .5);
		layer1.appendChild(el);
		return el;
	}
	
			function createTb(x1, y1, row, column, b12)
		{
		var el = document.createElementNS(svgNS, 'rect');
		el.x.baseVal.value = x1-10;
		el.y.baseVal.value = y1;
		el.width.baseVal.value = 20;
		el.height.baseVal.value = 7;
		el.setAttribute('class', 'button');
		el._row = row;
		el.column = column;
		el.b12 = b12;
		el.setAttribute("style", "opacity: 0");
		layer1.appendChild(el);
		return el;
	}
	
			function createButtonMini(x1, y1, row, column,b12)
		{
		var el = document.createElementNS(svgNS, 'rect');
		el.x.baseVal.value = x1-10;
		el.y.baseVal.value = y1;
		el.width.baseVal.value = 9;
		el.height.baseVal.value = 7;
		el.setAttribute('class', 'button');
		el._row = row;
		el.column = column;
		el.b12 = b12;
		el.setAttribute('fill','green')
		// el.setAttribute('stroke', '#777');
		// el.setAttribute('stroke-width', .5);
		layer1.appendChild(el);
		return el;
	}
	
		function createTbMini(x1, y1, row, column,b12)
		{
		var el = document.createElementNS(svgNS, 'rect');
		el.x.baseVal.value = x1-10;
		el.y.baseVal.value = y1;
		el.width.baseVal.value = 9;
		el.height.baseVal.value = 7;
		el.setAttribute('class', 'button');
		el._row = row;
		el.column = column;
		el.b12 = b12;
		el.setAttribute("style", "opacity: 0");
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
		el.isIn = -1;
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
			el.setAttributeNS(null,"x",x);     
			el.setAttributeNS(null,"y",y); 
		el._row = row;
		el.column = column;
		el.textContent = val;
		layer1.appendChild(el);
		return el;
		}
		
// SET BEAD LOCATION
	function setY(bead, y, dir, test)
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
			} 
			if (y >= y2 - 9 && y <= y2 + 9) { //increasing this made all the beads come together! //if they are within 5 of each other, move them both
				// raise
				if (bead._index > bead2._index) { 
					if (!setY(bead2, y - 9, 'up', 1)) { //this is a recursive thing: 
					//I think the idea is that if bead2 is already at the top, the beads can't go up more
						return false;
					}else{
					bead2.isIn = 1;
					}
				}
				// lower
				else {
					if (!setY(bead2, y + 9, 'down', 1)) { //same for down
						return false;
					}else{
					bead2.isIn = -1;
					}
				}
			}
		}

		bead.cy.baseVal.value = y;
		if(!test){
		bead.isIn = bead.isIn*-1;
// 		alert("location:" + bead.cy.baseVal.value + "in:" + bead.isIn + "column: " + bead.column);
		}
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
		tmp_val = value;
		while(tmp_val%10 ==0 && tmp_val > value*(Math.pow(10,-5))){
			tmp_val = tmp_val/10
		}
		vallength = tmp_val.toString().length;
		value = value*(Math.pow(10,-5));
		
		/* If a whole number, just write the number (w/ no decimal places)*/
// 		// if (value % 1 == 0) { /* if there are no decimal places */
// 		document.getElementById('value').textContent = "GOOD MORNING";
// 		} else {// 
// 		document.getElementById('value').textContent = value.toPrecision(vallength);
// 		vallength = 0;
// 		}

	}

	init();

})();
