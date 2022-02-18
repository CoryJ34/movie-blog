import movieData from "../data/test-data";
import lboxData from "../data/lbox-data";
import TitleBreakout from "../../../client/src/models/TitleBreakout";
import { extractRating } from "../utils/TransferUtils";
import Cache from "./Cache";
import {
  dynamodb,
  getFloat,
  getInt,
  getString,
  getStringArray,
} from "./RepositoryCommons";
import categoryMeta from "../data/category-meta";
import mmData from "../data/march-madness-data";

const existingCats = [
  {
    order: 3,
    hexColor: "#0a7421",
    route: "/gamera",
    cls: "gamera",
    type: "Simple",
    name: "Gamera",
    remarks: categoryMeta["Gamera"],
  },
  {
    order: 4,
    hexColor: "#501849",
    route: "/randomizer",
    cls: "randomizer",
    type: "Simple",
    name: "Randomizer",
    remarks: categoryMeta["Randomizer"],
  },
  {
    order: 5,
    hexColor: "#243199",
    route: "/marchmadness",
    cls: "marchmadness",
    type: "Bracket",
    name: "March Madness",
    remarks: categoryMeta["March Madness"],
  },
  {
    order: 6,
    hexColor: "#4a4a4e",
    route: "/genres",
    cls: "genres",
    type: "SubCategory",
    name: "Genres",
    remarks: categoryMeta["Genres"],
    subCategories: [
      {
        name: "Old Westerns",
        size: 5,
        hexColor: "#333",
      },
      {
        name: "Fun Adventures",
        size: 5,
        hexColor: "#333",
      },
      {
        name: "Serious Sci-Fi",
        size: 5,
        hexColor: "#333",
      },
      {
        name: "Classic Action",
        size: 5,
        hexColor: "#333",
      },
      {
        name: "Heavy Drama",
        size: 5,
        hexColor: "#333",
      },
    ],
  },
  {
    order: 7,
    hexColor: "#4a005c",
    route: "/finishtheserieshorror",
    cls: "finish_the_series_horror",
    type: "Simple",
    name: "[Horror] Finish the Series",
    remarks: categoryMeta["[Horror] Finish the Series"],
  },
  {
    order: 8,
    hexColor: "#294429",
    route: "/decadesofhorror",
    cls: "decades_of_horror",
    type: "Simple",
    name: "Decades of Horror",
    remarks: categoryMeta["Decades of Horror"],
  },
  {
    order: 9,
    hexColor: "#3c9682",
    route: "/finishtheseriesnonhorror",
    cls: "finish_the_series_nonhorror",
    type: "Simple",
    name: "[Non-Horror] Finish the Series",
    remarks: categoryMeta["[Non-Horror] Finish the Series"],
  },
  {
    order: 10,
    hexColor: "#b62f6e",
    route: "/genresampler",
    cls: "genresampler",
    type: "Simple",
    name: "Genre Sampler",
    remarks: categoryMeta["Genre Sampler"],
  },
  {
    order: 11,
    hexColor: "#a02500",
    route: "/halloween2021",
    cls: "halloween_2021",
    type: "SubCategory",
    name: "Halloween 2021",
    subCategories: [
      {
        name: "Godzilla",
        size: 10,
        hexColor: "#2a5",
      },
      {
        name: "Exploitation",
        size: 5,
        hexColor: "#52113e",
      },
      {
        name: "Universal",
        size: 5,
        hexColor: "#333",
      },
      {
        name: "Horror Pack",
        size: 5,
        hexColor: "#092e50",
      },
      {
        name: "80s Slashers",
        size: 10,
        hexColor: "#440e0e",
      },
      {
        name: "Paul Naschy",
        size: 5,
        hexColor: "#380834",
      },
      {
        name: "Giallo",
        size: 5,
        hexColor: "#fdf91e",
        fontHexColor: "#000",
      },
      {
        name: "Vincent Price",
        size: 5,
        hexColor: "#ec6a13",
        fontHexColor: "#000",
      },
    ],
    remarks: categoryMeta["Halloween 2021"],
  },
  {
    order: 12,
    hexColor: "#316623",
    route: "/daysoflistmas",
    cls: "days_of_listmas",
    type: "SubCategory",
    name: "Days of Listmas",
    subCategories: [
      {
        name: "80s Slashers",
        size: 8,
        hexColor: "#440e0e",
      },
      {
        name: "Crime & Action",
        size: 7,
        hexColor: "#081133",
      },
      {
        name: "Random Sequels",
        size: 6,
        hexColor: "#5e0c45",
      },
      {
        name: "Sci-Fi Cheese",
        size: 5,
        hexColor: "#074d18",
      },
      {
        name: "Horror Docs",
        size: 4,
        hexColor: "#423126",
      },
      {
        name: "Westerns",
        size: 3,
        hexColor: "#afad20",
      },
      {
        name: "Samurai",
        size: 2,
        hexColor: "#fdf91e",
      },
      {
        name: "Drama",
        size: 1,
        hexColor: "#ec6a13",
        fontHexColor: "#000",
      },
    ],
    remarks: categoryMeta["Days of Listmas"],
  },
  {
    order: 13,
    hexColor: "#962828",
    route: "/blood",
    cls: "blood",
    type: "SubCategory",
    name: "Blood!",
    subCategories: [
      {
        name: "90s VHS",
        size: 4,
        hexColor: "#440c62",
      },
      {
        name: "80s Slashers",
        size: 4,
        hexColor: "#440e0e",
      },
      {
        name: "DVD Horror",
        size: 4,
        hexColor: "#2a5a43",
      },
      {
        name: "Exploitation",
        size: 5,
        hexColor: "#52113e",
      },
      {
        name: "Non-Horror",
        size: 4,
        hexColor: "#342527",
      },
      {
        name: "Philippines",
        size: 4,
        hexColor: "#192b6c",
      },
      {
        name: "...And the Rest",
        size: 4,
        hexColor: "#333",
      },
    ],
    remarks: categoryMeta["Blood!"],
  },
];

export const list = async () => {
  console.log("Making list call...");

  let remoteMovieData: any = [];

  if (Cache.movies) {
    console.log("Pulling from cache");
    return Cache.movies;
  }

  console.log("Hitting DB for data");

  const scanData: any = await dynamodb.scan({
    TableName: "MOVIES",
  });

  scanData.Items.forEach((item: any) => {
    if (!item.MyRating) {
      return;
    }
    // TODO: Fill in the data, also need to modify data handling client-side
    let data: any = {
      id: getInt(item.WatchedIndex),
      genres: getStringArray(item.Genres),
      summary: getString(item.Summary),
      backdrop: getString(item.Backdrop),
      cast: getStringArray(item.Cast),
      poster: getString(item.Poster),
      userRating: getFloat(item.UserRating),
      runtime: getInt(item.Runtime),
      tagline: getString(item.Tagline),
      directors: getStringArray(item.Directors),
      title: getString(item.Title),
    };

    if (item.MyRating) {
      data = {
        ...data,
        myRating: getFloat(item.MyRating),
        label: getString(item.Label),
        img: getString(item.IMG),
        watchedDate: getString(item.WatchedDate),
        content: getStringArray(item.Content),
        categoryCls: getString(item.CategoryCls),
        subCategory: getString(item.SubCategory),
        cast: getStringArray(item.Cast),
        order: getString(item.Order),
        tags: item.Tags ? item.Tags.SS : [],
        format: getString(item.Format),
        year: getInt(item.RawYear),
        category: getString(item.Category),
      };
    }

    remoteMovieData.push(data);
  });

  remoteMovieData.sort((a: any, b: any) => {
    return a.id - b.id;
  });

  Cache.movies = remoteMovieData;

  return remoteMovieData;
};

export const setupCategories = async () => {
  let testResp: any = [];

  for (const cat of existingCats) {
    if (cat.order !== 5) {
      continue;
    }

    let putReq = new Promise((resolve, rej) => {
      let data: any = {};

      data.Order = { N: cat.order.toString() };
      data.HexColor = { S: cat.hexColor };
      data.Route = { S: cat.route };
      data.Cls = { S: cat.cls };
      data.Type = { S: cat.type };
      data.Name = { S: cat.name };

      console.log("checking...");

      if (cat.type === "Bracket") {
        console.log("is bracket");

        data.Rounds = {
          L: mmData.rounds.map((r) => {
            return {
              M: {
                Round: { N: r.round },
                Matchups: {
                  L: r.matchups.map((m) => {
                    return {
                      M: {
                        A: { N: m.a },
                        B: { N: m.b },
                        Winner: { N: m.winner },
                        Blurb: { S: m.blurb },
                      },
                    };
                  }),
                },
              },
            };
          }),
        };
      }

      data.Remarks = {
        M: {
          Opening: {
            M: {
              Title: {
                // @ts-ignore
                S: cat.remarks.opening.title || cat.name,
              },
              Date: {
                S: cat.remarks.opening.date,
              },
              Content: {
                L: cat.remarks.opening.content.map((c) => {
                  return { S: c };
                }),
              },
            },
          },
          Closing: {
            M: {
              Title: {
                // @ts-ignore
                S: cat.remarks.closing.title || cat.name,
              },
              Date: {
                S: cat.remarks.closing.date,
              },
              Content: {
                L: cat.remarks.closing.content.map((c) => {
                  return { S: c };
                }),
              },
            },
          },
        },
      };

      if (cat.type === "SubCategory") {
        data.SubCategories = {
          L: cat.subCategories?.map((sc) => {
            let res: any = {};

            res.Size = { N: sc.size.toString() };
            res.Name = { S: sc.name };
            res.HexColor = { S: sc.hexColor };

            if (sc.fontHexColor) {
              res.FontHexColor = { S: sc.fontHexColor };
            }

            return {
              M: res,
            };
          }),
        };
      }

      dynamodb.putItem(
        {
          TableName: "CATEGORIES",
          Item: data,
        },
        (err: any, respData: any) => {
          if (err) {
            resolve(err.message);
          }
          resolve(respData);
        }
      );
    });

    const resp = await putReq;

    testResp.push(resp);
  }

  return testResp;
};

export const TEMPinitLBOX = async () => {
  let testResp = [];
  let i = 0;

  for (const lb of lboxData) {
    i++;

    if (i !== 393) {
      continue;
    }

    let putReq = new Promise((resolve, rej) => {
      let data: any = {};

      data.WatchedIndex = { N: lb.id.toString() };

      if (lb?.cast) {
        data.Cast = { S: lb.cast.join("#_#_#") };
      }
      if (lb?.directors) {
        data.Directors = { S: lb.directors.join("#_#_#") };
      }
      if (lb?.genres) {
        data.Genres = { S: lb.genres.join("#_#_#") };
      }
      if (lb?.summary) {
        data.Summary = { S: lb.summary };
      }
      if (lb?.tagline) {
        data.Tagline = { S: lb.tagline };
      }
      if (lb?.rating) {
        data.UserRating = { N: lb.rating };
      }
      if (lb?.runtime) {
        // @ts-ignore
        data.Runtime = { N: lb.runtime.match(/[0-9]+/)[0] };
      }
      if (lb?.poster) {
        data.Poster = { S: lb.poster };
      }
      if (lb?.backdrop) {
        data.Backdrop = { S: lb.backdrop };
      }
      if (lb?.title) {
        data.Title = { S: lb.title };
      }

      dynamodb.putItem(
        {
          TableName: "MOVIES",
          Item: data,
        },
        (err: any, respData: any) => {
          if (err) {
            resolve(err.message);
          }
          resolve(respData);
        }
      );
    });

    const resp = await putReq;

    testResp.push(resp);
  }

  return testResp;
};

export const migrateFromJson = async (data?: any) => {
  let testResp = [];
  let ids: number[] = [];
  let i = 0;

  const mmap: any = {};

  for (const m of movieData) {
    mmap[m.id] = m;
  }

  // if given a specific data blob, do that
  if (data) {
    mmap[data.id] = data;
    ids.push(data.id);
  } else {
    // otherwise, do all
    for (const m of movieData) {
      ids.push(m.id);
    }
  }

  for (const lb of lboxData) {
    i++;

    // if (i > 5) {
    //   break;
    // }

    if (!ids.includes(lb.id)) {
      continue;
    }

    let putReq = new Promise((resolve, rej) => {
      let data: any = {};

      data.WatchedIndex = { N: lb.id.toString() };

      if (lb?.cast) {
        data.Cast = { S: lb.cast.join("#_#_#") };
      }
      if (lb?.directors) {
        data.Directors = { S: lb.directors.join("#_#_#") };
      }
      if (lb?.genres) {
        data.Genres = { S: lb.genres.join("#_#_#") };
      }
      if (lb?.summary) {
        data.Summary = { S: lb.summary };
      }
      if (lb?.tagline) {
        data.Tagline = { S: lb.tagline };
      }
      if (lb?.rating) {
        data.UserRating = { N: lb.rating };
      }
      if (lb?.runtime) {
        // @ts-ignore
        data.Runtime = { N: lb.runtime.match(/[0-9]+/)[0] };
      }
      if (lb?.poster) {
        data.Poster = { S: lb.poster };
      }
      if (lb?.backdrop) {
        data.Backdrop = { S: lb.backdrop };
      }

      const m = mmap[lb.id];

      if (m) {
        data.IMG = { S: m.img };
        data.Label = { S: m.label };
        data.Format = { S: m.format };
        data.Title = { S: m.title };
        data.WatchedDate = { S: m.date };
        data.Content = { S: m.content.join("#_#_#") };
        // @ts-ignore
        data.MyRating = { N: extractRating(m) };

        if (m.tags) {
          data.Tags = { SS: m.tags };
        }

        if (m.rawYear) {
          data.RawYear = { N: m.rawYear?.toString() };
        }

        if (m.category) {
          data.Category = { S: m.category };
        }

        if (m.categoryCls) {
          data.CategoryCls = { S: m.categoryCls };
        }

        if (m.subCategory) {
          data.SubCategory = { S: m.subCategory };
        }

        if (m.order) {
          data.Order = { S: m.order.trim() };
        }
      }

      dynamodb.putItem(
        {
          TableName: "MOVIES",
          Item: data,
        },
        (err: any, respData: any) => {
          if (err) {
            resolve(err.message);
          }
          resolve(respData);
        }
      );
    });

    const resp = await putReq;

    testResp.push(resp);
  }

  return testResp;
};
