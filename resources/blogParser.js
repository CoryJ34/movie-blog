var lastID = 844;
var lastTitle =
  "Halloween 2025 #4 – Early Folk Horror – The Legend of Hillbilly John (1974)";
var getMetaPosts = false;
var formatForAWS = true;

async function loadMovie(url) {
  let resp = await fetch(url);

  let t = await resp.text();

  let parser = new DOMParser();
  let doc = parser.parseFromString(t, "text/html");

  const entryContent = doc.querySelector(".entry-content");
  const paragraphs = entryContent.children;

  let res = [];

  for (let i = 0; i < paragraphs.length; i++) {
    if (
      paragraphs[i].innerHTML.indexOf("cookie-widget") > 0 ||
      paragraphs[i].innerHTML.indexOf("__ATA.cmd.push") > 0 ||
      paragraphs[i].innerHTML.indexOf("wordads-ad-title") > 0
    ) {
      break;
    }
    res.push(paragraphs[i].innerHTML);
  }

  return res;
}

async function getData() {
  const extractTitleAndYear = (rawTitle) => {
    const lastOpenParen = rawTitle.lastIndexOf("(");
    return [
      rawTitle.substr(0, lastOpenParen),
      rawTitle.substr(lastOpenParen, rawTitle.length - 1),
    ];
  };

  const getRawYear = (year) => {
    return parseInt(year.substr(1, 5), 10);
  };

  let moviePosts = getMetaPosts
    ? document.getElementsByClassName("type-post")
    : document.getElementsByClassName("post-has-image");
  // let moviePosts = document.getElementsByClassName('type-post');
  let allData = [];

  for (let i = 0; i < moviePosts.length; i++) {
    if (getMetaPosts && moviePosts[i].className.indexOf("has-image") > 0) {
      continue;
    }
    let currentMovie = {};
    let parsedData = {};

    const firstAnchor = moviePosts[i].getElementsByTagName("a")[0];
    currentMovie.originalTitle = moviePosts[i]
      .getElementsByClassName("entry-title")[0]
      .innerText.trim();

    if (!getMetaPosts) {
      if (currentMovie.originalTitle.indexOf(lastTitle) >= 0 || i === 7) {
        break;
      }

      const parts = currentMovie.originalTitle.split("–");
      // change this for no subCategory
      const titleAndYear = extractTitleAndYear(parts[2].trim());

      parsedData = {
        title: titleAndYear[0],
        rawYear: getRawYear(titleAndYear[1]),
        year: titleAndYear[1],
        category: "Halloween 2025",
        categoryCls: "halloween2025",
        order: parts[0].split("#")[1],
        subCategory: parts[1].trim(),
      };

      currentMovie.img = firstAnchor.getElementsByTagName("img")[0].src;
    }
    currentMovie.content = await loadMovie(firstAnchor.href);
    currentMovie.date =
      moviePosts[i].getElementsByClassName("entry-date")[0].innerText;

    currentMovie = {
      ...currentMovie,
      ...parsedData,
    };

    if (getMetaPosts) {
      if (formatForAWS) {
        const item = {
          M: {
            Title: {
              S: currentMovie.originalTitle,
            },
            Date: {
              S: currentMovie.date,
            },
            Content: {
              L: currentMovie.content.map((c) => {
                return {
                  S: c,
                };
              }),
            },
          },
        };
        console.log(i);
        allData.push(item);
      } else {
        const item = {
          title: currentMovie.originalTitle,
          date: currentMovie.date,
          content: currentMovie.content,
        };
        console.log(i);
        allData.push(item);
      }
    } else {
      console.log(i);
      allData.push(currentMovie);
    }
  }

  var currID = lastID + 1;
  for (var i = allData.length - 1; i >= 0; i--) {
    allData[i].id = currID;
    currID++;
  }

  //     const single = await loadMovie('https://einysrentals.wordpress.com/2021/03/20/genres-fun-adventures-5-bill-and-ted-face-the-music-2020/');
  if (getMetaPosts) {
    console.log(JSON.stringify(allData));
  } else {
    console.log(JSON.stringify(allData[0]));
  }
  console.log(
    `var lastID = ${allData[0].id}; var lastTitle = '${allData[0].originalTitle}';`
  );
}

getData();
