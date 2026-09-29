import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './ngosFields';

export default function NgosFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
