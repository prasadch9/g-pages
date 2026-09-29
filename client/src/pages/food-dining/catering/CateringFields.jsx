import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './cateringFields';

export default function CateringFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
