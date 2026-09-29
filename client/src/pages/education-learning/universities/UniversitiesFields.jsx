import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './universitiesFields';

export default function UniversitiesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
