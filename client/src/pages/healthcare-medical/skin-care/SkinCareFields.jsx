import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './skinCareFields';

export default function SkinCareFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
