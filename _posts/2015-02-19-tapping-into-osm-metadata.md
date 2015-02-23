---
title: "Tapping into OpenStreetMap Metadata"
layout: post
date: 2015-02-19 18:00
categories: osm, metadata, open data, jq, npm
---
*This post was first published on the [Development Seed Blog](http://developmentseed.org/blog/2015/02/19/tapping-into-osm-metadata/)*

At Development Seed, we just launched [v0.1 of a new tool](https://github.com/osmlab/osm-meta-util) to tap into OpenStreetMap changeset metadata. We built the tool in partnership with the American Red Cross as part of the infrastructure for tracking efforts such as [#MissingMaps](http://www.missingmaps.org/).

[OpenStreetMap changesets](http://wiki.openstreetmap.org/wiki/Changeset) give us access to a wealth of metadata information that is not specifically geographic but incredibly rich. Metadata is helpful in understanding the changing nature of OSM. This is different from using geographic APIs like [Overpass](https://github.com/drolbr/Overpass-API) because metadata contains commit text, number of edits, which editor was used, etc. With metadata, we can [track hashtags](http://resultmaps.neis-one.org/osm-missingmaps), analyze commit text or aggregate user metrics.

In 2014 alone, users committed over 6 million changesets to OSM. As OpenStreetMap's metadata grows, dealing with the sheer amount can be daunting. We built [osm-meta-util](https://github.com/osmlab/osm-meta-util) as an experiment in making OSM metadata easier and faster to use.

![Running the utility]({{ site.url }}/images/gifs/osm-meta.gif)

osm-meta-util focuses on two core functions: downloading the minutely compressed metadata files and serializing into JSON. We convert compressed OSM XML files containing multiple commits to a stream of JSON objects that can be piped to any tool or API. 

You can use the library in a Node application or as a command-line utility to download all the data between two dates: 

```javascript
MetaUtil({
    'start': process.argv[2],
    'end': process.argv[3],
    'delay': process.argv[4]
}).pipe(process.stdout)
```

In combination with [jq](https://stedolan.github.io/jq/), to get a commit history we can simply run: 

```sh
node app 001181708 001181721 1000 | jq -c '{date: .created_at, text: .comment}'
```

If you don't give the tool any parameters, it will get the latest changesets and update every minute.

We're using this utility to experiment building a metadata API with the American Red Cross. But we know there are many more uses of the rich OSM metadata and want to see what others can do with the tool. Together with the American Red Cross we've put this on [OSM Lab](https://github.com/osmlab), a Github organization for OSM related projects. Follow the development of osm-meta-util on [Github](https://github.com/osmlab/osm-meta-util). 
