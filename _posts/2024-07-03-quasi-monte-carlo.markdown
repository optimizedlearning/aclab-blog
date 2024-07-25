---
layout: post
title:  "Quasi Monte Carlo"
date:   2024-07-03 20:24:26 -0400
---


This topic addresses numerical integration in multiple dimensions $\mathbb{R}^s$ in the format of 

$$I_s(f):= \int_{[0,1]^s} f(\mathbf{x}) \, d \mathbf{x} $$

Quasi-Monte Carlo is one of the methods to approximate such integrals. This format of integration plays an essential role in evaluating solutions to certain Partial Differential Equations and in computing expectations of random variables. The latter application is more intriguing than it might seem, as it is non-obviously related to learning problems involving Gaussian Kernels.

Numerical integration typically involves selecting $n$ evaluation points ${\mathbf{x}_1, \cdots, \mathbf{x}_n} \subset [0,1]^s$ and then computing a value $Q_{s, n}(f) \approx I_s(f)$ using those $n$ evaluation points.

In this post, we will introduce three rules for selecting evaluation points for $n$ evaluations and their approximation error, which is roughly in the format of $| Q_{s, n}(f) - I_s(f)|$
- Classical Numerical Integration $O(\frac{1}{n^{1/s}})$
- Monte Carlo $ O(\frac{1}{\sqrt{n}}) $
- Quasi-Monte Carlo $O(\frac{(\log n)^s}{n} )$

## Classical Numerical Integration

### 1 Dimensional Problem
Let's begin with the fundamental problem of integration in a 1-dimensional space $(s = 1)$:
$$I_s(f):= \int_{0}^1 f(x) \, d x $$

The most naive approach is analogous to the Riemann integral upper approximation: selecting $n$ equally spaced points in the interval $[0,1]$ with width $w_i = \frac{1}{n}$ and approximating the area under the curve with the sum of rectangles defined by those evaluation points, as depicted below:
![var_dependent](../../../assets/images/20240703/numerical_1d.png)
In this way, the approximation to $I_s(f)$ is
$$Q_{s,n} =  \sum_{i=0 }^{n-1} w_i f(x_i) \frac{1}{n} \sum_{i=0 }^{n-1} f(x_i)$$
The approximation error arises from possibly overestimating or underestimating the area under the curve between two adjacent evaluation points by a rectangle. By uniformly bounding the error from local triangles, we get:
$$| Q_{s, n}(f) - I_s(f)| \le \frac{\max_{x \in[0,1]} |f'(x)|}{2n } = O(\frac{1}{n})$$

There are different methods for selecting those evaluation points with higher-order information about $f$ can achieve $O(\frac{1}{n^2}), O(\frac{1}{n^4})$, etc. However, since our ultimate goal is to consider $s > 1$, and those methods do not easily generalizes to higher dimensions and requires higher order information of $f$, we will not consider them in this post.

Overall, numerical integration in 1-dimension is very well studied. Given the regularity of $f$, we can select the best way to choose evaluation points for an accurate integral approximation where the error only depends on $s$. Let's move on to the higher-dimensional case!

### Multi-dimensional Problem
Now we consider the case of $s > 1$. Analogous to the 1-dimensional case, with $n$ evaluation points, we are essentially estimating $I_s(f)$ by computing the volume of hyper-rectangles:  
$$ \begin{align}I_s(f)& := \int_{0}^{1} \cdots \int_{0}^{1}  f(x_1, \cdots, x_s) \, d x_1 \cdots d x_s  \\
        & \approx \sum_{i_1=0}^{n-1} \cdots \sum_{i_s=0}^{n-1} w_{i_1} \cdots w_{i_s}  f(x_{i_1}, \cdots, x_{i_s}) \\
        & = \underbrace{\sum_{i_1=0}^{n-1}  w_{i_1}  \cdots \underbrace{ \sum_{i_{s-1}=0}^{n-1} w_{i_{s-1}} \underbrace{\sum_{i_s=0}^{n-1} w_{i_s}  f(x_{i_1}, \cdots, x_{i_s})}_{n \text{ evaluation}} }_{n^2 \text{ evaluation}}}_{n^s \text{ evaluation}} := Q_{s, n} (f) \end{align}$$
Since this approximation totally consists of $n^s$ function evaluations, we have 
$$| Q_{s, n}(f) - I_s(f)| \le O(\frac{1}{n^{1/s}})$$

As dimension increase, the approximation error $\rightarrow O(1)$. This means the classical method drastically deteriorates as dimensionality increases. 

## Monte Carlo






