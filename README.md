# Research Case & Concept

Question: How close to the city centre can you park in different cities? (Hoe dicht bij het centrum kun je in een verschillende steden parkeren?) <br>
<br>
**Data & Variables** <br>
The datasets I will be using to answer this question are _Open Data Parkeren: TARIEFDEEL_ and _Open Data Parkeren: GEOMETRIE GEBIED_. To calculate the parking rates I'm going to use _AmountFarePart - Integer_ and _StepSizeFarePart - Integer_ (Sam and Victor pointed out how to calculate the rate "If AmountFarePart is 5,0 and stepSizeFarePart is 720 you pay 5EU for 720 minutes which means 5EU per 12 hours = 0,41eu per hour"). To link the rate to a location I will also be using _AreaManagerId_ to find it in the GEOMETRIE GEBIED dataset which contains a variable called _GeoDataAsText - String_. This variable basicly contains coordinates an polygons you can plot on a map (Stan pointed this out). <br>
<br>
**Assumptions** <br>
My assumptions on this question are as follows:
* I suspect parking rates in bigger cities and townships will be higher. This might be because they want to minimize the amount of cars in the city.
* And I think the closer to the city centre you park your care the higher the rates will be. This is probably done to give pedestrians, cyclists and tourists in more space in crowded or shopping area's. That way they want to keep cars out to make it more safe.
* I think in smaller cities it is possible to park closer to the city centre than in larger citties.

**Sub-questions**
- Does it affect the parking rate the closer you can park it is?
- What is 'close' to the city centre exactly?
- What citties/towns will I be looking at?
- Where in a city/town will I be looking?
- How do I get the coordinates?
- How high or low are the parking rates?

# Sketches

<img src="https://i.imgur.com/CNazY7E.png" height="400"/>
<img src="https://i.imgur.com/7q2VVrb.png" height="400"/>
<img src="https://i.imgur.com/tLQD6Nf.png" width="700"/>

# Installation

**Clone the this repository** 
```js
git clone https://github.com/mbergevoet/frontend-data
```

# Sources

_WORK IN PROGRESS_

# License

This repository uses [MIT](https://github.com/mbergevoet/iCOV-redesign/blob/master/LICENSE) license.
