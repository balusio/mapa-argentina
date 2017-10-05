var startMap = (function(){
	var dataMap,
    svg,
	width = 900,
	height =900,
	parentGroup,
	centered,
	g,
	active_prov,
	properties_dptos,
	province_name= document.getElementById("textPlace"),

// POSICION DEL MAPA CENTRAL
	projection = d3.geo.transverseMercator()
	.center([0, -40])
	.rotate([60, 0])
	.scale(1500)
	.translate([width / 2, height / 2]);

	path = d3.geo.path().projection(projection),


	bringData = function(){
		//json data del archivo
		d3.json("arg_opt.json", function(error, argentina) {
			if (error) return console.error(error);
        	dataMap = argentina;
        	renderGlobalMap();
		});

		//SVG TO DOM
		svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
	  	.attr("id","mapaMunicipio");
	  	g = svg.append("g");

	  	active_prov = d3.select(null);


	},


	renderGlobalMap = function (){

       	//MUNICIPIO DRAW
        g.selectAll(".municipio")
            .data(topojson.feature(dataMap, dataMap.objects.dptos).features)
            .enter()
            .append("path")
            .attr("d",path)
            .attr("class","municipio")
            .attr('data-id',function(d) {
            	var str = d.properties.ip;
            	str = str.replace('p', '');
              	return str;
            });


		//PROVINCIA DRAW
		g.selectAll(".provincia")
           .data(topojson.feature(dataMap, dataMap.objects.provs).features)
           .enter()
           .append("path")
           .attr("d", path)
           .attr('data-id',function(d) {
              return d.id;
            })
           .attr("class","provincia-central")
           .on("click",clicked);
	},

	clicked =function (d) {
		if (active_prov.node() === this){
			return reset();
			province_name.innerHTML = "";
		}
		active_prov.classed("active", false);
		active_prov = d3.select(this).classed("active", true);
		//nompre de provincia en html
	  	province_name.innerHTML = d.properties.np;

	  	//bounds selecciona el html
	  	var bounds = path.bounds(d),
	    dx = bounds[1][0] - bounds[0][0],
	    dy = bounds[1][1] - bounds[0][1],
	    x = (bounds[0][0] + bounds[1][0]) / 2,
	    y = (bounds[0][1] + bounds[1][1]) / 2,
	    scale = 0.7 / Math.max(dx / width, dy / height),
	    translate = [width / 2 - scale * x, height / 2 - scale * y];

	  	g.transition()
	    .duration(750)
	    .style( scale + "px")
	    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

	},


	reset = function() {
  		active_prov.classed("active", false);
  		active_prov = d3.select(null);
	  	g.transition()
	    .duration(750)
	    .style("stroke-width", "1.5px")
	    .attr("transform", "");
	}


	return {
		init : bringData
	}

})();

window.onload = startMap.init();