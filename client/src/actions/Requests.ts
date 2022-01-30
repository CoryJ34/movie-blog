interface Body {
  query: string;
  variables?: any;
}

export const gqlRequest = async (
  query: string,
  variables?: any
): Promise<Response> => {
  let body: Body = { query };

  if (variables) {
    body.variables = variables;
  }

  return await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
};
