import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './hotelsFields';

export default function HotelsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
