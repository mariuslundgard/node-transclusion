# Transclusion

Transclusion is an HTML5 preprocessor based on the DOM and the concept of _[transclusion](https://en.wikipedia.org/wiki/Transclusion)_ as defined by [Ted Nelson](https://en.wikipedia.org/wiki/Ted_Nelson) in 1982.

The purpose of Transclusion is to make life easier for anyone who knows a little bit of HTML, as well as laying the foundation for developers working with advanced HTML content editors.

*Transclusion is currently only implemented in PHP5.4+.*

[See the PHP version here](http://github.com/mariuslundgard/transclusion).

## Syntax examples

### Basic syntax

The syntax of Transclusion embraces/extends the XML-flavored syntax implemeneted by HTML5. Therefore, valid HTML5 is completely valid Transclusion syntax:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hello, world!</title>
</head>
<body>
    <p>Hello world!</p>
</body>
</html>
```

However, the following will produce the same output as the previous example:
```html
<title>Hello, world!</title>
<p>Hello world!</p>
```

This is because Transclusion lets you omit unecessary markup (although this does require a good understanding of the way XML and HTML5 is structured).

Here's a more advanced example where the `header` element needs a closing tag in order to produce the intended structure:
```html
<meta author="Marius Lundgård">
<title>A More Advanced “Hello, World!” Example</title>
<header>
    <h1>[[ title ]]</h1>
</header>
<div id="#content">
    <p>A “Hello, world!” example is a common way of introducing a scripting language.</p>
```

Which will output:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>A More Advanced “Hello, World!” Example</title>
    <meta name="author" content="Marius Lundgård">
</head>
<body>
    <header>
        <h1>A More Advanced “Hello, World!” Example</h1>
    </header>
    <div id="content">
        <p>A “Hello, world!” example is a common way of introducing a scripting language.</p>
    </div>
</body>
</html>
```

### Including element blocks

```html
<p>The element following this paragraph will be the element with the corresponding id "intro" in "source.html".<p>
<block src="source.html" element="#intro">
```

### Base documents and block replacement

In _Extension.html_:
```html
<html base="Base.html">
<block element="#content">
    <p>This replaces the div#content element in the base document.</p>
</block>
```

In _Base.html_:
```html
<title>[[ title ]]</title>
<div id="content">
    (Content goes here.)
</div>
```

### Expressions

Transclusion uses the expression delimiters `[[` and `]]` (without the quotes). In the following example, the document variable `title` is used as an example.

```html
<p>The following header's text will be the document filename (if the title was not otherwise set using the setter routine).</p>
<h1>[[ title ]]</h1>
```

### Operations

```html
<p>The sum of 3 + 7 is [[ 3 + 7 ]]</p><!-- Which outputs: "The sum of 3 + 7 is 10" -->
```

### Iterations

```html
<nav>
    <ul>
        <li each="page in directory.documents"><a href="[[ page.uri ]]">[[ page.title ]]</a></li>
    </ul>
</nav>
```

### Conditions

```html
<div class="blog" if="directory.documents">
    <article each="post in directory.documents">
        <h1>[[ post.title ]]</h1>
    </article>
</div>
<div class="blog" if="!directory.documents">
    <p>No posts</p>
</div>
```

### Document variables

* `title` -- Refers to the document title (the filename by default)
* `uri`
* `last_modified`
* `meta.author` -- Refers to the content atrribute of the `<meta name="author">` element
* `meta.description`
* `meta.keywords`
* `meta.*`
* `directory.title`
* `directory.documents`
* `directory.stylesheets`
* `directory.scripts`
* `directory.files`
* `directory.resources`

## Implementations

### Official
* PHP5.4+ (in development)
* Node.js (in development)