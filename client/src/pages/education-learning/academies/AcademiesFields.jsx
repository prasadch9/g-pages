import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './academiesFields';

export default function AcademiesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
