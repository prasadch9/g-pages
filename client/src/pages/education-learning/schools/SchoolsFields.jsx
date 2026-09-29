import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './schoolsFields';

export default function SchoolsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
