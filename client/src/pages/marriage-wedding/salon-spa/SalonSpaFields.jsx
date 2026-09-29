import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './salonSpaFields';

export default function SalonSpaFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
