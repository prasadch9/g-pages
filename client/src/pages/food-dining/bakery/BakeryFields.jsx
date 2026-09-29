import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './bakeryFields';

export default function BakeryFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
