Game.Bubble = function(text) {
	Promise.call(this);

	this._text = text + "\n\n(Enter to continue)";
	this._cells = {};
	this._geom = {
		border: 2,
		dist: 1,
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		textWidth: 0
	};

	window.addEventListener("keydown", this);
}
Game.Bubble.extend(Promise);

Game.Bubble.prototype.handleEvent  = function(e) {
	if (e.keyCode == 13) { 
		Game.display.showBubble(null);
		Game.display.setCenter();
		this.fulfill(); 
	}
}

Game.Bubble.prototype.getCells = function() {
	return this._cells;
}

Game.Bubble.prototype.anchorToBeing = function(being) {
	var pos = being.getPosition();
	var x = pos[0];
	var y = pos[1];
	this._compute(x, y);
	return this;
}

Game.Bubble.prototype.anchorToDisplay = function(x, y) {
	var offset = Game.display.getOffset();
	x += offset[0];
	y += offset[1];
	this._compute(x, y);
	return this;
}

Game.Bubble.prototype.show = function() {
	for (var i=0; i<this._geom.width; i++) {
		for (var j=0; j<this._geom.height; j++) {
			var dx = i+this._geom.left;
			var dy = j+this._geom.top;
			this._cells[dx+","+dy] = true;

			var ch = "";
			if (i == 0 || i+1 == this._geom.width) { ch = "|"; }
			if (j == 0 || j+1 == this._geom.height) { 
				ch = (ch == "|" ? "+" : "-");
			}

			Game.display.draw(dx, dy, ch, "saddlebrown");
		}
	}
	Game.display.drawText(this._geom.left+this._geom.border, this._geom.top+this._geom.border, this._text, this._geom.textWidth);
	Game.display.showBubble(this);

	return this;
}

Game.Bubble.prototype._compute = function(x, y) {
	var offset = Game.display.getOffset();
	x -= offset[0];
	y -= offset[1];
	this._cells[x + "," + y] = true;

	var avail = Game.display.getOptions();
	var textSize = Game.display.measureText(this._text, Math.ceil(avail.width/2));

	this._geom.textWidth = textSize.width;
	this._geom.width = textSize.width + 2*this._geom.border;
	this._geom.height = textSize.height + 2*this._geom.border;

	if (x < avail.width/3) { /* left */
		this._geom.left = x + this._geom.dist + 1;
	} else if (x > 2*avail.width/3) { /* right */
		this._geom.left = x - this._geom.dist - 2*this._geom.border - textSize.width;
	} else { /* middle */
		this._geom.left = Math.round(x - this._geom.border - textSize.width/2);
	}

	if (y < avail.height/3) { /* top */
		this._geom.top = y + this._geom.dist + 1;
	} else { /* middle, bottom */
		this._geom.top = y - this._geom.dist - 2*this._geom.border - textSize.height;
	}

}