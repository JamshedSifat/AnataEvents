/**
 * Public form endpoints.
 *
 * Thin re-export so pages can `import { formsApi } from '../../services/forms'`
 * without pulling the whole content client.
 */
import { formsApi } from './content';

export { formsApi };
export default formsApi;
