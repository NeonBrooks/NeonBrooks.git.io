(function() {

//Initialize variables
	var scale = 6
		,svgNS = 'http://www.w3.org/2000/svg'
		,layer1 = document.getElementById('layer1')
		,selBead = false
		,checkBeads = []
		,verticalBeads = {}
		,beads = {}
		,indexCounter = 0
		,debug = true;
		
		touch =new Array();
		node =new Array();
		selBead =new Array();
		
	function init() {

    var abacus = document.getElementById("abacus");

		/* Create vertical rods */
		for (var i = 1; i <= 4; i += 1) {
			createRod(i * 32, 0, i * 32, 105);
		}

		/* Create horizontal rod */
		createRod(0, 30, 160, 30);
		
		/* put a dot on the ONES COLUMN of the abacus */
		createDot(96,30); // x and y coords of dot
	
		/* Create upper beads */
			var upper = new Array();
			upper[1] = createBead(32 + 32 * 0, 8, 0, true, true);
			upper[2] = createBead(32 + 32 * 1, 8, 1, true, true);
			upper[3] = createBead(32 + 32 * 2, 8, 2, true, true);
			upper[4] = createBead(32 + 32 * 3, 8, 3, true, true);
			
		// Create lower beads
		var lower = new Array();
		lower[0] = new Array();
		lower[1] = new Array();
		lower[2] = new Array();
		lower[3] = new Array();
		
		for (var i = 0; i < 4; i += 1) {
			for (var j = 0; j < 4; j += 1) {
				lower[i][j] = createBead(32 + i * 32, /* x location: 25 + gap of 25 between each column */
				52 + (j * 15), /* y location: 35 for first bead, 40 for second, etc*/
				i, /* Row */ 
				j,
				false, /*is upper */ 
				j === 0); /* is checkbead.. so this comes out as no except if j=0 (first bead). 
				not sure what checkbead does, seems to work the same even when I make this "true"*/
			}
		}
		
		//ONE MORE BUTTON
		var button = createReset(80, 110, 100, 1);
// 		alert(button[10][10])
		createText(70, 120, "Reset", 10,10);
		var reset = createReset(80, 110, 100,0, 4, 1);
		
// Touchscreen controls		
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {

      abacus.addEventListener('touchstart', function(e) {
        e.preventDefault(); 
        if (e.touches.length > 0) {
		  for (var i = 0; i < e.touches.length; i++){
		  touch[i] = e.touches[i];
          node[i] = touch[i].target; //SVG ellipse element
          if (node[i] && node[i].tagName && node[i].tagName === 'ellipse') {
            selBead[i] = node[i];
          }
          if (e.target && e.target.tagName && e.target.tagName === 'rect') {
          	button.setAttribute('fill', 'white');
          	window.location.reload();
          	}
        }
        }
      });
      
      abacus.addEventListener('touchend', function(e) {
        if (e.touches.length == 0) {
          updateValue();
          selBead = [];
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
        if (e.target && e.target.tagName && e.target.tagName === 'ellipse') {
          selBead = e.target;
          if (debug) {
            selBead.setAttribute('fill', 'red');
          }
        }
        
          if (e.target && e.target.tagName && e.target.tagName === 'rect') {
          	button.setAttribute('fill', 'white');
          	window.location.reload();
          	}
      });

      abacus.addEventListener('mouseup', function(e) {
        if (debug && selBead) {
          selBead.setAttribute('fill', 'black');
        }
        updateValue();
        selBead = false;
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
	
		
		function createReset(x1, y1, width, opacity, row, column)
		{
		var el = document.createElementNS(svgNS, 'rect');
		el.x.baseVal.value = 80-width/2;
		el.y.baseVal.value = y1;
		el.width.baseVal.value = width;
		el.height.baseVal.value = 13;
		el.setAttribute('class', 'button');// 
		el._row = row;
		el.column = column;
		el.setAttribute('fill','gray');
		el.setAttribute("style", "opacity:"+opacity);
		// el.setAttribute('stroke', '#777');
		// el.setAttribute('stroke-width', .5);
		layer1.appendChild(el);
		return el;
		}

	function createBead(x, y, row, isUpper, isCheckBead)
	{
		var el = document.createElementNS(svgNS, 'ellipse');
		el.cx.baseVal.value = x;
		el.cy.baseVal.value = y;
		el.rx.baseVal.value = 14; // Bead is 10 wide
		el.ry.baseVal.value = 7; // and 4 tall
		el.setAttribute('class', 'bead');
		el._index = indexCounter++;
		el._row = row;
		el._isCheckBead = isCheckBead;
		el._isUpper = isUpper;
		layer1.appendChild(el);

		if (!beads.hasOwnProperty(x)) {
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
		var x = bead.cx.baseVal.value //column?
			b = checkBoundaries(bead, y); //true/false: is bead movement within boundaries?

		if (b) {
			return false; //if not, no change to bead movement
		}

		for (var i = 0, len = beads[x].length; i < len; i += 1) { //for this bead and the ones above / below (not sure which) 
			var bead2 = beads[x][i] 
				,y2 = bead2.cy.baseVal.value; //y location of bead (current or other)

			if (bead === bead2) {
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

			if (y >= y2 - 15 && y <= y2 + 15) { //increasing this made all the beads come together! //if they are within 5 of each other, move them both
				/* raise */
				if (bead._index > bead2._index) { 
					if (!setY(bead2, y - 15, 'up')) { //this is a recursive thing: 
					//I think the idea is that if bead2 is already at the top, the beads can't go up more
						return false;
					}
				}
				/* lower */
				else {
					if (!setY(bead2, y + 15, 'down')) { //same for down
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
// 	alert(bead.cy.baseVal.value)
		/* Upper beads */
		if (bead.cy.baseVal.value < 30) { //upper bound for upper bead
			if (y < 7.5) {
				return true;
			} else if (y > 22.5) { //30 minus height of bead (10) lower bound
				return true;
			}
		}
		/* Lower beads */
		else {
			if (y <= 37) { //upper bound for lower beads
				return true;
			} else if (y >= 98) { //lower bound
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
					bead.setAttribute('value', y);
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
// 		document.getElementById('value').textContent = value;
// 		} else {// 
// 		document.getElementById('value').textContent = value.toPrecision(vallength);
// 		vallength = 0;
// 		}
	}

	init();

})();
