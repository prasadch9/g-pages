import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './roofingFields';

export default function RoofingFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
