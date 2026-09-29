import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './entFields';

export default function EntFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
