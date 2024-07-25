---
layout:     post
title:      "A dummy blog post"
date:       2024-05-29
published:  false
---
We can use `MathJax` for printing latex equations in the posts: use `$` for inline math delimiter, and `$$` for display math delimiter. For example, inline math like $x=\sqrt{y}$, or math equations like

$$
f(x) = \int_0^t g(t)\, dt.
$$

For Latex `align` environments, we need to use `\begin{aligned}` instead:
```
$$
\begin{aligned}
f(x) &= 2x^2 + x\\
&= x(2x+1).
\end{aligned}
$$
```

$$
\begin{aligned}
f(x) &= 2x^2 + x\\
&= x(2x+1).
\end{aligned}
$$

**Note:** Any other syntax should be the same as standard markdown: see this [documentation](https://www.markdownguide.org/basic-syntax/).

# Section 1

List:
- a
- b
- c

In the rare cases when we want to insert an image, we need can use 
```
![text](url)
```
Sor example, 
![sky](https://img.freepik.com/free-photo/nature-colorful-landscape-dusk-cloud_1203-5705.jpg?t=st=1717032420~exp=1717036020~hmac=26812c2c23997b969cc4140ee5dc2faae9c139732265b14956d7cae1383652f3&w=1480)
We can also upload images to the `_images` folder in the repo.