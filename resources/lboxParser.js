var id = 841;

async function loadSingle(url) {
  //     console.log(url);

  let resp = await fetch(url);

  let t = await resp.text();

  //     console.log(t);

  let parser = new DOMParser();
  let doc = parser.parseFromString(t, "text/html");

  const metas = doc.querySelectorAll("meta");

  let res = {};

  res.cast = [];
  res.directors = [];
  res.genres = [];
  res.id = id;

  const tagline = doc.querySelectorAll(".tagline")[0];

  if (tagline) {
    res.tagline = tagline.innerText;
  }

  const summary = doc.querySelectorAll(".review p")[0];

  if (summary) {
    res.summary = summary.innerText;
  }

  const textLink = doc.querySelectorAll("p.text-link")[0];

  if (textLink) {
    const textLinkStr = textLink.innerText.trim();
    res.runtime = textLinkStr.split(" ")[0];
  }

  const genreEls =
    doc.querySelectorAll("#tab-genres")[0]?.querySelectorAll("a") || [];

  for (var i = 0; i < genreEls.length; i++) {
    res.genres.push(genreEls[i].innerText);
  }

  const directorEls = doc
    .querySelectorAll("#tab-crew")[0]
    .querySelectorAll("div")[0]
    .querySelectorAll("a");

  for (var i = 0; i < directorEls.length; i++) {
    res.directors.push(directorEls[i].innerText);
  }

  try {
    const castEls = doc.querySelectorAll("#tab-cast")[0].querySelectorAll("a");

    for (var i = 0; i < castEls.length; i++) {
      res.cast.push(castEls[i].innerText);
    }
  } catch (e) {}

  for (var i = 0; i < metas.length; i++) {
    if (metas[i].name.indexOf("data2") > 0) {
      res.rating = metas[i].content.split(" ")[0];
    } else if (metas[i].name === "twitter:title") {
      res.title = metas[i].content.substr(0, metas[i].content.length - 7);
      res.year = metas[i].content.substr(metas[i].content.length - 5, 4);
    }
  }

  const filmPoster = doc.querySelectorAll(".film-poster img")[0];

  if (filmPoster) {
    res.poster = filmPoster.src;
  }

  const backdrop = doc.querySelectorAll(".backdrop-wrapper")[0];

  if (backdrop) {
    res.backdrop = backdrop.dataset.backdrop;
  }

  return res;
}

async function loadCurrentList() {
  let posters = document.getElementsByClassName("film-poster");

  if (!posters || !posters.length) {
    console.log("No posters");
    return;
  }

  //     let test = [posters[0]];
  let test = [...posters];

  let res = [];

  for (var i = 0; i < test.length; i++) {
    console.log(i);
    // if(i < 24) {
    //     continue;
    // }
    const poster = test[i];
    const a = poster.getElementsByClassName("frame")[0];

    try {
      const curr = await loadSingle(a.href);

      res.push(curr);

      id++;
    } catch (e) {
      id++;

      console.log("Error with " + a.href);
    }

    //         console.log(curr);

    //         console.log(a.href);
  }

  console.log(JSON.stringify(res));
}

loadCurrentList();
// loadSingle('https://letterboxd.com/film/psychos/').then(r => console.log(JSON.stringify(r)));
