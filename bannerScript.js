console.log('is this thing on');

let directory = {}

async function loadData() {
  //loads data
  directory = await d3.json("BannerDirectory.json");
  //creates a map database where the key is the newspaper name and the value is an array of people objects
  const newspaperCounts = Object.entries(directory).map(function(entry) {
    //if the entry is available, then key is paper name and value is the array of people
    if (entry[0] !== 'nan'){
      var paper = entry[0];   // The key (newspaper name)
      var people = entry[1];  // The value (array of people objects)
    }
    else{
    // if not available, then zero it out
      return{
        newspaper: 'Not available',
        count: 0
      }
    }
    return {
        newspaper: paper,
        count: people.length // Number of people associated with the newspaper
    };
  })
  //sort the list for barchart use
  .sort(function(a, b) {
    return b.count - a.count; // Sort from highest to lowest count
  });

  // all of this was to make that map

  // making the size responsive

  const width = 900;
  console.log(width);
  //select all elements with id=chart and add inside of it an svg with height of 800px and a width of 
  const svg = d3.select("#chart")
    .append("svg")
    .attr("height", 10000)

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(newspaperCounts, d => d.count)])
    .range([0, width-20]);

  const yScale = d3.scaleBand()
    .domain(newspaperCounts.map(d => d.newspaper))
    .range([0, newspaperCounts.length * 40])
    .padding(0.2);

  const colorScale = d3.scaleOrdinal(d3.schemeObservable10);

  svg.selectAll(".bar")
    .data(newspaperCounts)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d => yScale(d.newspaper))
    .attr("width", d => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", d => colorScale(d.newspaper))
    .on("click", function(event, d) {
        togglePeople(d.newspaper);
      });

  svg.selectAll(".label")
      .data(newspaperCounts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.count) + 5)  // Position slightly to the right
      .attr("y", d => yScale(d.newspaper) + yScale.bandwidth() / 2)  // Center vertically
      .attr("dy", "0.35em")  // Adjust text alignment
      .text(d => d.newspaper)
      .style("font-size", "12px")  // Adjust text size
      .style("fill", "black");  // Color of labels

//   d3.selectAll(".box")
//       .data(Object.keys(directory)) // Use stored data
//       .enter()
//       .append("div")
//       .attr("class", "box")
//       .text(d => d)
//       .on("click", function(event, d) {
//           togglePeople(d.newspaper, this);
//       });
// }
  
function togglePeople(newspaper, box) {
  const peopleData = directory[newspaper];
  const container = d3.select("#details");

  // Check if the newspaper is already displayed
  const existingCards = container.selectAll(".person-card");
  
  if (!existingCards.empty()) {
      // If cards exist, remove them (toggle off)
      container.html(""); 
  } else {
      // Otherwise, display the people (toggle on)
      if (peopleData) {
          container.selectAll(".person-card")
              .data(peopleData)
              .enter()
              .append("div")
              .attr("class", "person-card")
              .html(function(d) {
                  return `
                      <img src="${d.img}" class="profilePic">
                      <p><strong>${d.name}</strong></p>
                      <p>${d.position}</p>
                      <p class="para">${d.para} </p>
                      
                  `;
              });
          }
      }
  }
}


loadData();