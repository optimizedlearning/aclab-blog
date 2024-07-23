---
layout: post
title: "Kernel Mean Embedding"
author: "Qinzi Zhang"
date: 2024-06-12
use_toc: true
use_macro: true
---

<div style="display:none">
$
\newcommand{\sign}{\mathop{\mathrm{sgn}}}
$
</div>

The kernel method has been a popular technique widely used in machine learning literature. The kernel mean embedding extends the classical kernel method and measures similiarity of *probability distributions* instead of simply data points. This post provides a brief overview of the classical kernel method and the kernel mean embedding, mainly based on Chapter 2 and 3 in this [survey](https://arxiv.org/abs/1605.09522). Readers who are interested in more details can refer to the survey and this [lecture](https://mva-kernel-methods.github.io/course-2022-2023/lectures/).

## Kernel and RKHS
{: ._sec }

### A Motivating Example
{: ._sec }

In some machine learning algorithms, we only care about the inner products of form $\langle \w, \x\rangle$. For example, let's consider the binary classification problem: given a sequence of sample datas $\\{\x_i,y_i\\}_{i=1}^n$ we aim to predict the label of $\x_i$. A simple model to solve this problem is the *perceptron algorithm*. Given parameter $\w$ and bias $b$, the perceptron model outputs the prediction of form

$$o(\x;\w, b) = \sign(\w^T\x + b).$$

The perceptron algorithm is only capable of identifying a *linear* decision boundary, namely the hyperplane defined as

$$\{\x : \w^T\x + b = 0\}.$$

When the dataset is not linearly separable, such a linear decision boundary cannot perfectly separate the sample data. Consequently, we would like to increase the "richness" of the perceptron model beyond linear classifiers. 

To this end, a common technique is to kernelize the perceptron model. Let $\calX$ be the data space, and let $\phi: \calX\to\calF$ be the *feature map* that maps from the data space to a potentially high-dimensional feasure space $\calF$. We then replace the inner product $\langle \w,\x\rangle$ in data space by the inner product $\langle \phi(\w),\phi(\x) \rangle _\calF$ in the feature space (for now let's assume $\calF$ has a valid inner product operation). The kernelized perceptron model then predicts

$$o(\x;\w,b) = \sign(\langle \phi(\w), \phi(\x)\rangle _\calF + b).$$

Intuitively, the higher-dimensional $\calF$ is, the more "richness" the kernelized model has. As an illustrative example, let $\calX=\RR^2, \calF=\RR^2$ and $\phi(\x) = (x_1^3, x_2)$. The linear perceptron with $\w=(-1,1), b=0$ has a linear deicision boundary

$$x_1=x_2.$$

However, the kernelized perceptron has a non-linear boundary defined as

$$\langle \phi(\w), \phi(\x)\rangle _\calF = -x_1^3 + x_2 = 0 \iff x_2 = x_1^3.$$

![perceptron decison boundary](../../../assets/images/20240612/perceptron.png)
*Decision boundary of linear perceptron (left) and kernelized perceptron (right).*

---

### The Kernel Trick
{: ._sec }

In the previous example, we saw that we can increase the complexity of a model by lifting the inner product in the original data space to a feature space. However, this involves two steps: firstly we need to compute the feature map $\phi(\w), \phi(\x)$, and secondly we need to compute the inner product in $\calF$. In particular, when $\calF$ is high-dimensional (or even infinite-dimensional), the computation complexity would be very high. 

A typical solution is the so-called *kernel trick*. Given any feature map $\phi:\calX\to\calF$, we can define

$$
\begin{aligned}
    k: &\calX\times\calX \to \RR, \\
    &(\x,\y) \mapsto \langle \phi(\x), \phi(\y) \rangle _\calF.
\end{aligned}
$$

$k$ is called a *kernel function*. Intuitively, a kernel function is a similarity measure that measures the inner product of $\x,\y$ in the feature space. More importantly, as we will later show, if a kernel $k$ is *positive definite*, then there always exists an implicit feature map $\phi:\calX\to\calF$ such that $k$ is induced by $\phi$, i.e., $k(\x,\y) = \langle \phi(\x),\phi(\y) \rangle _\calF$. This suggests that so long as we have a positive definite kernel, we don't need to know the explicit formula of the corresponding feature map! Indeed, we can simply use $k(\x,\y)$ in lieu of $\langle \x,\y\rangle$.

{% capture pd-kernel %}
A kernel $k:\calX\times \calX\to\RR$ is *positive definite* if
1. $k$ is symmetric, i.e., $k(\x,\y) = k(\y,\x)$;
2. for any $n\in\NN$ and any sequence $\x_1,\ldots,\x_n\in\calX, c_1,\ldots,c_n\in\RR$,

$$\sum_{i,j=1}^n c_ic_jk(\x_i,\x_j) \ge 0.$$
{% endcapture %}
{% include definition.html title="Positive Definite Kernel" content=pd-kernel %}

Although it's not trivial to prove any positive definite kernel is induced by some implicit feature map, the converse is straightforward.

{% capture prop-1 %}
If $k(\x,\y) = \langle \phi(\x),\phi(\y) \rangle _\calF$ for some $\phi:\calX\to\calF$, then $k$ is positive definite.
{% endcapture %}
{% include theorem.html type="Proposition" content=prop-1 %}

The proof is quite straightforward: for any $c_1,\ldots,c_n,\x_1,\ldots,\x_n$

$$
\begin{aligned}
    \sum_{i,j=1}^n c_ic_j k(\x,\y)
    &= \sum_{i,j=1}^n c_ic_j \langle \phi(\x),\phi(\y) \rangle _\calF 
    = \left\langle \sum_{i=1}^n c_i\phi(\x_i), \sum_{j=1}^n c_j\phi(\x_j) \right\rangle _\calF 
    = \left\| \sum_{i=1}^n c_i\phi(\x_i) \right\| _\calF \ge 0.
\end{aligned}
$$

**Examples of popular kernels**

A few commonly used kernels include 

- the Gaussian kernel

$$k(\x,\y) = \exp\left( - \frac{\|\x-\y\|_2^2}{2\sigma^2} \right),$$

- the Laplace kernel

$$k(\x,\y) = \exp\left( - \frac{\|\x-\y\|_1}{\sigma} \right),$$

- the family of translation-invariant kernels

$$k(\x, \y) = \psi(\x-\y),$$

- and the family of radial kernels

$$k(\x, \y) = \psi(\|\x-\y\|).$$

---

### Reproducing Kernel Hilbert Space (RKHS)
{: ._sec }

An important concept related to kernels is the reproducing kernel Hilbert space (or RKHS for short). At a high level, an RKHS is a Hilbert space that is uniquely associated with a positive definite kernel. Before introducing RKHS, we first define a Hilbert space.

{% capture hilbert-space %}
A *Hilbert space* $\calH$ is a vector space, equipped with inner product $\langle \cdot,\cdot\rangle _\calH$, that is complete w.r.t. the induced norm $\\|\cdot\\|\_\calH$.
{% endcapture %}
{% include definition.html title="Hilbert Space" content=hilbert-space %}

Here the induced norm is defined as $\\|\cdot\\|\_\calH = \sqrt{\langle \cdot,\cdot\rangle _\calH}$. Intuitively, we say $\calH$ is a *complete topological space* if any sequence in $\calH$ that "seems to converge" must has a limit (formally, we require every Cauchy sequence to be convergent). For example, $(0,1)$ is not complete because the sequence $\\{0.9, 0.99, 0.999, \ldots\\}$ should converge to $1$, but $1\not\in (0,1)$.

Now we are ready to formally define RKHS.

{% capture RKHS %}
Let $\calX$ be an arbitrary set and let $\calH$ be a Hilbert space of functions $f:\calX\to\RR$. For each $\x\in\calX$, define the *evaluation functional at $\x$* as

$$
\begin{aligned}
    \calF_\x: &\calH \to \RR,\\
    &f \mapsto \calF_\x[f] = f(\x).
\end{aligned}
$$

Then $\calH$ is a reproducing kernel Hilbert space if $\calF_\x$ is bounded for all $\x\in \calX$, i.e., for every $\x$, there exists $C>0$ such that

$$|f(\x)| \le C\|f\|_\calH, \ \forall f\in\calH.$$
{% endcapture %}
{% include definition.html title="Reproducing Kernel Hilbert Space" content=RKHS %}

To illustrate the concept of RKHS, let's consider the following example. Let $\calX$ be an arbitrary data space, $\phi:\calX\to\RR^d$, and let $\calH = \\{f_\w: \w\in\RR^d\\}$ where

$$
\begin{aligned}
    f_\w: &\calX \to \RR, \\
    &\x \mapsto \langle \w, \phi(\x) \rangle.
\end{aligned}
$$

We can observe that $\calH$ is isomorphic to $\RR^d$. Since $\RR^d$ itself is a Hilbert space, so is $\calH$ with inner product

$$\langle f_\w, f_{\w'} \rangle _\calH = \langle \w,\w' \rangle.$$

In particular, the induced norm is 
$$\|f_\w\|_\calH = \sqrt{\langle f_\w, f_\w \rangle _\calH} = \sqrt{\langle \w, \w\rangle} = \|\w\|.$$

Next, we can show that $\calH$ is indeed an RKHS. For each $\x\in\calX$, the evaluation functional is defined as 

$$\calF_\x[f_\w] = f_\w(\x) = \langle \w,\x \rangle.$$

We can easily show every $\calF_\x$ is bounded: for each $\x$, let $C=\\|\x\\|$, then by Cauchy-Schwarz' inequality,

$$\lvert f_\w(\x) \rvert \le \|\x\| \|\w\| = C\|f_\w\|_\calH.$$


**Riesz Representation Theorem and Reproducing Property**

Now we are ready to introduce the reproducing property, a key property of RKHS. First, we introduce Riesz representation theorem, which builds a correspondence between the data space $\calX$ and a RKHS $\calH$.

{% capture riesz-thm %}
Let $\calH$ be a real Hilbert space, and let $\calL:\calH\to\RR$ be a bounded linear functional. Then there exists a unique $f_\calL\in\calH$ such that

$$\calL[g] = \langle g, f_\calL \rangle _\calH.$$
{% endcapture %}
{% include theorem.html title="Riesz Representation Theorem" content=riesz-thm %}

Recall the previous example. We have shown that the evaluation functional $\calF_\x$ is a bounded linear operator all all $\x\in\calX$. Therefore, by Riesz representation theorem, every $\calF_\x$ corresponds to a unique element in $\calH$, which we will denote as $k_\x$ (instead of $f_{\calF_\x}$ for simplicity) such that 

$$\calF_\x[f_\w] = \langle f_\w, k_\x \rangle _\calH.$$

Since $k_\x\in\calH$, it must have the form of $k_\x = f_{\w'}$ for some $\w'\in\RR^d$.
On the other hand, by definition of the evaluation functional, we know $\calF_\x[f_\w] = f_\w(\x) = \langle \w, \phi(\x) \rangle$. Hence, we derive the exact formula of $k_\x$, which is $k_\x = f_{\phi(\x)}$. In other words, each $\x\in\calX$ uniquely corresponds to the function $f_{\phi(\x)} \in \calH$.

In general, we cannot expect to find the exact formula of $k_\x$. However, the same result holds: every $\x\in\calX$ corresponds to a unique $k_\x\in\calH$ such that

$$f(\x) = \langle f, k_\x \rangle _\calH, \ \forall f\in\calH.$$

This identity is called the *reproducing property* of a RKHS.

Now let's take one step further. Consider a feature map $\psi:\calX\to\calH$ defined as $\psi(\x) = k_\x$ (be careful not to confuse with $\phi:\calX\to\RR^d$ in the previous example). We often call $\psi$ the *canoical feature map*, and the kernel induced by $\psi$ is called the *reproducing kernel* of the RKHS $\calH$, namely

$$k(\x,\y) = \langle \psi(\x), \psi(\y) \rangle _\calH = \langle k_\x, k_\y \rangle _\calH.$$

Since each $\x,\y$ correspond to a unique pair of $k_\x, k_\y$, the reproducing kernel is unique. Moreover, as we see earlier, since $k$ is induced by the canonical feature map, it is also positive definite. The converse also holds: every positive definite kernel corresponds to a unique RKHS, whose proof can be found in [Aronszajn (1950)](https://members.cbio.mines-paristech.fr/~jvert/svn/bibli/local/Aronszajn1950Theory.pdf).

To conclude this section, we have the following properties of RKHS:

{% capture rkhs-property %}
- Every RKHS has a unique positive definite reproducing kernel, and every positive definite kernel uniquely corresponds to a RKHS.
- Reproducing property: \\
    Every $\x\in \calX$ uniquely corresponds to $k_\x\in\calH$ such that $k_\x(\y) = k(\x,\y)$ and
    
$$f(\x) = \langle f, k_\x \rangle _\calH, \ \forall f\in\calH.$$

- The kernel trick: \\
    The reproducing kernel of $\calH$ is defined as

$$k(\x,\y) = \langle k_\x, k_\y \rangle _\calH.$$
{% endcapture %}
{% include theorem.html type="Proposition" title="Properties of RKHS" content=rkhs-property %}

---

## Kernel Mean Embedding
{: ._sec }
