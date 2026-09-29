import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './coffeeShopsFields';

export default function CoffeeShopsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
