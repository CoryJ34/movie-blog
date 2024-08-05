import {
  dynamodb,
  getInt,
  getObjectArray,
  getString,
  getStringArray,
  getStringArrayFromList,
} from "./RepositoryCommons";

import Cache from "./Cache";

export const saveWatchlist = async (watchlistData: any) => {
  let putReq = new Promise((resolve, rej) => {
    console.log(watchlistData.Rounds[0]);
    dynamodb.putItem(
      {
        TableName: "CATEGORIES",
        Item: watchlistData,
      },
      (err: any, respData: any) => {
        if (err) {
          console.log(err);
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

  const res = await putReq;

  return res;
};

export const listCategories = async () => {
  let categoryItems: any = [];

  if (Cache.categories) {
    console.log("Pulling categories from cache");
    return Cache.categories;
  }

  const scanData: any = await dynamodb.scan({
    TableName: "CATEGORIES",
  });

  scanData.Items.forEach((item: any) => {
    let data: any = {
      order: getInt(item.Order),
      name: getString(item.Name),
      cls: getString(item.Cls),
      type: getString(item.Type),
      route: getString(item.Route),
      hexColor: getString(item.HexColor),
    };

    const subCategories = getObjectArray(item.SubCategories);

    if (subCategories) {
      const scs = subCategories.map((sc: any) => {
        return {
          size: getInt(sc.Size),
          name: getString(sc.Name),
          hexColor: getString(sc.HexColor),
          fontHexColor: getString(sc.FontHexColor),
        };
      });

      const remarks: any = item.Remarks;

      if (remarks) {
        let remarksData: any = {};
        const opening = remarks.M.Opening;

        if (opening) {
          remarksData.opening = {
            title: getString(opening.M.Title),
            date: getString(opening.M.Date),
            content: getStringArrayFromList(opening.M.Content),
          };
        }

        const closing = remarks.M.Closing;

        if (closing) {
          remarksData.closing = {
            title: getString(closing.M.Title),
            date: getString(closing.M.Date),
            content: getStringArrayFromList(closing.M.Content),
          };
        }

        // console.log(remarksData);

        data.remarks = remarksData;
      }

      const rounds: any = item.Rounds;

      if (rounds) {
        let dataRounds: any = [];

        rounds.L.forEach((r: any) => {
          const round = getInt(r.M.Round);
          const matchups = r.M.Matchups.L.map((m: any) => {
            return {
              a: getInt(m.M.A),
              b: getInt(m.M.B),
              winner: getInt(m.M.Winner),
              blurb: getString(m.M.Blurb),
            };
          });

          dataRounds.push({
            round,
            matchups,
          });
        });

        data.rounds = dataRounds;
      }

      data.subCategories = scs;
    }

    categoryItems.push(data);
  });

  Cache.categories = categoryItems;

  return categoryItems;
};
