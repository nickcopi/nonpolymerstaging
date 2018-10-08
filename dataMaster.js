/*used to rip json from the specific table setup, give it an html dom document and a callback function*/
const getData = function(doc) {
    const categories = 
        [...doc.querySelectorAll('thead > tr > th')]
            .map(e => e.innerText);
    const obj = categories
        .reduce((obj, name, index) => ({
            ...obj,
            [name]: [...doc.querySelectorAll('tbody > tr')]
                        .filter(row => row.children.length == categories.length)
                        .map(row => row.children[index])
                        .map(e => e.innerText.trim() || null)
        }), {});
    return obj;
};

const getJSON = ()=>{
	fetch('dump.json').then((res)=>{
		res.json().then((res)=>{
			renderData(res);
		})
	})
};

/*Makes a new canvas and returns its ctx reference. Could probably be improved on*/
let makeCanvas = ()=>{
	let canvas = document.createElement('canvas');
	canvas.width = 800;
	canvas.height = 400;
	document.getElementById('graphs').appendChild(canvas);
	return canvas.getContext('2d');

};
/*draws a new bar graph to dom from data in dump[attr]
 * also calls makeCanvas so be careful*/
let barFromAttr = (attr,dump)=>{
	let data = [];
	let labels = [];
	let borderColor = [];
	let backgroundColor = [];
	dump[attr].forEach(i=>{
		if(i === null) return;
		if(labels.indexOf(i) === -1){
			labels.push(i);
			data.push(1);
			let colorPart = `rgba(${Math.random()*256},${Math.random()*256},${Math.random()*256}, `;
			borderColor.push(colorPart + '1)');
			backgroundColor.push(colorPart + '0.5)');
		 } else {
			data[labels.indexOf(i)]++;
		 }
	});
	let barGraph = new Chart(makeCanvas(),
		{
    			type: 'bar',
    			data: {
    			    labels,
    			    datasets: [{
    			        data,
    			        backgroundColor,
    			        borderColor,
    			        borderWidth: 1
    			    }]
    			},
    			options: {
    			    /*scales: {
    			        yAxes: [{
    			            ticks: {
    			                beginAtZero:true
    			            }
    			        }]
    			    },*/
    			    scales: {
    			        yAxes: [{
    			            ticks: {
					fontColor:'#DDDDDD'
    			            }
    			        }],
    			        xAxes: [{
    			            ticks: {
					fontColor:'#DDDDDD'
    			            }
    			        }]
    			    },
    			    responsive:false,
			    legend: {
				    display:false,
				    labels:{
				    	fontColor:'#DDDDDD'
				    }
			    },
			    title:{
				    display:true,
				    fontColor:'#DDDDDD',
				    text:attr
			    }
    			}
		}
	);

};


/*draws a new piChart to dom from data in dump[attr]
 * also calls makeCanvas so be careful*/
let piFromAttr = (attr,dump)=>{
	let data = [];
	let labels = [];
	let borderColor = [];
	let backgroundColor = [];
	dump[attr].forEach(i=>{
		if(labels.indexOf(i) === -1){
			labels.push(i);
			data.push(1);
			let colorPart = `rgba(${Math.random()*256},${Math.random()*256},${Math.random()*256}, `;
			borderColor.push(colorPart + '1)');
			backgroundColor.push(colorPart + '0.5)');
		 } else {
			data[labels.indexOf(i)]++;
		 }
	});
	let piChart = new Chart(makeCanvas(),
		{
    			type: 'pie',
    			data: {
    			    labels,
    			    datasets: [{
    			        data,
    			        backgroundColor,
    			        borderColor,
    			        borderWidth: 1
    			    }]
    			},
    			options: {
    			    responsive:false,
			    legend: {
				    labels:{
				    	fontColor:'#DDDDDD'
				    }
			    },
			    title:{
				    display:true,
				    fontColor:'#DDDDDD',
				    text:attr
			    }
    			}
		}
	);

};


/*callback for when json data is ripped from tables, handle drawing the page here*/
let renderData = dump=>{
	window.dump = dump;
	/*piFromAttr('COLLEGE_DESC',dump);
	piFromAttr('COLLEGE',dump);
	piFromAttr('START_DATE',dump);*/
	drawSearchUI(dump);
	for(x in dump){
		if(dump[x].indexOf(null) === -1) piFromAttr(x,dump);
		else barFromAttr(x,dump);
	}
};
window.addEventListener('load',(e)=>{
	//const data = getData(document.getElementById('data').contentDocument);
	if(config.USE_CACHE){
		getJSON();
	} else {
		let iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.src = 'data.html';
		iframe.addEventListener('load',function(e){
			renderData(getData(this.contentDocument));
		});
		document.body.appendChild(iframe);
	}
	//renderData(data);
});
