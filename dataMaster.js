/*used to rip json from the specific table setup, give it an html dom document and a callback function*/
const getData = function(doc) {
// <iframe src="data.html" id = "data" style="display:none"></iframe>
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
	let header = document.getElementById('header');
	let searchBar = document.createElement('input');
	searchBar.style.width = innerWidth - 35 + 'px';
	searchBar.style.height = '40px';
	searchBar.style.fontSize = '18px';
	searchBar.addEventListener('keypress',onSearch);
	header.appendChild(searchBar);
	for(x in dump){
		if(dump[x].indexOf(null) === -1) piFromAttr(x,dump);
		else barFromAttr(x,dump);
	}
};
window.addEventListener('load',(e)=>{
	const data = getData(document.getElementById('data').contentDocument);
	renderData(data);
});
