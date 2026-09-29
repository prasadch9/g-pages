import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './sculpturesFields';

export default function SculpturesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
