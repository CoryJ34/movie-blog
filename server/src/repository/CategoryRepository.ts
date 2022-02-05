import {
  dynamodb,
  getInt,
  getObjectArray,
  getString,
} from "./RepositoryCommons";

import Cache from "./Cache";

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

      data.subCategories = scs;
    }

    categoryItems.push(data);
  });

  Cache.categories = categoryItems;

  return categoryItems;
};
