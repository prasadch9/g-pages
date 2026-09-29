import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './carShowroomsFields';

export default function CarShowroomsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
