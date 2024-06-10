import { sql, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds';
import { util } from '@aws-appsync/utils';

/**
 * @param {import('@aws-appsync/utils').Context} ctx the context
 */
export function request(ctx) {
  // const string = `${ctx.prev.result}`;
  const statement = sql`
SELECT product_id, product_name, category, discounted_price, actual_price, discount_percentage, rating, rating_count, about_product
FROM product_info ORDER BY embedding <-> ${`${ctx.prev.result}`}::vector LIMIT ${ctx.args.limit ?? 10}
`;
  console.log(statement);
  return createPgStatement(statement);
}

/**
 * The search results
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return toJsonObject(result)[0];
}
