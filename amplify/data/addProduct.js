import { toJsonObject, createPgStatement, select, sql, insert } from '@aws-appsync/utils/rds';
import { util } from '@aws-appsync/utils';

/**
 * Send the SQL request
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    const { input: values } = ctx.args;
    const insertStatement = insert({ table: 'product_info', values });
    
    // Generates statement:
    // INSERT INTO `persons`(`name`)
    // VALUES(:NAME)
    return createPgStatement(insertStatement)
}

/**
 * Send the response
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the product and related products
 */
export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  const object = toJsonObject(result);
  console.log('>>>', object);
  const product = object[0][0];
  product.related = object[1];
  return product;
}