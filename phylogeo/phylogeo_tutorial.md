layout: tutorial_page 
permalink: /high-throughput_biology_2017_module2_lab

title: Infectious Disease Genomic Epidemiology Tutorial #4 

header1: Workshop Pages for Students

header2: Infectious Disease Genomic Epidemiology Phylogeography Lab 

image: /site_images/CBW-CSHL-graphic-square.png home: https://bioinformaticsdotca.github.io/genomic_epidemiology_2017

# Phylogeography CBW tutorial
## Rob Beiko - May 1, 2017

**Learning objectives.**
By the end of the tutorial, you will be able to:

- Build a simple tree visualization using Phylocanvas
- Create a Microreact project and use it for outbreak investigation
- Export a Microreact project and create visualizations in GenGIS

### THE DATASET

The dataset we will be using is adapted from [Eppinger et al. (2014)](http://mbio.asm.org/content/5/6/e01721-14.short "Eppinger et al. (2014)"), which used phylogenetic methods to identify the most probably source for the introduction of _Vibrio cholerae_ into Haiti. Since the Haiti sequences constituted a clade that was embedded within a larger Nepalese clade, the authors concluded that Nepalese peacekeepers were the most likely source of the epidemic strain: this corroborated with the geographic proximity of peacekeeping camps with affected areas. I compiled a tree, information about locations, and specific isolates into a set of files that we will use in the examples below.

**Maps**: Microreact uses Leaflet.js to connect to OpenStreetMap maps, which is easy. GenGIS requires you to load in a map file, which is less easy. The good news is that by making use of the ***GDAL libraries, GenGIS supports a large number of geographic file formats (GeoTIFF, ASCIIGrid, PNG, ESRI shapefiles, etc.). Baby photos will work too. If you can find it, it's pretty much assured you can load it.

However, there is nothing like digital maps to send you on circular Web page trips (well, maybe the SRA comes close). If you want Canadian data, you can try [NRCan](http://geogratis.gc.ca/site/eng/extraction "NRCan") although the data cannot be downloaded immediately. [Natural Earth](http://www.naturalearthdata.com/ "Natural Earth") has beautiful raster and vector data files that interact easily with GenGIS; unfortunately dynamic ranges are not available. The [USGS Earth Explorer](https://earthexplorer.usgs.gov/ "USGS Earth Explorer") has some very useful data, but (i) You'll need a login, and (ii) GenGIS may gak on some of the larger datasets. The map data we will use today are sourced from Natural Earth.

GenGIS has the MapMaker tool ([http://kiwi.cs.dal.ca/GenGIS/MapMaker](http://kiwi.cs.dal.ca/GenGIS/MapMaker "http://kiwi.cs.dal.ca/GenGIS/MapMaker")) which allows you to export a subsection of three really nice Natural Earth raster maps at a specified resolution. For more detailed manipulations, I usually fire up [QGIS](http://www.qgis.org/en/site/index.html "QGIS").

**Location information and metadata**: We will use a couple of different representations of the data. Microreact wants a **single input file** that contains information about each isolate, including a unique ID and whatever other metadata you would like to include. One important point is that site colours and shapes must be hardcoded in the file: you can update on the fly if you're linked to a Google Sheet or whatnot, but there is no interactivity within Microreact itself for the time being. Here is the [**Microreact source file**](https://github.com/bioinformaticsdotca/Genomic_Epi_2017/blob/master/phylogeo/Microreact_isolates_filtered.csv "Microreact .csv file").

Full disclosure: I changed the sampling year for one isolate from 1991 to 2004, to avoid a gap of 13 years in the timeline animation.

We could use the same input format for GenGIS if we wanted to. But GenGIS offers a cleaner option which makes it easier to update information in a consistent way. For GenGIS we will split our data into a [**location file**](https://www.dropbox.com/s/z6slqwsujsxaha4/GenGIS_Cholera_locations.csv?dl=0 "Cholera isolate location file") which includes information for each site, and a [**sequence file**](https://www.dropbox.com/s/vh8l6gdszjjcj52/GenGIS_Cholera_isolates.csv?dl=0 "Cholera isolate file") that contains information about each individual isolate. This structure keeps all location information in a single row, which makes it easier to update attributes for all sequences at a given location. IDs ("Site ID" and "Sequence ID") must be unique in each file, but you can otherwise go to town.

**Tree**: Sourced directly from the paper. A rooted tree in Newick format.

### PART 1 - [Phylocanvas](http://phylocanvas.org/ "Phylocanvas")

__Disclaimer__: I am not a Web developer. What we do below will work, but Javascript is weird to me so I've probably broken a lot of conventions in preparing these scripts. The scripts below would not be possible without the help of Josh Adam at the NML.

_Overview_: Phylocanvas is a Javascript library that can be used to perform interactive tree manipulations on a web page. Phylocanvas scripts can be installed locally, or you can use online resources including the “quickstart” link and various plugins. As we will see later, Phylocanvas provides the tree visualizations in Microreact as well. There are a couple of dependencies: see [http://phylocanvas.org/docs/install/](http://phylocanvas.org/docs/install/ "Installation guide") for details.

We will do all of our work today by developing a locally hosted Web page to develop Phylocanvas functionality. All of our work will be based on the "Quickstart" script that is served from the Phylocanvas site. You can also install the Phylocanvas libraries locally if you wish to do serious development.

N.B.: I thought about embedding the HTML / Javascript in this section into a Jupyter notebook using [ijavascript](https://www.npmjs.com/package/ijavascript "ijavascript"), but have never tried this and didn't really have the time to learn how to do it. You might have fun trying it out if this is your sort of thing.

_Tutorial outline_:

1. Learn how to use the "Quickstart" package for basic visualizations
2. Modify Quickstart to load a tree
3. Build a simple user interface to do fun basic things with the tree.

**1.1 Use the Phylocanvas Quickstart to create a simple tree visualization**

The easiest place to start with Phylocanvas is to link directly to their "phylocanvas-quickstart.js" script, which implements all of the basic functionality needed to view and muck around with a tree. Let's deconstruct the code at http://phylocanvas.org/docs/quick-start/[http://phylocanvas.org/docs/quick-start/](http://phylocanvas.org/docs/quick-start/ "http://phylocanvas.org/docs/quick-start/"). Note that the phylogenetic tree in the website code has a couple of seemingly redundant labels: "E" is actually an internal node label, and "F" is the root. 

First, the headers and style for the body and phylocanvas div. I have added an explicit utf-8 character set definition to stop irritating warnings in the browser console. We will not change this at all during the tutorial, so I won't refer to it again.

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
  <style>
    body {
      margin: 0.625em auto;
      max-width: 60em;
    }
    #phylocanvas {
      width: 100%;
      height: 30em;
    }
  </style>
 </head>
 <body>
  <h1>Phylocanvas Quickstart</h1>
```

Here is where we link to the Phylocanvas "quickstart" script:

```
  <div id="phylocanvas"></div>
  <script type="application/javascript" src="https://cdn.rawgit.com/phylocanvas/phylocanvas-quickstart/v2.8.1/phylocanvas-quickstart.js"></script>

```

And here is where interesting things happen. This is code block we will be modifying as we proceed through the tutorial.

```
  <!-- START MODIFY BLOCK -->
  <script type="application/javascript">
    (function (Phylocanvas) {
      var tree = Phylocanvas.createTree('phylocanvas');
       tree.load('(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;');
    })(window.Phylocanvas);
  </script>
  <!-- END MODIFY BLOCK -->

```

And the closing tags.

```

</body>
</html>
```

Running this in your browser should give you output similar to that in Figure 1.1a. You should be able to drag the tree around, and right clicking will give a menu with some more options. You may notice that the Newick tree contains "E" and "F" labels that are not being displayed; this is because these correspond to an internal node and the root node and are not displayed by default. If you want to muck around with the internals of the tree, then you will need to be able to refer to the corresponding nodes.

What's going on here? The key elements are:

 - the instantiation of the #phylocanvas section of the document
 - linking to the js file
 - creating a tree in the 'phylocanvas' division
 - initializing the tree with a Newick string

**1.2 Modify Quickstart to load your favourite tree**

So that was exciting. Our next step is to start modifying the code with some basic tree manipulation bits.

But first things first: although opinions seem divided about best practices, since we're going to be making slightly fancier Javascript code, we're going to pop out the gory stuff like function definitions into a separate .js file. There are several advantages to this:

 - You can debug the HTML and js files independently.
 - Your HTML file does not bloat with enormous blocks of code: all you need are "src" and function calls.
 - Splitting out your JS code allows its reuse in other HTML files without having to constantly copy/paste/update.

We basically need to do three things to accomplish this:

1. Move the function definitions into a new file, which we will call "pc-functions.js"
2. Tell the HTML file where to find these functions by using the "src" tag.
3. Call functions from a separate `<script>` tag in the HTML file.

_Step 1_

Create a file called "pc-functions.js" (or just download the completed version from the Github repo) and paste the following code:

```
<!--
function loadPredefinedTree() {
	var defaultTree = '(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;';
	const tree = Phylocanvas.createTree('phylocanvas'); // see API for config options
    tree.load(defaultTree);
	return tree;
}
-->
```

This is a Javascript function that builds the tree and returns it to the HTML file so you can interact directly with it events, etc.

_Step 2 and 3_

We're going to replace the modify block in the HTML file above with the following:

```
  <!-- START MODIFY BLOCK -->
  <script type="application/javascript" src="pc-functions.js"></script>
  <script>
	loadPredefinedTree();
  </script>
  <!-- END MODIFY BLOCK -->
```

Two things just happened: first, we're loading "pc-functions.js" but doing anything with it because we used the src tag. Second, we're creating a script block where will do various things.

The modified HTML file is on Github as "pc-basic-external.html". That was a bit of work, but hopefully it will pay off as we do more things with the library.

**1.3 Build a simple user interface**

Let's explore some of the tree-manipulation options that are available at [The Pylocanvas site](http://phylocanvas.org/docs/features/). Figure 1.3a shows the environment that I have created.

The file "pc-interactive.html" contains the various function calls that respond to different specified control elements. I will not paste all of the examples here, but we'll look at one specifically: the range slider that controls node sizes.

In the HTML file: 

```
	<p>Adjust node sizes</p>
	<input type="range" value="0" min="0" max="50" onchange="showValue(this.value)">
	<span id="range">0</span>

```

The onchange="showValue(this.value)" will call the function to update node sizes whenever the slider is dragged.

The function is simple enough that I didn't bother moving it to the .js file.

```
	function showValue(newValue) {
		document.getElementById("range").innerHTML=newValue;
		tree.setNodeSize(newValue);
	}
```

It should be fairly straightforward to see how the elements interact with the functions. If you want to try something "fun", try swapping one of my leaf or branch manipulations with something else on the [Phylocanvas features page](http://phylocanvas.org/docs/features/ "Phylocanvas features page").

### PART 2 - [Microreact](https://microreact.org/ "Microreact")

_Overview_: ["Microreact is a React.js application taking full advantage of the Phylocanvas API (trees), the Leaflet.js (maps) and vis.js library (timeline)."](https://microreact.org/about) Key strengths of Microreact include the ease of data importation, interactive controls for all three main elements (map, tree, and timeline), and the ability to share projects via a simple Web link. In addition to plain text files, Microreact projects can be linked to NCBI, data sources in Google Sheets, and linked to other cloud-based storage systems.

_Tutorial outline_:

1. Interact with an existing Microreact project to learn basic interactions
2. Create a Microreact project and identify key phylogenetic patterns
3. Export data to .csv and .nwk files

I recommend you create a **Microreact account**. Although it is not essential, this is the only way to manage a project (including deleting the project) after it has been created. The link to sign in is [https://microreact.org/signin](https://microreact.org/signin "https://microreact.org/signin (redundant tooltip!)")

**2.1 Interact with an existing Microreact project**

Let's start by looking at the data from the 2017 Ebola paper that was covered at the end of the lecture. In addition to a remarkable set of open data and analyses, including full implementations to recreate the figures ([Github link](https://github.com/ebov/space-time "Ebola "space-time" Github link")), the authors created a [Microreact project](https://microreact.org/project/west-african-ebola-epidemic?tt=rc "Ebola Microreact project") that users can interactively explore.

The default view includes a map centred on the three most-affected countries, a phylogenetic tree with all the sampled strains, and a timeline that runs from Mar 2014 - Oct 2015 (Figure 2.1a). Everything has tooltips, so it's pretty easy to figure out what's going on here.

Let's start with the map panel. The underlying data are OpenStreetMap rather than Google Maps, but the interactions are basically the same. You can change the map style using the button in the upper left-hand corner. You can also select a specific geographic range using the "Disable map region filter" button in the upper right-hand corner, then draw a polygon on the map that will define your selection of points. You could select a specific country, or target a border region to see if there are multiple implied transmission events.

The tree panel offers a range of manipulation tools. In the upper corners are menus that let you do various Phylocanvas-y things to your tree: experiment with different styles, node sizes, etc. to try and find a suitable view. You can also choose labelings by clicking on the eyeball icon.

Finally, the animational panel at the bottom lets you track cases as they emerge through time. The controls are pretty obvious, and you can enter different date ranges and choose "Filter" to filter the data according to date ranges.

Give yourself a couple of minutes to play around and familiarize yourself with the system. Try to come up with a really nice, clear visualization of the data. Then try to come up with a horrible, obnoxious visualization of the data.

**2.2 Create your own Microreact project**

Whether you are logged in or not, the centre of the action is [https://microreact.org/upload](https://microreact.org/upload "Upload page!"). Here you have the opportunity to upload your isolate information (.csv) and your tree (.nwk). Select "browse for files" if you wish to upload directly, or you can link directly to URLs. Linking directly to the files in the Github repo makes Microreact sad, but I used [http://rawgit.com/](http://rawgit.com/ "rawgit.com") to serve the files, which works.

So you two choices: either download the files from Github and upload them to Microreact, or use the following links to connect with the Dropbox versions:

 - CSV: [`https://cdn.rawgit.com/bioinformaticsdotca/Genomic_Epi_2017/232d51c9/phylogeo/microreact/Microreact_isolates_filtered.csv`](https://cdn.rawgit.com/bioinformaticsdotca/Genomic_Epi_2017/f7b6d24a/phylogeo/Microreact_isolates_filtered.csv "RawGit csv file")
 - Tree: [`https://cdn.rawgit.com/bioinformaticsdotca/Genomic_Epi_2017/232d51c9/phylogeo/microreact/Haiti_cholera_tree.nwk`](https://cdn.rawgit.com/bioinformaticsdotca/Genomic_Epi_2017/f7b6d24a/phylogeo/Haiti_cholera_tree.nwk "RawGit tree file")

You can do more exotic things too, like putting your data into a Google Sheet and using a shareable link, or using their API to do everything programmatically.

Most of the columns in the .csv file are pretty explanatory. The critical ones are: 

 - ID: this column must be present and unique.
 - Latitude / longitude: positive values are Northern and Eastern hemispheres respectively, negative values are Southern and Western. So Halifax is about 44.65, -63.58.
 - Region__colour: this assigns specific colours to the different values in the Region column. I've used HEX notation (hash-bunch of letters and numbers), but you can use HTML colour codes as well. Note the British / Canadian spelling of "colour" :)
 - "Day/Month/Year": Microreact needs these three columns if you wish to create your own motion picture starring Dustin Hoffman and Rene Russo.

Once the data are loaded, try out some similar operations as you did in 2.1 above. You can also change the source files (not on my Github!) to examine the effects. Be creative.

If you have your own GenEpi data in a similar format, try it out! I would be interested to work through any strange matters that come up.

**2.3 Export your data**

In the upper right-hand corner of the page is a "Download project files" link. There's really nothing more to say about this, is there?

### PART 3 - [GenGIS](http://kiwi.cs.dal.ca/GenGIS/Main_Page "GenGIS")

_Overview_: GenGIS is a standalone application for Windows and Mac that supports extensive visualizations of phylogeographic data sets. Important features of GenGIS include a wide range of tree layout options, visualization of sample-site information, and Python plugins that allow users to create custom analyses and data views.

To get a feel for what GenGIS can do, the basic rule is **right click and see what happens**. This will open up the appropriate contextual menus, and you can explore what is possible here. As we walk through the examples below, feel free to experiment and see if you end up with something you like better.

A note on saving: GenGIS allows you to save your session and re-load it at a later time, but it can be a bit flaky (it generated some of the weirdest errors we've ever seen!) and is not cross-compatible between versions. Sometimes when loading a session you might get a weird error message, but often clicking "Ignore" will load the session anyway. We tried. We really tried.

_Tutorial outline_:

1. Load map, location, and "sequence" data into GenGIS
2. Manipulate location visualizations
3. Load tree
4. Experiment with different tree visualizations
5. Run showSpread plugin
6. Build a phylogenetic cartogram

**3.1. Load map, location, and "sequence" data**

GenGIS can load maps in raster and vector data formats, and can overlay vector data onto raster maps. If you do plan to use both, you must load the raster data first, then overlay the vector files. If you load vector data first, GenGIS will create a "pseudo-raster" representation. Loading vector data first also prevents you from making a cartogram, so we're going to use a raster map.

One of the nicest basemaps at a global scale is the Natural Earth "hypsometric tints" map (NaturalEarth2_WorldMap.tif), which displays the world as it should look vis-a-vis forest cover, etc. This is a GeoTIFF but contains no elevation information - it simply provides a very nice georeferenced world map for subsequent analysis. The resolution is also high enough that our cartogram construction below will not look terrible. You can load the map either from the File menu, or by clicking the big "Load Raster Map" button in the ribbon. 

We will also load a vector map which contains country boundaries. Click "Load Vector Map" and choose "ne_50m_admin_0_sovereignty.shp". You should see the country boundaries pop up, with the vectors assigned some random colour. Let's fix this immediately by right-clicking on the "Vector Map" line in the menu on the left, and choosing "Properties" which will by default bring up the polygon colouring. Set the colour to black or whatever you like.

I've already explained the location and sequence (i.e., isolates) files in the prologue, so let's just go ahead and load them. The appropriate buttons are also in the ribbon; you'll need to load the location data first, since the isolates need to know where they belong!!

Map controls: It's easy to move the map around (left-click and drag), change the pitch (right-click and drag), and rotate (spin the compass in the control widget at the top right).

**3.2. Manipulate location visualizations**

You should see a bunch of orange dots which correspond to the locations. If you expand the items in the control panel on the left, you'll be able to see all the locations, and all the isolates mapped to each location. Note in particular that many of the Haiti location sites have >1 isolate associated with them. You can right-click on any location or isolate to inspect its data, and control its specific visualizations.

Let's explore some global location controls. If you right-click on "Location Set", you'll get a window with tons of custom controls. The three tabs we'll briefly explore are "Location Set", "Grid", and "Polygons".

Most of this stuff should be fairly self-explanatory: the "Location Set" tab gives you control over colour, shape, and size, which are all uniform by default but can be adjusted according to whatever properties you like. Go to "Colour", unselect "Uniform colour", and try colouring by Department. Choose any colour scheme you like, either continuous or categorical: use "Department" as your field. One thing I often do is start with one of the uniform colour schemes at the bottom, then set specific colours for emphasis. "Discrete: High contrast" is one of my favourite schemes although it cannot cover all categories so you'll need to define a couple of extra colours. "Continuous: Scientific" is also fun but the bright colours may not be your cup of tea. 

Shapes work in pretty much the same way.

If you want to adjust the size of your location dots, go to the "Size" tab and change the max/min values. It doesn't matter which field you use if everything is going to be the same size anyway.

You can add labels to your locations, with lots of different controls for display and positioning. You can customize the label view in the main GenGIS window. One slight irritant is that you cannot see the label while you're dragging it to a different position: the alternative actually leads to horrendous performance hits.

Grid: To activate the grid, you need to click "Show Grid" at the top of the panel. Once active, you can control several aspects of the grid, including density (# of divisions or lat/long intervals), alignment to map position, and colour (including transparency). Try creating a grid with 10-degree resolution, with a colour scheme that runs from white to red.

Polygons: similar to gridding, you need to click on the "Draw Polygons" box at the top of the panel. Polygons will be based on location colouring. You can increase the padding, and make them float above the map.

**3.3. Load tree**

It's time to load the Newick-formatted tree. GenGIS requires that trees be rooted (i.e., a bifurcation at the basal node). Click on "Load Tree" in the ribbon. GenGIS defaults to a 3D slanted cladogram, but you can easily switch to other 3D views by right-clicking on "Tree" in the control panel and either choosing the appropriate option directly in the pop-up menu, or by clicking on "Properties" to open the detailed tree controls. We're not ready for 2D trees yet, but for now just appreciate that the 3D tree is a pretty awful representation in this case.

**3.4. Tree visualizations**

OK, now we're ready for 2D trees. 2D trees require you to draw a line in the map window that will be perpendicular to the branches of the tree. Tree drawing follows a "right-hand rule": if you draw a line from point A to B, the tree will layout on the right-hand side of the line (see Figure 3.4a). To draw the axis, click "Layout Line" on the ribbon, then click two points in the map pane that will serve as the end points of the line. The default 2D view is a cladogram, where branches are aligned such that all leaves touch the axis.

The initial tree view highlights the fit between the ordering of leaves in the tree relative to the geographical ordering of the points along your chosen axis. The best possible alignment is obtained by rotating internal nodes of the tree to minimize the number of "crossings" needed to match up tree leaves with geographic locations. Data that follow a linear geographic pattern will require few crossings, while data that do not align well will generate many crossings. In this case, there really isn't a linear hypothesis or a clear east-to-west gradient, so the tree layout is useful more as a tool to simplify the visualization.

The key to tree manipulation is to right click on "Tree: " in the left-hand menu and select "Properties". This will bring up a window with four tabs, the most important of which is "Symbology". This tab gives you control over the details of the tree visualization. If you select this tab, you will see three additional tab options, "Tree", "Connecting Lines", and "Geography Line". Let's take a look at the Tree panel.

Most of the elements here allow you to control the size and the shape of the tree, and should be fairly self-explanatory. Try changing the line thickness, leaf node radius, etc. until you get a visualization you are happy with. A key option is the "Style" option: select this and then choose "Propagate Discrete Colours". Setting this option will assign colours to edges in the tree that subtend locations with the same colour. In other words, if an internal branch of the tree covers locations of a single colour, then the branch will have that colour. Branches in the tree that subtend two or more colours will assume the "Default Colour", which I usually set to black if the background is white. This is how we obtain the image shown in Figure 3.4a.

If you deselect "Draw geographic axis", then you will get direct dropline connections from leaves to locations. In some cases this can make for a clearer view of connections between tree and geography. You can also adjust the dropline properties in the "Connecting Lines" panel. There is a tradeoff between dropline clarity and location properties, so try adjusting things to your liking.

If we return to the main map area, we can see that GenGIS has a few more tree-visualization tricks up its sleeve. First, you can click+drag the control points of the geographic axis to rotate the tree, and you can click+drag on any node in the tree to move the entire tree. Simply clicking on a node will highlight the corresponding subtree and the locations it connects to. Right-clicking on a node brings additional options, including collapsing a subtree, splitting the tree, and zooming in on a particular subtree. Try it out - if things get weird you can always restore the original tree by using the option at the bottom.

I generated the screenshot in Figure 3.4b with the following steps:

  - Modify the tree visualizations to emphasize branches and shrink nodes
 
  - Set all Haiti samples to purple and all Nepalese samples to green

  - Right clicked on the root node and selected "Collapse homogeneous subtrees"

  - Left click the node that is highlighted in red, to emphasize the connection between this small clade that comprises samples from both Haiti and Nepal.

There are many other things you can do with tree visualizations - I encourage you to experiment and see what works best with your own dataset!

**3.5. showSpread**

So far we have concentrated on static visualizations of the data. However, GenGIS also offers the option to cycle through locations or isolates based on their attributes. A natural choice for this is to run an animation through time, with sequences added progressively as they appear. GenGIS has the "ShowSpread" plugin which supports this type of animation.

To accomplish this, first set the tree with whatever visualization parameters you like. You may or may not want to view the connecting droplines: they can either be helpful or an unwanted distraction. 

Next, under the "plugins" menu, choose the showSpread option. You will see the panel with default settings. Choose "Specific Date of Isolation" for "data" and choose a relatively recent starting date such as 1/1/2009. At the bottom you can set the granularity and speed of the animation. Click "Run" to play the animation.

**3.6. Build a cartogram**

Obviously a key challenge with this dataset is the fact that our most interesting samples are squished into two relatively small spaces. One way to address this is by distorting the map to emphasize areas with densely clustered sets of points, while compressing sparse regions. GenGIS uses a *cartogram* algorithm to accomplish this. To construct a cartogram, right click on the "Raster Map" item in the left panel, and select "Properties". You will see a series of tabs including "Cartogram". This will present you with a couple of options. The *location radius* extends the range of effect of dense areas, which tends to preserve local map structure. The *variable multiplier* increases the push of densely populated areas of the map, which increases dispersion at the expense of recognizable shapes on the map. The default values of 5 and 10 will give a modest level of distortion, while 100 and 100 will give you pretty much all Haiti and Nepal. If you still have that vector map hanging around, make sure you include it in the "Select Vector Map" option. Finally, since this map is quite large, it can take a while to perform the distortion. The "Resize Density Map" option is a heuristic that increases the grid size to accelerate the run, at the expense of perfect optimality. Try a couple of variations and see what the effects of the two variables are. Figure 3.6a shows a dramatic example where the variable multiplier is set to 200 - dramatic, but necessary when the areas of focus are relatively small. It's still a bit messy, but focusing on a small subtree helps to clarify the pattern.

**Epilogue**

This describes an alternative approach I used to build a very simple and clean basemap for GenGIS. The problem with this map came up when building the cartogram - the map resolution was great for a global view, but when Haiti is expanded it is far too blocky to be useful. For purposes other than cartogram construction, this type of approach will work fine.

I took a vector map of political divisions and converted it to raster format using QGIS, with some downsampling to speed up the whole map loading process. This display is simple and clean, which can add emphasis to the trees. If you want a prettier base map, you can grab one of the maps directly from [Natural Earth](http://www.naturalearthdata.com/downloads/50m-raster-data/ "Natural Earth - 50 m resolution rasters"). Natural Earth also has many vector files that you can overlay onto the raster in GenGIS.

One quick point about the GeoTIFF format: you need to include the '.tifw' file along with the actual .tif, as this contains the projection information. GenGIS will recognize this file automatically. But if you move the .tif without the .tifw, GenGIS will still load it, but you will not have the correct lat / long referencing.

