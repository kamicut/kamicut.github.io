---
layout: post
title:  "Convolution in Conway's Game of Life"
date:   2014-05-29 22:34:11
categories: julia
---

While looking at [this][notebooks] page on notable iPython notebooks, I [stumbled][technique] on the interesting technique of using convolution for computing the nearest neighbor matrix of Conway's Game of Life. 

Image filters are usually used to compute transformations such as blurring and sharpening. We pass a `kernel` over every pixel that computes the new image pixel based on its surroundings. For the game of life, if we treat the current state of the board as an image, we can pass a particular filter that will compute the neighbors around each pixel.

This is a particularly elegant way of representing the transition between states. We can take advantage of the Fast Fourier Transform in image processing libraries to concisely write an implementation of GOL. 

Here's my implementation in Julia:

{% highlight julia %}
using Base.Graphics
using Cairo
using Tk
using Images

# Use an image filter to compute neighbors
function evolve(grid)
    neighbors = imfilter(grid, [1 1 1; 1 9 1; 1 1 1]);
    ((neighbors .== 11) | (neighbors .==12) | (neighbors .==3)) & 1
end

# Creates an NxN board for `iter` generations
function iterate(N::Int, iter::Int, sparse::Float64 = 0.1)
	win = Toplevel("Game of Life", N, N)
	c = Canvas(win)
	pack(c, expand=true, fill="both")
	ctx = getgc(c)

    grid = (rand(N,N) .< sparse) & 1;
    for i=1:iter
        grid = evolve(grid)
        buf = uint32color(grid .* 255)
        image(ctx,CairoRGBSurface(buf), 0, 0, N, N)
        reveal(c)
        Tk.update();
    end
end

# Create a 500x500 board for 500 generations
iterate(500,500)
{% endhighlight %}

While `imfilter` doesn't necessarily use `fft` internally, my next task is to run benchmarks on different ways of computing the neighbors matrix. 

The code can be found [here][implementation], and I'm always open for pull requests! 

[notebooks]: https://github.com/ipython/ipython/wiki/A-gallery-of-interesting-IPython-Notebooks
[technique]: http://nbviewer.ipython.org/gist/jiffyclub/3778422
[implementation]: https://github.com/kamicut/gol-julia/
