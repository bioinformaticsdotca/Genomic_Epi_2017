First, the headers and style for the body and phylocanvas div. We will not change this at all during the tutorial, so I won't refer to it again.

```
<!DOCTYPE html>
<html>
<head>
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

And here is where interesting things happen.

```

  <script type="application/javascript">
   (function (Phylocanvas) {
      var tree = Phylocanvas.createTree('phylocanvas');
      tree.load('(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;');
    })(window.Phylocanvas);
  </script>

```

And the closing tags.

```

</body>
</html>
```
