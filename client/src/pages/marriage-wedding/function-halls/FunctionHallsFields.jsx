import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './functionHallsFields';

export default function FunctionHallsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
