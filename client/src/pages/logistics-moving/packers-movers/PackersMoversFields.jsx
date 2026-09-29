import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './packersMoversFields';

export default function PackersMoversFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
