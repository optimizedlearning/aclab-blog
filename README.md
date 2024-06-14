# Aclab Blog Website

This is a website built with [Jekyll](https://jekyllrb.com/) to post blogs related to papers, readings, etc.

## Usage

Here's how you'd write your new post locally:
1. Create a new markdown file with format `yyyy-mm-dd-YOUR-TITLE.markdown`.
2. Start the markdown with the following:
   ```
    ---
    layout: post
    title: "YOUR TITLE"
    date: yyyy-mm-dd
    ---
   ```
   This tells Jekyll your markdown uses the pre-defined `post` template.
3. Write your blog. You can refer to [this post](https://github.com/optimizedlearning/aclab-blog/blob/master/_posts/2024-05-29-dummy-post.markdown) for syntax. You can also use popular markdown editors (e.g., from VSCode) to preview your post. 

Here's how you'd include your own images (same for pdf):
1. Go to `assets/images/YOUR-DIRECTORY` and upload your images.
2. Use the markdown
   ```
   ![image-text](../../../assets/images/YOUR-DIRECTORY/IMAGE.jgp)
   ```
   Jekyll posts automatically have url of form `base_url/yyyy/mm/dd/TITLE.html`, so we need 3 `../` in relative url.
   *This feels quite dumb, and I'm trying to figure out a clean solution.*

And here's how you'd upload it:
1. You can directly go to `_posts/` directory in GitHub and manually upload your markdown.
2. Or you can clone this repo `git clone https://github.com/optimizedlearning/aclab-blog.git` and sync the new post via git.

## Advanced features

### Theorem and definition environments

You can include built-in environments similar to LaTeX `theorem` and `definition` as follow:
```
{% capture ENV_NAME %}
You can write the content of your environment here. You can include **Markdown** and even LaTeX, e.g.,

$$ a^2 + b^2 = c^2 $$
{% endcapture %}
{% include theorem.html title="ENV_TITLE" content=ENV_NAME %}
```
Replace `theorem.html` with `definition.html` for `definition` environment.

### Automatic TOC

You can use a built-in automatic table of content (TOC) by adding the following to your post:
```
{% include toc.html %}
```
However, you need to follow several simple rules so that TOC can parse correctly:
- Only `h2` and `h3` will be included and structured.
- Add `{: ._sec }` after your title, e.g.
   ```
   ## Section 1
   {: ._sec }
   ```
   This tells the `toc` that these `h2,h3` doms are the actual sections to be collected.

## Other Caveats

- When your inline equations don't render, try to escape special characters with `\`. For example, use `\|` instead of `|` and use `\\|` for `\|`. Here's a list of special characters:
   ```
   \_ \* \[ \] \( \) \{ \} \# \+ \- \. \! \> \| \\\ \" \' \~ \^ \= \:
   ```
- From my experience, you should always escape `|`, which by default creates a new column in table (I know that's very annoying).
- When you are sure the equation is enclosed by `$` but it doesn't render, try to escape `_` with `\_`, which denotes the italic text enclosed by it (e.g., `_italic_`). You can go to the most suspicious `_` in an equation (usually something like `_{XXX}`) and escape it.
- Display mode equations should be fine.