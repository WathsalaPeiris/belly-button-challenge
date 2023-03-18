const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//define variables
let ids = [];
let sampleIDs = [];
let otuIds = [];
let otuIds2 = [];
let otuLables = [];
let sampleValues = [];
let slicedSV = [];
let slicedOtuID = [];
let slicedLabels = [];
let metD = [];
let panelRow = [];
let panelRow2 = [];
let labels = [];
  
// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
  console.log(data.metadata);
  console.log(data.samples);

  //Iteration through names array and store ids in 'ids' list
  for (let i = 0; i < data.names.length; i++) {
    row = data.names[i];
    ids.push(row);
  }
  //Check the console to see if ids are listed 
  console.log(`${ids}`);

  //Get data labels from one object in the metadata table
  labels = Object.keys(data.metadata[0]);
  
  //Check console to see if lables are listed correctly
  console.log(`${labels}`);

  //Iteration through each object in metadata table and assign them in 'metD' list
  for (let i = 0; i < data.metadata.length; i++) {
    metD[i]= Object.values(data.metadata[i]);
  }

  //Test a couple of objects in console
  console.log(`${labels[0]}: ${metD[3][0]}, ${labels[1]}: ${metD[3][1]}, ${labels[0]}: ${metD[4][0]}, ${labels[1]}: ${metD[4][1]}`);
  
  //Iteration through samples table and store data from each dictionary to different lists
  for (let i = 0; i < data.samples.length; i++) {
    row = data.samples[i];
    sampleIDs.push(row.id);
    otuIds.push(row.otu_ids.map (j => 'OTU' + j));
    otuIds2.push(row.otu_ids);
    otuLables.push(row.otu_labels);
    sampleValues.push(row.sample_values);
  }

  //Slice the first ten records from outids, otulables and sample_values
  for (let i = 0; i < sampleValues.length; i++) {
    slicedSV[i] = sampleValues[i].slice(0,10);
    slicedOtuID[i] = otuIds[i].slice(0,10);
    slicedLabels[i] = otuLables[i].slice(0,10);
  }
  
  //Test the console to see if slicing is worked
  console.log(`${slicedOtuID[1]}`);
  console.log(`${slicedSV[1]}`);
  
  //call the function when an item is selected from the dropdown menu
  //select the dropdown list and call 'optionChanged
  d3.selectAll("#selDataset").on("Change", optionChanged);
  
  let panelRow = d3.select("#sample-metadata");
  
  //define an initial function to initiate the page
  function init() {
    let trace1 = [{
      x: slicedSV[0].reverse(),
      y: slicedOtuID[0].reverse(),
      type: "bar",
      orientation: "h",
      text: slicedLabels[0].reverse() 
    }]; 
    
    let layout1 = {
      margin: {
        l:75,
        r:75,
        b:50,
        t:2
      }
    };

    let trace2 = [{
      x: otuIds2[0],
      y: sampleValues[0],
      mode: "markers",
      marker: {
        color: otuIds2[0],
        size: sampleValues[0],
        text: otuLables[0]
      }
    }]; 

    let layout2 = {
      showlegend: false,
      xaxis: {
        title: 'OTU ID'
      },
      margin:{
        t:2
      }
    };

    //Create initial panel info
    for (let i = 0; i < labels.length; i++) {
      panelRow.append("ul").text(labels[i] + ':' + metD[0][i]).attr("transform", "translate('+margin.left+')");
    }

    //Create initial bar chart
    Plotly.newPlot("bar", trace1, layout1);
    //Create initial bubble chart
    Plotly.newPlot("bubble", trace2, layout2);
  }

  //Call the init function
  init();

});

//define the function to call when an item is seleced from the dropdowm menu
function optionChanged() {

  let dropdownMenu = d3.select("#selDataset");
  let dataset = dropdownMenu.property("value");
  let panelRow = d3.select("#sample-metadata");
  
  //define lists to hold data
  let x1 = [];
  let y1 = [];
  let x2 = [];
  let y2 = [];
  let z = [];
  let hText1 = [];
  let hText2 = [];

//Assign relevent data which matches to the selected item in the dropdown menu
for (let i = 0; i < sampleIDs.length; i++) {
  if (dataset === sampleIDs[i]) {
    x1 = slicedSV[i].reverse();
    y1 = slicedOtuID[i].reverse();
    x2 = otuIds2[i];
    y2 = sampleValues[i];
    z = metD[i];
    hText1 = slicedLabels[i].reverse();
    hText2 = otuLables[i];
    console.log(`${slicedOtuID[i]}`);
    console.log(`${slicedSV[i]}`);
    console.log(`${z}`);
  
    //define function to update Panel info when an item is selected in the dropdown menu
    function updatePanel(){
      panelRow.selectAll("ul").remove();
      
      for (let j = 0; j < z.length; j++) {
        console.log('Hello');
        console.log(`${z[j]}`);
        panelRow.append("ul").text(labels[j] + ':' + z[j]);
      }
    }
  }
}

//Assign relevent data of the selected item to the bar chart
let trace4 = [{
  x: x1,
  y: y1,
  type: "bar",
  orientation: "h",
  text: hText1
}]; 

//layout for the bar chart
let layout4 = {
  margin: {
    l:75,
    r:75,
    b:50,
    t:2
  } };

//Assign relevent data of the selected item to the bubble chart  
let trace5 = [{
  x: x2,
  y: y2,
  mode: "markers",
  marker: {
    color: x2,
    size: y2,
    text: hText2
  }
}]; 

//layout for the bubble chart
let layout5 = {
  showlegend: false,
  xaxis: {
    title: 'OTU ID'
  },
  margin: {
    t:2
  }
};

//Update the bar chart
Plotly.newPlot("bar", trace4, layout4);
//Update the bubble chart
Plotly.newPlot("bubble", trace5, layout5);
//Update the Panel info
updatePanel();

}




