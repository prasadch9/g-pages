import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './furnitureShopsFields';

export default function FurnitureShopsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
