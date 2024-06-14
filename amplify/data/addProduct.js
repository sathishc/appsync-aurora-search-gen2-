import { toJsonObject, createPgStatement, select, sql, insert } from '@aws-appsync/utils/rds';
import { util } from '@aws-appsync/utils';

/**
 * Send the SQL request
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    console.log(" Context in addProduct",ctx.args)
    const { input: values } = ctx.args;
    
    return ctx.args;
    /*
    const insertStatement = insert({ table: 'product_info', values });
    
    // Generates statement:
    // INSERT INTO `persons`(`name`)
    // VALUES(:NAME)
    return createPgStatement(insertStatement)
    */
}

/**
 * Send the response
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the product and related products
 */
export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    util.appendError("Context in addProduct", "context", ctx.args);
    return util.appendError(error.message, error.type, result);
  }

  const object = toJsonObject(result);
  console.log('>>>', object);
  const product = object[0][0];
  product.related = object[1];
  return product;
}