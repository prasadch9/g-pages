import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './collegesFields';

export default function CollegesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
