import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './associationsFields';

export default function AssociationsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
