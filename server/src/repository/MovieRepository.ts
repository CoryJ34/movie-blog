import movieData from "../data/test-data";
import lboxData from "../data/lbox-data";
import lboxDataCurr from "../data/lbox-data-CURR";
import TitleBreakout from "../../../client/src/models/TitleBreakout";
import { extractRating } from "../utils/TransferUtils";
import Movie from "../../types/Movie";
import Cache from "./Cache";
import {
  dynamodb,
  getFloat,
  getInt,
  getString,
  getStringArray,
  // s3,
} from "./RepositoryCommons";
import mmData from "../data/march-madness-data";

export const list = async () => {
  console.log("Making list call...");

  // const s3Test = await s3.listObjects({
  //   Bucket: "einymovies.com",
  // });

  // const s3ImgTest = await s3.getObject({
  //   Bucket: "einymovies.com",
  //   Key: "PXL_20230506_212154205.jpg",
  // });

  // console.log(s3ImgTest.B);

  let remoteMovieData: any = [];

  if (Cache.movies) {
    console.log("Pulling from cache");
    return Cache.movies;
  }

  console.log("Hitting DB for data");

  /**
   * Use paginated strategy to continually retrieve since we've started to hit return size limits
   */
  let lastEvaluatedKey = null;
  let allItems: any[] = [];

  while (true) {
    let resp: any = {};
    if (lastEvaluatedKey == null) {
      try {
        resp = await dynamodb.scan({
          TableName: "MOVIES",
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        resp = await dynamodb.scan({
          TableName: "MOVIES",
          ExclusiveStartKey: lastEvaluatedKey,
        });
      } catch (e) {
        console.log(e);
      }
    }

    allItems = allItems.concat(resp.Items);

    if (resp["LastEvaluatedKey"]) {
      lastEvaluatedKey = resp["LastEvaluatedKey"];
    } else {
      break;
    }
  }

  allItems.forEach((item: any) => {
    if (!item.MyRating) {
      return;
    }

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
    } else {
      console.log("NO RATING: " + item.title);
    }

    remoteMovieData.push(data);
  });

  remoteMovieData.sort((a: any, b: any) => {
    return a.id - b.id;
  });

  Cache.movies = remoteMovieData;

  return remoteMovieData;
};

export const TEMPinitLBOX = async () => {
  return saveMovieList(lboxDataCurr);
};

export const saveMovieList = async (movieList: Movie[]) => {
  let testResp = [];
  let i = 0;

  // for (const lb of lboxData) {
  for (const lb of movieList) {
    i++;

    // if (i !== 23) {
    //   continue;
    // }

    // if (lb.id !== 675 && lb.id !== 676 && lb.id !== 688) {
    //   continue;
    // }

    console.log("trying.." + lb.id);

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
            resolve({
              status: "error",
              result: err.message,
            });
          }
          resolve({
            status: "success",
            result: respData,
          });
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

  for (const lb of lboxDataCurr) {
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

      console.log(data);

      dynamodb.putItem(
        {
          TableName: "MOVIES",
          Item: data,
        },
        (err: any, respData: any) => {
          if (err) {
            console.log(err);
            resolve(err.message);
          } else {
            console.log("NO ERROR?");
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
