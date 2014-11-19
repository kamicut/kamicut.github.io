---
layout: post
title:  "Using jq with nested objects"
date:   2014-11-19 13:25:00
categories: jq, data, webdev
---

[jq](https://stedolan.github.io/jq/) is a tool that we use at [Development Seed](http://developmentseed.org) when processing data at the command line for quick bash scripts. It has really powerful features for transforming, extracting and filtering JSON. It's good as a pipe into [json2csv](https://github.com/jehiah/json2csv), or another bash or python script. Handling nested data is however not very well documented. The following assumes that you've played around with `jq` or are at least familiar with it, because we'll get into some of its more obtuse syntax. 

The manual for `jq` is [here](http://stedolan.github.io/jq/manual/) and I encourage you to try out the examples in the [jq playground](https://jqplay.org/) with some of your own data!

## Record lists vs Nested objects

A nested object looks like this:
```javascript
{
  "BGD": {
    "gini": 32.12,
    "gni": 900,
    "score": 27.9998603966,
    "rank": 63
  },
  "EGY": {
    ...
  }
}
```

This is useful for iteration in the case of `for (key in country_list)` type of iteration, but might be less suited for different types of `groupBy` or aggregation functions. A record list keeps the key within the record itself:

```javascript
[
  {
    "gni": 900,
    "gini": 32.12,
    "score": 27.9998603966,
    "rank": 63,
    "country": "BGD"
  },
  ...
]
```

## Transforming data

As an example of a transformation, we want to remove the score and rank attributes from this JSON object and keep `gni` and `gini`. If the data were in the form of a record list, this would be a simple task in `jq`.

### Record list

```javascript
[
  {
    "gni": 900,
    "gini": 32.12,
    "score": 27.9998603966,
    "rank": 63,
    "country": "BGD"
  },
  {
    "gni": 3160,
    "gini": 30.75,
    "score": 28.9820812676,
    "rank": 60,
    "country": "EGY"
  },
  {
    "gni": 85550,
    "gini": "",
    "score": 38.0079623912,
    "rank": 54,
    "country": "QAT"
  }
]
```

To remove the two attributes we would simply do: 

```
map({country: .country, gni: .gni, gini: .gini})
```

The `map` function takes each element in a `list` and creates a new object according to the argument you specify.

### Nested object 

```javascript
{
    "QAT": {
        "gni": 85550,
        "gini": "",
        "score": 38.0079623912,
        "rank": 54
    },
    "EGY": {
        "gni": 3160,
        "gini": 30.75,
        "score": 28.9820812676,
        "rank": 60
    },
    "BGD": {
        "gni": 900,
        "gini": 32.12,
        "score": 27.9998603966,
        "rank": 63
    }
}
```

In this case we have to do:

```
to_entries | map(.value |= {gini:.gini, gni:.gni}) | from_entries
```
or use the shorthand
```
with_entries(.value |= {gini:.gini, gni:.gni})
```

Here, `to_entries` turns the nested object into a `list` of the following form (Note the explicit `key` and `value` attributes):
```javascript
[
  {
    "key": "BGD",
    "value": {
      "gini": 32.12,
      "gni": 900,
      "score": 27.9998603966,
      "rank": 63
    }
  },
  ...
]
```

We then `map` the elements into corresponding objects, keeping the `key, value` structure. Finally, we do the inverse operation `from_entries` to turn the list back into our nested object. 

## From one format to another

As an additional example, it is useful to look at the operations that turn the nested object structure into a collection and vice-versa. 

### From nested object to record list

``` javascript
{
  "BGD": {
    "gini": 32.12,
    "gni": 900,
    "score": 27.9998603966,
    "rank": 63
  },
  "EGY": {
    "gini": 30.75,
    "gni": 3160,
    "score": 28.9820812676,
    "rank": 60
  },
  "QAT": {
    "gini": "",
    "gni": 85550,
    "score": 38.0079623912,
    "rank": 54
  }
}
```

We use the `to_entries` function once again, combined with a map: 

```
to_entries  | map({country: .key, gni: .value.gni, gini: .value.gini, score: .value.score, rank: .value.rank})
```


### From record list to nested object

```javascript
[
  {
    "gni": 900,
    "gini": 32.12,
    "score": 27.9998603966,
    "rank": 63,
    "country": "BGD"
  },
  {
    "gni": 3160,
    "gini": 30.75,
    "score": 28.9820812676,
    "rank": 60,
    "country": "EGY"
  },
  {
    "gni": 85550,
    "gini": "",
    "score": 38.0079623912,
    "rank": 54,
    "country": "QAT"
  }
]
```

Here we first map each record to its nested structure to obtain a list of nested objects, and then we take advantage of the jq `add` function which in this case, serves as object concatenation. 

```
map({(.country): {gini:.gini, gni: .gni, score: .score, rank: .rank}}) | add
```

## Conclusion
`jq` is a pretty powerful tool as part of a data toolchain, and can handle a ton of JSON operations, but it's sometimes hard to figure out due to its complexity. Hopefully this small guide will help you with nested to flat record conversions in the future.
