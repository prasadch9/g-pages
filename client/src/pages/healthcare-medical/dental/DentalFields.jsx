import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './dentalFields';

export default function DentalFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
