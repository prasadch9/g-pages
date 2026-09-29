import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './multispecialityFields';

export default function MultispecialityFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
