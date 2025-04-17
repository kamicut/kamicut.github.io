//Based on Mykola Lysenko's http://0fps.net/2012/11/19/conways-game-of-life-for-curved-surfaces-part-1/
//and http://jsfiddle.net/mikola/aj2vq/
//Smoothlife parameters randomly generated on page load

"use strict";

//FFT based smooth life
var INNER_RADIUS = 1.32;
var OUTER_RADIUS = 3 * INNER_RADIUS;
var B1 = 0.258;
var B2 = 0.310;
var D1 = 0.180;
var D2 = 0.440;
var ALPHA_N = 0.038;
var ALPHA_M = 0.127;
var LOG_RES = 6;

//Coloring stuff
var color_shift = [0, 0, 0];
var color_scale = [254, 254, 254];

//Canvas elements
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
canvas.width = (1 << LOG_RES);
canvas.height = (1 << LOG_RES);

//Buffers
var field_dims = [(1 << LOG_RES), (1 << LOG_RES)];
var fields = new Array(2);
for (var i = 0; i < fields.length; ++i) {
  fields[i] = numeric.rep(field_dims, 0.0);
}
var imaginary_field = numeric.rep(field_dims, 0.0);
var current_field = 0;
var M_re_buffer = numeric.rep(field_dims, 0.0);
var M_im_buffer = numeric.rep(field_dims, 0.0);
var N_re_buffer = numeric.rep(field_dims, 0, 0);
var N_im_buffer = numeric.rep(field_dims, 0.0);


//Initialize kernel
function BesselJ(radius) {
  //Do this in a somewhat stupid way
  var field = numeric.rep(field_dims, 0.0);
  var weight = 0.0;
  for (var i = 0; i < field.length; ++i) {
    for (var j = 0; j < field.length; ++j) {
      var ii = ((i + field.length / 2) % field.length) - field.length / 2;
      var jj = ((j + field.length / 2) % field.length) - field.length / 2;

      var r = Math.sqrt(ii * ii + jj * jj) - radius;
      var v = 1.0 / (1.0 + Math.exp(LOG_RES * r));

      weight += v;
      field[i][j] = v;
    }
  }

  var imag_field = numeric.rep(field_dims, 0.0);
  fft2(1, LOG_RES, field, imag_field);
  return { re: field, im: imag_field, w: weight };
}

//Precalculate multipliers for m,n
var M_re, M_im, N_re, N_im;
(function () {
  var inner_bessel = BesselJ(INNER_RADIUS);
  var outer_bessel = BesselJ(OUTER_RADIUS);

  var inner_w = 1.0 / inner_bessel.w;
  var outer_w = 1.0 / (outer_bessel.w - inner_bessel.w);

  M_re = inner_bessel.re;
  M_im = inner_bessel.im;
  N_re = outer_bessel.re;
  N_im = outer_bessel.im;

  for (var i = 0; i < canvas.width; ++i) {
    for (var j = 0; j < canvas.height; ++j) {
      N_re[i][j] = outer_w * (N_re[i][j] - M_re[i][j]);
      N_im[i][j] = outer_w * (N_im[i][j] - M_im[i][j]);
      M_re[i][j] *= inner_w;
      M_im[i][j] *= inner_w;
    }
  }
})();


function sigma(x, a, alpha) {
  return 1.0 / (1.0 + Math.exp(-4.0 / alpha * (x - a)));
}

function sigma_2(x, a, b) {
  return sigma(x, a, ALPHA_N) * (1.0 - sigma(x, b, ALPHA_N));
}

function lerp(a, b, t) {
  return (1.0 - t) * a + t * b;
}

function S(n, m) {
  var alive = sigma(m, 0.5, ALPHA_M);
  return sigma_2(n, lerp(B1, D1, alive), lerp(B2, D2, alive));
}

function field_multiply(a_r, a_i, b_r, b_i, c_r, c_i) {
  for (var i = 0; i < field_dims[0]; ++i) {
    var Ar = a_r[i], Ai = a_i[i];
    var Br = b_r[i], Bi = b_i[i];
    var Cr = c_r[i], Ci = c_i[i];
    for (var j = 0; j < field_dims[1]; ++j) {
      var a = Ar[j];
      var b = Ai[j];
      var c = Br[j];
      var d = Bi[j];
      var t = a * (c + d);
      Cr[j] = t - d * (a + b);
      Ci[j] = t + c * (b - a);
    }
  }
}

//Applies the kernel to the image
function step() {

  //Read in fields
  var cur_field = fields[current_field];
  current_field = (current_field + 1) % fields.length;
  var next_field = fields[current_field];

  //Clear extra imaginary field
  for (var i = 0; i < field_dims[0]; ++i) {
    for (var j = 0; j < field_dims[1]; ++j) {
      imaginary_field[i][j] = 0.0;
    }
  }

  //Compute m,n fields
  fft2(1, LOG_RES, cur_field, imaginary_field);
  field_multiply(cur_field, imaginary_field, M_re, M_im, M_re_buffer, M_im_buffer);
  fft2(-1, LOG_RES, M_re_buffer, M_im_buffer);
  field_multiply(cur_field, imaginary_field, N_re, N_im, N_re_buffer, N_im_buffer);
  fft2(-1, LOG_RES, N_re_buffer, N_im_buffer);

  //Step s
  for (var i = 0; i < next_field.length; ++i) {
    for (var j = 0; j < next_field.length; ++j) {
      next_field[i][j] = S(N_re_buffer[i][j], M_re_buffer[i][j]);
    }
  }
}


//FFT
function fft(dir, m, x, y) {
  var nn, i, i1, j, k, i2, l, l1, l2;
  var c1, c2, tx, ty, t1, t2, u1, u2, z;

  /* Calculate the number of points */
  nn = x.length;

  /* Do the bit reversal */
  i2 = nn >> 1;
  j = 0;
  for (i = 0; i < nn - 1; i++) {
    if (i < j) {
      tx = x[i];
      ty = y[i];
      x[i] = x[j];
      y[i] = y[j];
      x[j] = tx;
      y[j] = ty;
    }
    k = i2;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }

  /* Compute the FFT */
  c1 = -1.0;
  c2 = 0.0;
  l2 = 1;
  for (l = 0; l < m; l++) {
    l1 = l2;
    l2 <<= 1;
    u1 = 1.0;
    u2 = 0.0;
    for (j = 0; j < l1; j++) {
      for (i = j; i < nn; i += l2) {
        i1 = i + l1;
        t1 = u1 * x[i1] - u2 * y[i1];
        t2 = u1 * y[i1] + u2 * x[i1];
        x[i1] = x[i] - t1;
        y[i1] = y[i] - t2;
        x[i] += t1;
        y[i] += t2;
      }
      z = u1 * c1 - u2 * c2;
      u2 = u1 * c2 + u2 * c1;
      u1 = z;
    }
    c2 = Math.sqrt((1.0 - c1) / 2.0);
    if (dir == 1)
      c2 = -c2;
    c1 = Math.sqrt((1.0 + c1) / 2.0);
  }

  /* Scaling for forward transform */
  if (dir == -1) {
    var scale_f = 1.0 / nn;
    for (i = 0; i < nn; i++) {
      x[i] *= scale_f;
      y[i] *= scale_f;
    }
  }
}

//In place 2D fft
function fft2(dir, m, x, y) {
  for (var i = 0; i < x.length; ++i) {
    fft(dir, m, x[i], y[i]);
  }
  for (var i = 0; i < x.length; ++i) {
    for (var j = 0; j < i; ++j) {
      var t = x[i][j];
      x[i][j] = x[j][i];
      x[j][i] = t;
    }
  }
  for (var i = 0; i < y.length; ++i) {
    for (var j = 0; j < i; ++j) {
      var t = y[i][j];
      y[i][j] = y[j][i];
      y[j][i] = t;
    }
  }
  for (var i = 0; i < x.length; ++i) {
    fft(dir, m, x[i], y[i]);
  }
}


//Extract image data
var image_data = ctx.createImageData(field_dims[0], field_dims[1]);
function draw_field() {
  var image_buf = image_data.data;
  var image_ptr = 0;

  var cur_field = fields[current_field];

  for (var i = 0; i < field_dims[0]; ++i) {
    for (var j = 0; j < field_dims[1]; ++j) {
      var s = cur_field[i][j];

      for (var k = 0; k < 3; ++k) {
        image_buf[image_ptr++] = 255 - Math.max(0, Math.min(255, Math.floor(color_shift[k] + color_scale[k] * s)));
      }
      image_buf[image_ptr++] = 255;
    }
  }
  ctx.putImageData(image_data, 0, 0);
}

//Initialize field to x
function clear_field(x) {
  var cur_field = fields[current_field];

  for (var i = 0; i < field_dims[0]; ++i) {
    for (var j = 0; j < field_dims[1]; ++j) {
      cur_field[i][j] = x;
    }
  }
}


//Place a bunch of speckles on the field
function add_speckles(count, intensity) {
  var cur_field = fields[current_field];

  for (var i = 0; i < count; ++i) {
    var u = Math.floor(Math.random() * (field_dims[0] - INNER_RADIUS));
    var v = Math.floor(Math.random() * (field_dims[1] - INNER_RADIUS));
    for (var x = 0; x < INNER_RADIUS; ++x) {
      for (var y = 0; y < INNER_RADIUS; ++y) {
        cur_field[u + x][v + y] = intensity;
      }
    }
  }
}

function check_empty() {
  var sum_counter = 0;
  var cur_field = fields[current_field];
  for (var i = 0; i < field_dims[0]; ++i) {
    for (var j = 0; j < field_dims[1]; ++j) {
      sum_counter += cur_field[i][j]
    }
  }
  return sum_counter;
}

clear_field(0);
add_speckles(1000, 1);
step();
draw_field();

setInterval(function () {
  if (check_empty() < 1) {
    var B1 = 0.258;
    var B2 = 0.310;
    var D1 = 0.180;
    var D2 = 0.440;

    add_speckles(1000, 1);
  }
}, 1000)

setInterval(function () {
  step();
  draw_field();
}, 60);