# Aclab Blog Website

This is a website built with [Jekyll](https://jekyllrb.com/) to post blogs related to papers, readings, etc.

## Usage

### Make a new post

Here's how you'd write your new post locally:
1. Create a new markdown file with format `yyyy-mm-dd-YOUR-TITLE.markdown`.
2. Start the markdown with the following:
   ```
    ---
    layout: post
    title: "YOUR TITLE"
    author: "YOUR NAME"
    date: yyyy-mm-dd
    ---
   ```
   This tells Jekyll your markdown uses the pre-defined `post` template.
3. Write your blog. You can refer to [this post](https://github.com/optimizedlearning/aclab-blog/blob/master/_posts/2024-05-29-dummy-post.markdown) for syntax. You can also use popular markdown editors (e.g., from VSCode) to preview your post. 

### Include an image, a pdf, etc.

Here's how you'd include your own images (same for pdf):
1. Go to `assets/images/YOUR-DIRECTORY` and upload your images.
2. Include this in your markdown:
```markdown
{% include figure.html url="/images/YOUR-DIRECTORY/IMAGE.png" description="Caption of the image." width="100%" %}
```
- Without specification, width defaults to "100%" (full width).

### (Optional) Test your blog on your local device

Optionally, you may want to preview your blog before you upload it. Here's how you can do it:
1. Download [ruby](https://www.ruby-lang.org/en/downloads/).
2. Run the following code:
   ```
   git clone https://github.com/optimizedlearning/aclab-blog.git
   cd aclab-blog
   bundle install
   bundle exec jekyll serve
   ```
3. Go to `localhost:4000/aclab-blog`. Now you should see the website on your local device. Every time you modify your blog, just refresh the page and you will see the changes.

### Upload your post

And here's how you'd upload it:
1. You can directly go to `_posts/` directory in GitHub and manually upload your markdown.
2. Or you can clone this repo `git clone https://github.com/optimizedlearning/aclab-blog.git` and sync the new post via git.


## Advanced features

### Automatic TOC

We provide a built-in automatic table of content (TOC). By default, it is disabled. To enable it, you need to specify the following in the post config section:
```
---
use_toc: true
---
```

You need to comply to the following simple rules in order to allow TOC parse correctly:
- Use `h2` for section and `h3` for subsections (i.e., `##` and `###` in markdown).
- Add `{: ._sec }` after your sections and subsections. This tells the `toc` that these `h2,h3` DOMs are the actual sections to be collected.

Below is an example of a structured section list.
```markdown
## Section 1
{: ._sec }

### Subsection 1.a
{: ._sec }

### Subsection 1.b
{: ._sec }

## Section 2
{: ._sec }

### Subsection 2.a
{: ._sec }
```

### Custom LaTeX Macros

You can custom latex commands in a similar way to latex. To do so, you simply need to include this at the beginning of your post:
```markdown
<div style="display:none">
$
% Your custom macros, e.g.,
\newcommand{\x}{\boldsymbol{x}}
$
</div>
```

We also provide you a default list of macros including caligraphic letters, bold symbols, and blackboard letters (see `_includes/latex_macros.html` for details). You can enable it by specifying
```
---
use_macro: true
---
```
You can also make your own list of macros and save it globally for future use. To do so, you can create a new file `_includes/MACRO_NAME.html` and include this at the beginning of your post.
```markdown
{% include MACRO_NAME.html %}
```

### Theorem and definition environments

You can include built-in environments similar to latex `theorem` and `definition` as follows:
```markdown
{% capture ENV_NAME %}
You can write the content of your environment here. You can include **Markdown** and even LaTeX, e.g.,

$$ a^2 + b^2 = c^2 $$
{% endcapture %}

{% include theorem.html type="Theorem" title="ENV_TITLE" content=ENV_NAME %}
```
- By default, `type="Theorem`. You can change it to `"Proposition", "Definition"`, etc. 
- If `title` is specified, it plays the same role as `\begin{theorem}[title]`.


## Other Caveats

- When your inline equations don't render, try to escape special characters with `\`. For example, use `\|` instead of `|` and use `\\|` for `\|`. Here's a list of special characters:
   ```
   \_ \* \[ \] \( \) \{ \} \# \+ \- \. \! \> \| \\\ \" \' \~ \^ \= \:
   ```
- From my experience, you should always escape `|`, which by default creates a new column in table (I know that's very annoying).
- When you are sure the equation is enclosed by `$` but it doesn't render, try to escape `_` with `\_`, which denotes the italic text enclosed by it (e.g., `_italic_`). You can go to the most suspicious `_` in an equation (usually something like `_{XXX}`) and escape it.
- Display mode equations should be fine.
