# Aclab Blog Website

This is a website built with [Jekyll](https://jekyllrb.com/) to post blogs related to papers, readings, etc.

### Usage

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

And here's how you'd upload it:
1. You can directly go to `_posts/` directory in GitHub and manually upload your markdown.
2. Or you can clone this repo `git clone https://github.com/optimizedlearning/aclab-blog.git` and sync the new post via git.
