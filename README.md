# Research Case & Concept

**Question: How close to the city centre can you park in different cities?** <br>
<br>

**Sub-questions**
- Does it affect the parking rate the closer you can park it is?
- How high or low are the parking rates?
- What is 'close' to the city centre exactly?
- What citties/towns will I be looking at?
- Where in a city/town will I be looking?
- How do I get the coordinates?

**Assumptions** <br>
I think in smaller cities it is possible to park closer to the city centre than in larger citties. I suspect parking rates in bigger cities and townships will be higher. This might be because they want to minimize the amount of cars in the city. And I assume the closer to the city centre you park your care the higher the rates will be. This is probably done to give pedestrians, cyclists and tourists in more space in crowded or shopping area's. That way they want to keep cars out to make it more safe.

**Datasets & Variables** <br>
The datasets I will be using to answer this question are [_Open Data Parkeren: GEOMETRIE GEBIED_](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEOMETRIE-GEBIED/nsk3-v9n7) and [_Open Data Parkeren: TARIEFDEEL_](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-TARIEFDEEL/534e-5vdg). I want to make two seperate visualisations with these datasets. One to show carparks close to city centres and one bar chart to see what car parks are the most/least expensive. Thanks to Stan I knew there are coordinates inside the _GEOMETRIE GEBIED_ dataset which I will use to plot the dots on a map of the Netherlands. <br>
From _GEOMETRIE GEBIED_ I will use `String areageometryastext` to get the coordinates and transform them into separate properties. It now contains points or polygons with coordinates and all I have to do is getting one value out of it. <br>
From _TARIEFDEEL_ I will use `int amountfarepart` `int stepsizefarepart` to calculate the parking fares using a calculation Sam and Victor pointed out ("If AmountFarePart is 5,0 and stepSizeFarePart is 720 you pay 5EU for 720 minutes which means 5EU per 12 hours = 0,41eu per hour").

**Empty entries** <br>
For entries that don't contain any data I'm using a bit of code demonstrated by Laurens. Click [here](TODO) to see it.

**Sketches** <br>
<img src="https://i.imgur.com/CNazY7E.png" height="500"/>
<img src="https://i.imgur.com/7q2VVrb.png" height="500"/>
<img src="https://i.imgur.com/UY49o7u.png" width="700"/>
<img src="https://imgur.com/BQzvk58.png" height="500"/> 

# Interesting functional patterns
TODO

# Link to visualisation
TODO

# Installation

**Clone the this repository** 
```js
git clone https://github.com/mbergevoet/frontend-data
```

# Sources

_TODO_

# License

This repository uses [MIT](https://github.com/mbergevoet/iCOV-redesign/blob/master/LICENSE) license. © Merlijn Bergevoet 2020
