import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './shoppingMallsFields';

export default function ShoppingMallsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
