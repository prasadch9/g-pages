import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './churchesFields';

export default function ChurchesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
