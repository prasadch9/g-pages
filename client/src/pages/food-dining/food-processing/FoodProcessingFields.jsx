import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './foodProcessingFields';

export default function FoodProcessingFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
