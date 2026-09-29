import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './restaurantsFields';

export default function RestaurantsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
