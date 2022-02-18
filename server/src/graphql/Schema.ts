import { buildSchema } from "graphql";

const schema = buildSchema(`
  enum Field {
    TAG,
    YEAR,
    DECADE,
    WATCHLIST,
    LABEL,
    FORMAT,
    START_DATE,
    END_DATE,
    YEAR_START,
    YEAR_END,
  }

  input MovieFilter {
    field: Field!
    values: [String!]
  }

  type Movie {
    id: Int!
    title: String!
    year: Int!
    genres: [String]
    summary: String
    backdrop: String
    cast: [String]
    poster: String
    userRating: Float
    runtime: Int
    tagline: String
    directors: [String]
    myRating: Float
    label: String
    img: String
    watchedDate: String
    content: [String]
    categoryCls: String
    subCategory: String
    order: String
    tags: [String]
    format: String
    category: String
  }

  type ListResponse {
    matches: [Movie],
    all: [Movie],
    count: Int!
  }

  type SubCategory {
      name: String!,
      size: Int!,
      hexColor: String,
      fontHexColor: String
  }

  type Remark {
    title: String!,
    date: String!,
    content: [String!]!
  }

  type Remarks {
    opening: Remark,
    closing: Remark
  }

  type Matchup {
    a: Int!,
    b: Int!,
    winner: Int!,
    blurb: String!
  }

  type Round {
    round: Int!,
    matchups: [Matchup!]!
  }

  type Category {
      order: Int!,
      name: String!,
      cls: String!,
      route: String!,
      hexColor: String!,
      type: String!,
      subCategories: [SubCategory!]!,
      remarks: Remarks,
      rounds: [Round]
  }

  type ListCategoriesResponse {
      categories: [Category]
  }

  type Query {
    hello(testVar: String!): String
    listMovies(test: String, filters: [MovieFilter]): ListResponse
    listCategories: ListCategoriesResponse
    refreshCache: String
  }
`);

export default schema;
